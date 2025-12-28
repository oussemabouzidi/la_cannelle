export type AppLanguage = 'EN' | 'DE';

export const DEFAULT_TRANSLATABLE_KEYS = new Set(['name', 'description', 'label']);

const TARGET_LANG_BY_APP_LANGUAGE: Record<AppLanguage, string> = {
  EN: 'EN-GB',
  DE: 'DE'
};

const DEFAULT_CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const DEFAULT_CACHE_MAX_ENTRIES = 5000;
const DEFAULT_MAX_TEXTS_PER_REQUEST = 50;
const DEFAULT_MAX_CHARS_PER_REQUEST = 12000;
const DEFAULT_HTTP_TIMEOUT_MS = 8000;

const cacheTtlMs = Number(process.env.TRANSLATION_CACHE_TTL_MS) || DEFAULT_CACHE_TTL_MS;
const cacheMaxEntries = Number(process.env.TRANSLATION_CACHE_MAX_ENTRIES) || DEFAULT_CACHE_MAX_ENTRIES;
const maxTextsPerRequest = Number(process.env.DEEPL_MAX_TEXTS_PER_REQUEST) || DEFAULT_MAX_TEXTS_PER_REQUEST;
const maxCharsPerRequest = Number(process.env.DEEPL_MAX_CHARS_PER_REQUEST) || DEFAULT_MAX_CHARS_PER_REQUEST;
const httpTimeoutMs = Number(process.env.TRANSLATION_HTTP_TIMEOUT_MS) || DEFAULT_HTTP_TIMEOUT_MS;
const allowPublicFallback = String(process.env.TRANSLATION_ALLOW_PUBLIC_FALLBACK || '').toLowerCase() === 'true';

type CacheEntry = { value: string; expiresAt: number };
const translationCache = new Map<string, CacheEntry>();

const normalizeTextForCache = (text: string) => text;

const makeCacheKey = (targetLang: string, text: string) =>
  `${targetLang}:${normalizeTextForCache(text)}`;

const getCached = (targetLang: string, text: string) => {
  const key = makeCacheKey(targetLang, text);
  const entry = translationCache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    translationCache.delete(key);
    return undefined;
  }
  return entry.value;
};

const setCached = (targetLang: string, text: string, value: string) => {
  const key = makeCacheKey(targetLang, text);
  translationCache.set(key, { value, expiresAt: Date.now() + cacheTtlMs });
  if (translationCache.size > cacheMaxEntries) {
    const oldest = translationCache.keys().next().value as string | undefined;
    if (oldest) translationCache.delete(oldest);
  }
};

const fetchWithTimeout = async (url: string | URL, init: any) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), httpTimeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const parseAppLanguage = (value: unknown): AppLanguage | undefined => {
  if (value === null || value === undefined) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;

  // Support headers like: "de-DE,de;q=0.9,en;q=0.8"
  const first = raw.split(',')[0]?.trim();
  const normalized = (first || raw).toUpperCase();
  if (normalized.startsWith('DE')) return 'DE';
  if (normalized.startsWith('EN')) return 'EN';
  return undefined;
};

const deeplTranslateBatch = async (texts: string[], targetLang: string) => {
  const apiKey = process.env.DEEPL_API_KEY?.trim();
  if (!apiKey) return undefined;

  const apiUrl = (process.env.DEEPL_API_URL?.trim() || 'https://api-free.deepl.com/v2/translate').replace(
    /\/$/,
    ''
  );
  const body = new URLSearchParams();
  for (const text of texts) body.append('text', text);
  body.set('target_lang', targetLang);
  body.set('preserve_formatting', '1');

  const response = await fetchWithTimeout(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`DeepL translate failed (${response.status}): ${errorText || response.statusText}`);
  }

  const json = (await response.json()) as any;
  const translated = Array.isArray(json?.translations)
    ? json.translations.map((t: any) => String(t?.text ?? ''))
    : [];

  if (translated.length !== texts.length) {
    throw new Error('DeepL translate returned unexpected result length');
  }

  return translated;
};

const myMemoryTranslateBatch = async (texts: string[], targetLang: string) => {
  // MyMemory is a free public API but rate limited; use only as fallback.
  const to = targetLang.startsWith('DE') ? 'de' : 'en';

  const translated: string[] = [];
  for (const text of texts) {
    const url = new URL('https://api.mymemory.translated.net/get');
    url.searchParams.set('q', text);
    url.searchParams.set('langpair', `auto|${to}`);

    const response = await fetchWithTimeout(url, { method: 'GET' });
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`MyMemory translate failed (${response.status}): ${errorText || response.statusText}`);
    }
    const json = (await response.json()) as any;
    const out = json?.responseData?.translatedText;
    translated.push(String(out ?? ''));
  }

  return translated;
};

