import { prisma } from '../prisma';
import { translationService } from './translationService';

const chunk = <T,>(items: T[], size: number) => {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
};

export const translationBackfillService = {
  async backfillProductsDe(products: Array<{
    id: number;
    name: string;
    description: string;
    nameDe?: string | null;
    descriptionDe?: string | null;
    ingredients?: any;
    ingredientsDe?: any;
    allergens?: any;
    allergensDe?: any;
    productCategories?: any;
    productCategoriesDe?: any;
  }>) {
    const missingNames = products.filter(p => !p.nameDe && p.name);
    const missingDescriptions = products.filter(p => !p.descriptionDe && p.description);

    for (const batch of chunk(missingNames, 25)) {
      const translated = await translationService.translateTexts(batch.map(p => p.name), { targetLang: 'DE' });
      if (!translated) return;
      await Promise.all(batch.map((p, idx) => prisma.product.update({
        where: { id: p.id },
        data: { nameDe: translated[idx] ?? null }
      })));
      batch.forEach((p, idx) => { (p as any).nameDe = translated[idx] ?? null; });
    }

    for (const batch of chunk(missingDescriptions, 10)) {
      const translated = await translationService.translateTexts(batch.map(p => p.description), { targetLang: 'DE' });
      if (!translated) return;
      await Promise.all(batch.map((p, idx) => prisma.product.update({
        where: { id: p.id },
        data: { descriptionDe: translated[idx] ?? null }
      })));
      batch.forEach((p, idx) => { (p as any).descriptionDe = translated[idx] ?? null; });
    }

    const normalizeStringArray = (value: unknown) => {
      if (!Array.isArray(value)) return [];
      return value
        .map((item) => String(item ?? '').trim())
        .filter((item) => item.length > 0);
    };

    const missingIngredients = products.filter(p => !p.ingredientsDe && normalizeStringArray((p as any).ingredients).length > 0);
    for (const product of missingIngredients) {
      const ingredients = normalizeStringArray((product as any).ingredients);
      const translated = await translationService.translateTexts(ingredients, { targetLang: 'DE' });
      if (!translated) return;
      await prisma.product.update({
        where: { id: product.id },
        data: { ingredientsDe: translated }
      });
      (product as any).ingredientsDe = translated;
    }

    const missingAllergens = products.filter(p => !p.allergensDe && normalizeStringArray((p as any).allergens).length > 0);
    for (const product of missingAllergens) {
      const allergens = normalizeStringArray((product as any).allergens);
      const translated = await translationService.translateTexts(allergens, { targetLang: 'DE' });
      if (!translated) return;
      await prisma.product.update({
        where: { id: product.id },
        data: { allergensDe: translated }
      });
      (product as any).allergensDe = translated;
    }

    const missingProductCategories = products.filter(p => !p.productCategoriesDe && normalizeStringArray((p as any).productCategories).length > 0);
    for (const product of missingProductCategories) {
      const categories = normalizeStringArray((product as any).productCategories);
      const translated = await translationService.translateTexts(categories, { targetLang: 'DE' });
      if (!translated) return;
      await prisma.product.update({
        where: { id: product.id },
        data: { productCategoriesDe: translated }
      });
      (product as any).productCategoriesDe = translated;
    }
  },

  async backfillAccessoriesDe(accessories: Array<{
    id: number;
    nameEn: string;
    nameDe?: string | null;
    descriptionEn: string;
    descriptionDe?: string | null;
    detailsEn?: string | null;
    detailsDe?: string | null;
    unitEn?: string | null;
    unitDe?: string | null;
  }>) {
    const missingNames = accessories.filter(a => !a.nameDe && a.nameEn);
    const missingDescriptions = accessories.filter(a => !a.descriptionDe && a.descriptionEn);
    const missingDetails = accessories.filter(a => !a.detailsDe && a.detailsEn);
    const missingUnits = accessories.filter(a => !a.unitDe && a.unitEn);

    for (const batch of chunk(missingNames, 25)) {
      const translated = await translationService.translateTexts(batch.map(a => a.nameEn), { targetLang: 'DE' });
      if (!translated) return;
      await Promise.all(batch.map((a, idx) => prisma.accessory.update({
        where: { id: a.id },
        data: { nameDe: translated[idx] ?? null }
      })));
      batch.forEach((a, idx) => { (a as any).nameDe = translated[idx] ?? null; });
    }

    for (const batch of chunk(missingDescriptions, 10)) {
      const translated = await translationService.translateTexts(batch.map(a => a.descriptionEn), { targetLang: 'DE' });
      if (!translated) return;
      await Promise.all(batch.map((a, idx) => prisma.accessory.update({
        where: { id: a.id },
        data: { descriptionDe: translated[idx] ?? null }
      })));
      batch.forEach((a, idx) => { (a as any).descriptionDe = translated[idx] ?? null; });
    }

    for (const batch of chunk(missingDetails, 10)) {
      const translated = await translationService.translateTexts(batch.map(a => a.detailsEn || ''), { targetLang: 'DE' });
      if (!translated) return;
      await Promise.all(batch.map((a, idx) => prisma.accessory.update({
        where: { id: a.id },
        data: { detailsDe: translated[idx] ? translated[idx] : null }
      })));
      batch.forEach((a, idx) => { (a as any).detailsDe = translated[idx] ? translated[idx] : null; });
    }

    for (const batch of chunk(missingUnits, 25)) {
      const translated = await translationService.translateTexts(batch.map(a => a.unitEn || ''), { targetLang: 'DE' });
      if (!translated) return;
      await Promise.all(batch.map((a, idx) => prisma.accessory.update({
        where: { id: a.id },
        data: { unitDe: translated[idx] ? translated[idx] : null }
      })));
      batch.forEach((a, idx) => { (a as any).unitDe = translated[idx] ? translated[idx] : null; });
    }
  },

  async backfillMenusDe(menus: Array<{ id: number; name: string; description: string; nameDe?: string | null; descriptionDe?: string | null }>) {
    const missingNames = menus.filter(m => !m.nameDe && m.name);
    const missingDescriptions = menus.filter(m => !m.descriptionDe && m.description);

    for (const batch of chunk(missingNames, 25)) {
      const translated = await translationService.translateTexts(batch.map(m => m.name), { targetLang: 'DE' });
      if (!translated) return;
      await Promise.all(batch.map((m, idx) => prisma.menu.update({
        where: { id: m.id },
        data: { nameDe: translated[idx] ?? null }
      })));
      batch.forEach((m, idx) => { (m as any).nameDe = translated[idx] ?? null; });
    }

    for (const batch of chunk(missingDescriptions, 10)) {
      const translated = await translationService.translateTexts(batch.map(m => m.description), { targetLang: 'DE' });
      if (!translated) return;
      await Promise.all(batch.map((m, idx) => prisma.menu.update({
        where: { id: m.id },
        data: { descriptionDe: translated[idx] ?? null }
      })));
      batch.forEach((m, idx) => { (m as any).descriptionDe = translated[idx] ?? null; });
    }
  },

  async backfillMenuStepsDe(menus: Array<{ id: number; steps?: any }>) {
    const targets: Array<{ menuId: number; stepIndex: number; text: string }> = [];

    menus.forEach((menu) => {
      const steps = Array.isArray((menu as any).steps) ? (menu as any).steps : null;
      if (!steps) return;

      steps.forEach((step: any, stepIndex: number) => {
        const label = typeof step?.label === 'string' ? step.label.trim() : '';
        if (!label) return;
        const labelDe = typeof step?.labelDe === 'string' ? step.labelDe.trim() : '';
        if (labelDe) return;
        targets.push({ menuId: menu.id, stepIndex, text: label });
      });
    });

    for (const batch of chunk(targets, 25)) {
      const translated = await translationService.translateTexts(batch.map((t) => t.text), { targetLang: 'DE' });
      if (!translated) return;

      const stepsByMenuId = new Map<number, any[]>();

      const getMenuSteps = (menuId: number) => {
        const existing = stepsByMenuId.get(menuId);
        if (existing) return existing;
        const menu = menus.find((m) => m.id === menuId);
        const steps = Array.isArray((menu as any)?.steps) ? (menu as any).steps : [];
        const cloned = steps.map((step: any) => (step && typeof step === 'object' ? { ...step } : step));
        stepsByMenuId.set(menuId, cloned);
        return cloned;
      };

      batch.forEach((target, index) => {
        const nextSteps = getMenuSteps(target.menuId);
        const currentStep = nextSteps[target.stepIndex];
        if (!currentStep || typeof currentStep !== 'object') return;
        nextSteps[target.stepIndex] = { ...currentStep, labelDe: translated[index] ?? null };
      });

      await Promise.all(
        Array.from(stepsByMenuId.entries()).map(([menuId, steps]) =>
          prisma.menu.update({
            where: { id: menuId },
            data: { steps }
          })
        )
      );

      stepsByMenuId.forEach((steps, menuId) => {
        const menu = menus.find((m) => m.id === menuId);
        if (menu) (menu as any).steps = steps;
      });
    }
  },

  async backfillServicesDe(services: Array<{ id: number; name: string; description?: string | null; nameDe?: string | null; descriptionDe?: string | null }>) {
    const missingNames = services.filter(s => !s.nameDe && s.name);
    const missingDescriptions = services.filter(s => !s.descriptionDe && s.description);

    for (const batch of chunk(missingNames, 25)) {
      const translated = await translationService.translateTexts(batch.map(s => s.name), { targetLang: 'DE' });
      if (!translated) return;
      await Promise.all(batch.map((s, idx) => prisma.service.update({
        where: { id: s.id },
        data: { nameDe: translated[idx] ?? null }
      })));
      batch.forEach((s, idx) => { (s as any).nameDe = translated[idx] ?? null; });
    }

    for (const batch of chunk(missingDescriptions, 10)) {
      const translated = await translationService.translateTexts(batch.map(s => s.description || ''), { targetLang: 'DE' });
      if (!translated) return;
      await Promise.all(batch.map((s, idx) => prisma.service.update({
        where: { id: s.id },
        data: { descriptionDe: translated[idx] ? translated[idx] : null }
      })));
      batch.forEach((s, idx) => { (s as any).descriptionDe = translated[idx] ? translated[idx] : null; });
    }
  }
};
