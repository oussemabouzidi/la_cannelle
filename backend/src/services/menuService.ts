import { prisma } from '../prisma';
import { AppError } from '../middleware/errorHandler';
import { normalizeImageValue } from '../utils/uploads';
import { translationService } from './translationService';
import { translationBackfillService } from './translationBackfillService';
import { DEFAULT_MENUS } from '../data/defaultMenus';

const isDeeplAutoTranslateOnReadEnabled = () => {
  const raw = process.env.DEEPL_AUTO_TRANSLATE_ON_READ;
  if (raw === undefined) return true;
  const normalized = String(raw).trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

export const menuService = {
  async getMenus(filters?: {
    isActive?: boolean;
    search?: string;
    serviceId?: number;
    includeImages?: boolean;
  }) {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { nameDe: { contains: filters.search } },
        { description: { contains: filters.search } },
        { descriptionDe: { contains: filters.search } }
      ];
    }

    if (filters?.serviceId) {
      where.menuServices = { some: { serviceId: filters.serviceId } };
    }

    const includeImages = Boolean(filters?.includeImages);

    const select: any = {
      id: true,
      name: true,
      nameDe: true,
      description: true,
      descriptionDe: true,
      isActive: true,
      startDate: true,
      endDate: true,
      price: true,
      minPeople: true,
      steps: true,
      createdAt: true,
      updatedAt: true,
      menuProducts: { select: { productId: true } },
      menuServices: { select: { serviceId: true } }
    };
    if (includeImages) {
      select.image = true;
    }

    const menus = await prisma.menu.findMany({
      where,
      select,
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (isDeeplAutoTranslateOnReadEnabled()) {
      await translationBackfillService.backfillMenusDe(menus as any);
      await translationBackfillService.backfillMenuStepsDe(menus as any);
    }

    return menus;
  },

  async getMenuById(id: number, options?: { includeImages?: boolean }) {
    const select: any = {
      id: true,
      name: true,
      nameDe: true,
      description: true,
      descriptionDe: true,
      isActive: true,
      startDate: true,
      endDate: true,
      price: true,
      minPeople: true,
      steps: true,
      createdAt: true,
      updatedAt: true,
      menuProducts: { select: { productId: true } },
      menuServices: { select: { serviceId: true } }
    };
    if (options?.includeImages) {
      select.image = true;
    }

    const menu = await prisma.menu.findUnique({
      where: { id },
      select
    });

    if (!menu) {
      throw new AppError('Menu not found', 404);
    }

    if (isDeeplAutoTranslateOnReadEnabled()) {
      await translationBackfillService.backfillMenusDe([menu] as any);
      await translationBackfillService.backfillMenuStepsDe([menu] as any);
    }

    return menu;
  },

  async createMenu(data: {
    name: string;
    nameDe?: string | null;
    description: string;
    descriptionDe?: string | null;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    price?: number;
    image?: string;
    minPeople?: number | null;
    steps?: any;
    productIds?: number[];
    serviceIds?: number[];
    services?: number[];
  }) {
    const image = await normalizeImageValue(data.image, { prefix: 'menu' });

    const providedNameDe = typeof data.nameDe === 'string' ? data.nameDe.trim() : '';
    const providedDescriptionDe = typeof data.descriptionDe === 'string' ? data.descriptionDe.trim() : '';

    const toTranslate: Array<{ key: 'nameDe' | 'descriptionDe'; text: string }> = [];
    if (!providedNameDe) toTranslate.push({ key: 'nameDe', text: data.name });
    if (!providedDescriptionDe) toTranslate.push({ key: 'descriptionDe', text: data.description });

    const translated = toTranslate.length
      ? await translationService.translateTexts(toTranslate.map(item => item.text), { targetLang: 'DE' })
      : null;
    const translatedMap = new Map<string, string>();
    if (translated) {
      toTranslate.forEach((item, index) => {
        translatedMap.set(item.key, translated[index] ?? '');
      });
    }

    const nameDe = providedNameDe || (translatedMap.get('nameDe') || null);
    const descriptionDe = providedDescriptionDe || (translatedMap.get('descriptionDe') || null);

    let steps = data.steps ?? undefined;
    if (Array.isArray(steps)) {
      const stepTargets: Array<{ index: number; text: string }> = [];
      steps.forEach((step: any, index: number) => {
        const label = typeof step?.label === 'string' ? step.label.trim() : '';
        if (!label) return;
        const labelDe = typeof step?.labelDe === 'string' ? step.labelDe.trim() : '';
        if (labelDe) return;
        stepTargets.push({ index, text: label });
      });

      if (stepTargets.length > 0) {
        const translatedSteps = await translationService.translateTexts(stepTargets.map(s => s.text), { targetLang: 'DE' });
        if (translatedSteps) {
          const nextSteps = steps.map((step: any) => (step && typeof step === 'object' ? { ...step } : step));
          stepTargets.forEach((target, idx) => {
            const step = nextSteps[target.index];
            if (step && typeof step === 'object') {
              nextSteps[target.index] = { ...step, labelDe: translatedSteps[idx] ?? null };
            }
          });
          steps = nextSteps;
        }
      }
    }

    const menu = await prisma.menu.create({
      data: {
        name: data.name,
        nameDe,
        description: data.description,
        descriptionDe,
        isActive: data.isActive ?? true,
        startDate: data.startDate,
        endDate: data.endDate,
        price: data.price,
        image,
        minPeople: data.minPeople ?? null,
        steps,
        menuProducts: data.productIds ? {
          create: data.productIds.map(productId => ({ productId }))
        } : undefined,
        menuServices: (data.serviceIds || data.services) ? {
          create: (data.serviceIds || data.services || []).map(serviceId => ({ serviceId }))
        } : undefined
      },
      include: {
        menuProducts: { select: { productId: true } },
        menuServices: { select: { serviceId: true } }
      }
    });

    return menu;
  },

  async updateMenu(id: number, data: Partial<{
    name: string;
    description: string;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    price: number;
    image: string;
    minPeople: number | null;
    steps: any;
    productIds: number[];
    products: number[];
    serviceIds: number[];
    services: number[];
  }>) {
    const updateData: any = { ...data };
    delete updateData.productIds;
    delete updateData.products;
    delete updateData.serviceIds;
    delete updateData.services;
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.menuProducts;
    delete updateData.menuServices;

    if (updateData.image !== undefined) {
      updateData.image = await normalizeImageValue(updateData.image, { prefix: 'menu' });
    }

    const toTranslate: Array<{ key: 'nameDe' | 'descriptionDe'; text: string }> = [];
    if (updateData.name !== undefined && updateData.nameDe === undefined) {
      const name = String(updateData.name || '').trim();
      if (name) {
        toTranslate.push({ key: 'nameDe', text: name });
      }
    }
    if (updateData.description !== undefined && updateData.descriptionDe === undefined) {
      const description = String(updateData.description || '').trim();
      if (description) {
        toTranslate.push({ key: 'descriptionDe', text: description });
      }
    }
    if (toTranslate.length > 0) {
      const translated = await translationService.translateTexts(
        toTranslate.map(item => item.text),
        { targetLang: 'DE' }
      );
      if (translated) {
        toTranslate.forEach((item, index) => {
          updateData[item.key] = translated[index] ?? null;
        });
      }
    }

    const menu = await prisma.menu.update({
      where: { id },
      data: updateData,
      include: {
        menuProducts: { select: { productId: true } },
        menuServices: { select: { serviceId: true } }
      }
    });

    // Update product associations if provided
    if (data.productIds !== undefined) {
      // Delete existing associations
      await prisma.menuProduct.deleteMany({
        where: { menuId: id }
      });

      // Create new associations
      if (data.productIds.length > 0) {
        await prisma.menuProduct.createMany({
          data: data.productIds.map(productId => ({ menuId: id, productId }))
        });
      }

      // Fetch updated menu
      return this.getMenuById(id, { includeImages: true });
    }

    const serviceIds = data.serviceIds ?? data.services;
    if (serviceIds !== undefined) {
      await prisma.menuService.deleteMany({
        where: { menuId: id }
      });

      if (serviceIds.length > 0) {
        await prisma.menuService.createMany({
          data: serviceIds.map(serviceId => ({ menuId: id, serviceId }))
        });
      }

      return this.getMenuById(id, { includeImages: true });
    }

    return menu;
  },

  async deleteMenu(id: number) {
    await prisma.menu.delete({
      where: { id }
    });
  },

  async restoreDefaultMenus() {
    const services = await prisma.service.findMany({
      select: { id: true, name: true }
    });
    const activeProducts = await prisma.product.findMany({
      where: { available: true },
      select: { id: true, category: true, productCategories: true }
    });

    const normalizeTags = (value: unknown) => {
      if (!Array.isArray(value)) return [];
      return value.map((v) => String(v).trim().toLowerCase()).filter(Boolean);
    };

    const pickServiceIdsForMenu = (serviceName?: string) => {
      if (serviceName) {
        const match = services.find((s) => s.name === serviceName);
        if (match) return [match.id];
      }
      return services.map((s) => s.id);
    };

    const pickProductIdsForMenu = (def: (typeof DEFAULT_MENUS)[number]) => {
      const productIdSet = new Set<number>();

      for (const p of activeProducts) {
        const tags = normalizeTags(p.productCategories);
        const category = String(p.category);

        const matches = (() => {
          if (def.productFilter.type === 'TAGS_ANY') {
            return def.productFilter.tags.some((t) => tags.includes(t));
          }
          if (def.productFilter.type === 'CATEGORIES_ANY') {
            return def.productFilter.categories.includes(category as any);
          }
          return def.productFilter.tags.some((t) => tags.includes(t)) || def.productFilter.categories.includes(category as any);
        })();

        if (matches) productIdSet.add(p.id);
      }

      const productIds = Array.from(productIdSet);
      return productIds.length ? productIds : activeProducts.map((p) => p.id);
    };

    let created = 0;
    let updated = 0;

    for (const def of DEFAULT_MENUS) {
      const productIds = pickProductIdsForMenu(def);
      const serviceIds = pickServiceIdsForMenu(def.serviceName);

      const existing = await prisma.menu.findFirst({ where: { name: def.name }, select: { id: true } });

      if (!existing) {
        await prisma.menu.create({
          data: {
            name: def.name,
            nameDe: null,
            description: def.description,
            descriptionDe: null,
            isActive: def.isActive,
            price: def.price,
            image: def.image,
            minPeople: def.minPeople,
            steps: def.steps as any
          }
        });
        created += 1;
      } else {
        await prisma.menu.update({
          where: { id: existing.id },
          data: {
            description: def.description,
            isActive: def.isActive,
            price: def.price,
            image: def.image,
            minPeople: def.minPeople,
            steps: def.steps as any
          }
        });
        updated += 1;
      }

      const menu = await prisma.menu.findFirst({ where: { name: def.name }, select: { id: true } });
      if (!menu) continue;

      await prisma.$transaction([
        prisma.menuProduct.deleteMany({ where: { menuId: menu.id } }),
        prisma.menuService.deleteMany({ where: { menuId: menu.id } }),
        productIds.length ? prisma.menuProduct.createMany({ data: productIds.map((productId) => ({ menuId: menu.id, productId })) }) : prisma.menuProduct.deleteMany({ where: { menuId: menu.id } }),
        serviceIds.length ? prisma.menuService.createMany({ data: serviceIds.map((serviceId) => ({ menuId: menu.id, serviceId })) }) : prisma.menuService.deleteMany({ where: { menuId: menu.id } })
      ]);
    }

    return {
      created,
      updated,
      totalDefaults: DEFAULT_MENUS.length,
      connectedServices: services.length,
      availableProducts: activeProducts.length
    };
  }
};