export const translateTexts = async (texts: string[], language: AppLanguage): Promise<string[]> => {
  const targetLang = TARGET_LANG_BY_APP_LANGUAGE[language];
  const hasDeeplKey = Boolean(process.env.DEEPL_API_KEY?.trim());

  const results = new Array<string>(texts.length);
  const missing: Array<{ index: number; text: string }> = [];

  for (let i = 0; i < texts.length; i += 1) {
    const text = texts[i] ?? '';
    if (!text || !String(text).trim()) {
      results[i] = text;
      continue;
    }
    const cached = getCached(targetLang, text);
    if (cached !== undefined) {
      results[i] = cached;
      continue;
    }
    missing.push({ index: i, text });
  }

  if (missing.length === 0) return results;

  if (!hasDeeplKey && !allowPublicFallback) {
    for (const entry of missing) {
      setCached(targetLang, entry.text, entry.text);
      results[entry.index] = entry.text;
    }
    return results;
  }

  const translateAndApply = async (translateFn: (batch: string[], target: string) => Promise<string[]>) => {
    let currentBatch: Array<{ index: number; text: string }> = [];
    let currentChars = 0;

    const flush = async () => {
      if (currentBatch.length === 0) return;
      const batchTexts = currentBatch.map((entry) => entry.text);
      const translated = await translateFn(batchTexts, targetLang);
      for (let j = 0; j < currentBatch.length; j += 1) {
        const original = currentBatch[j]!.text;
        const output = translated[j] ?? '';
        setCached(targetLang, original, output);
        results[currentBatch[j]!.index] = output;
      }
      currentBatch = [];
      currentChars = 0;
    };

    for (const entry of missing) {
      const nextLen = entry.text.length;
      const wouldExceedCount = currentBatch.length >= maxTextsPerRequest;
      const wouldExceedChars = currentChars + nextLen > maxCharsPerRequest;
      if (wouldExceedCount || wouldExceedChars) {
        await flush();
      }
      currentBatch.push(entry);
      currentChars += nextLen;
    }

    await flush();
  };

  try {
    await translateAndApply(async (batch, target) => {
      if (hasDeeplKey) {
        const deepl = await deeplTranslateBatch(batch, target);
        if (deepl) return deepl;
      }
      return myMemoryTranslateBatch(batch, target);
    });
  } catch (error) {
    console.warn('Translation failed; returning original text.', error);
    for (const entry of missing) results[entry.index] = entry.text;
  }

  return results;
};

type StringRef = { container: any; key: string; value: string };

const collectStringRefsByKeys = (data: unknown, keys: Set<string>, refs: StringRef[]) => {
  if (!data) return;

  if (Array.isArray(data)) {
    for (const item of data) collectStringRefsByKeys(item, keys, refs);
    return;
  }

  if (typeof data !== 'object') return;

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (typeof value === 'string' && keys.has(key)) {
      refs.push({ container: data as any, key, value });
      continue;
    }
    collectStringRefsByKeys(value, keys, refs);
  }
};

export const translateJsonByKeys = async <T>(data: T, language: AppLanguage, keys: Set<string>): Promise<T> => {
  const refs: StringRef[] = [];
  collectStringRefsByKeys(data, keys, refs);
  if (refs.length === 0) return data;

  const unique = new Map<string, string>();
  const textsToTranslate: string[] = [];
  for (const ref of refs) {
    if (unique.has(ref.value)) continue;
    unique.set(ref.value, ref.value);
    textsToTranslate.push(ref.value);
  }

  const translated = await translateTexts(textsToTranslate, language);
  for (let i = 0; i < textsToTranslate.length; i += 1) {
    unique.set(textsToTranslate[i]!, translated[i]!);
  }

  for (const ref of refs) {
    ref.container[ref.key] = unique.get(ref.value) ?? ref.value;
  }

  return data;
};

const isMissing = (value: unknown) => value === null || value === undefined || String(value).trim() === '';

export const fillAccessoryTranslations = async <T extends { [key: string]: any }>(
  data: T | T[],
  language: AppLanguage
) => {
  if (language !== 'DE') return data;

  const list = Array.isArray(data) ? data : [data];
  const refs: Array<{ container: any; key: string; source: string }> = [];

  for (const accessory of list) {
    if (!accessory || typeof accessory !== 'object') continue;

    if (isMissing(accessory.nameDe) && !isMissing(accessory.nameEn)) {
      refs.push({ container: accessory, key: 'nameDe', source: String(accessory.nameEn) });
    }
    if (isMissing(accessory.descriptionDe) && !isMissing(accessory.descriptionEn)) {
      refs.push({ container: accessory, key: 'descriptionDe', source: String(accessory.descriptionEn) });
    }
    if (isMissing(accessory.detailsDe) && !isMissing(accessory.detailsEn)) {
      refs.push({ container: accessory, key: 'detailsDe', source: String(accessory.detailsEn) });
    }
    if (isMissing(accessory.unitDe) && !isMissing(accessory.unitEn)) {
      refs.push({ container: accessory, key: 'unitDe', source: String(accessory.unitEn) });
    }
  }

  if (refs.length === 0) return data;

  const unique = new Map<string, string>();
  const textsToTranslate: string[] = [];
  for (const ref of refs) {
    if (unique.has(ref.source)) continue;
    unique.set(ref.source, ref.source);
    textsToTranslate.push(ref.source);
  }

  const translated = await translateTexts(textsToTranslate, language);
  for (let i = 0; i < textsToTranslate.length; i += 1) {
    unique.set(textsToTranslate[i]!, translated[i]!);
  }

  for (const ref of refs) {
    ref.container[ref.key] = unique.get(ref.source) ?? ref.source;
  }

  return data;
};
