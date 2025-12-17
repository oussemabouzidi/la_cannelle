'use client';

import { useState, useEffect } from 'react';
import { translations, TranslationModule } from '../translations';
export type Language = 'EN' | 'DE';

export function useTranslation(module: TranslationModule = 'common') {
  // Default to EN to align with the rest of the public pages; hydrate from storage on mount
  const [language, setLanguage] = useState<Language>('EN');

  // Load saved language once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('language') as Language | null;
    if (saved === 'EN' || saved === 'DE') {
      setLanguage(saved);
    }
  }, []);

  // Persist language changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('language', language);
  }, [language]);

  // Sync across tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'language' && (event.newValue === 'EN' || event.newValue === 'DE')) {
        setLanguage(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Save language to localStorage when it changes
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  // Toggle between EN and DE
  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'EN' ? 'DE' : 'EN';
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', next);
      }
      return next;
    });
  };

  // Simple, safe translation resolution with fallback to EN and common
  const mod = translations[module] ?? translations.common;
  const baseEN = translations.common.EN;
  const baseLang = translations.common[language] ?? baseEN;
  const modEN = mod.EN ?? {};
  const modLang = mod[language] ?? modEN;

  // Merge common + module so missing keys still resolve
  const t = { ...baseEN, ...baseLang, ...modEN, ...modLang };

  return {
    t,
    language,
    setLanguage: changeLanguage,
    toggleLanguage,
  };
}

// Helper to get nested translation value
export function getTranslation(
  obj: any,
  path: string,
  defaultValue: string = ''
): string {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  
  return typeof value === 'string' ? value : defaultValue;
}
