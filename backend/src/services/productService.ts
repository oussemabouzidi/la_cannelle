import { ProductCategory, MenuTier } from '@prisma/client';
import { prisma } from '../prisma';
import { AppError } from '../middleware/errorHandler';
import { normalizeImageValue } from '../utils/uploads';
import { translationService } from './translationService';
import { translationBackfillService } from './translationBackfillService';

const isDeeplAutoTranslateOnReadEnabled = () => {
  const raw = process.env.DEEPL_AUTO_TRANSLATE_ON_READ;
  if (raw === undefined) return true;
  const normalized = String(raw).trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

const normalizeCategory = (category?: string | ProductCategory): ProductCategory | undefined => {
  if (!category) return undefined;
  const normalized = category.toString().toUpperCase();
  if (!(normalized in ProductCategory)) {
    throw new AppError('Invalid product category', 400);
  }
  return normalized as ProductCategory;
};

const normalizeTier = (tier?: string[] | MenuTier[]): MenuTier[] | undefined => {
  if (!tier) return undefined;
  return tier.map(t => t.toString().toUpperCase() as MenuTier);
};

const normalizeProductInput = <T extends {
  category?: string | ProductCategory;
  tier?: string[] | MenuTier[];
  menus?: number[];
  menuIds?: number[];
}>(data: T) => {
  return {
    ...data,
    ...(data.category && { category: normalizeCategory(data.category) }),
    ...(data.tier && { tier: normalizeTier(data.tier) }),
    ...(data.menuIds && { menuIds: data.menuIds }),
    ...(data.menus && { menuIds: data.menuIds ?? data.menus })
  };
};

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item ?? '').trim())
    .filter((item) => item.length > 0);
};

export const productService = {
  async getProducts(filters?: {
    category?: ProductCategory;
    available?: boolean;
    tier?: MenuTier;
    search?: string;
    menuId?: number;
  }) {
    const where: any = {};

    if (filters?.category) {
      where.category = normalizeCategory(filters.category);
    }

    if (filters?.available !== undefined) {
      where.available = filters.available;
    }

    if (filters?.tier) {
      where.tier = { has: filters.tier.toString().toUpperCase() as MenuTier };
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { nameDe: { contains: filters.search } },
        { description: { contains: filters.search } },
        { descriptionDe: { contains: filters.search } }
      ];
    }

    if (filters?.menuId) {
      where.menuProducts = {
        some: {
          menuId: filters.menuId
        }
      };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        popularity: 'desc'
      }
    });

    if (isDeeplAutoTranslateOnReadEnabled()) {
      await translationBackfillService.backfillProductsDe(products);
    }

    return products;
  },

  async getProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        menuProducts: true
      }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (isDeeplAutoTranslateOnReadEnabled()) {
      await translationBackfillService.backfillProductsDe([product]);
    }

    return product;
  },

  async createProduct(data: {
    name: string;
    nameDe?: string | null;
    description: string;
    descriptionDe?: string | null;
    category: ProductCategory;
    price: number;
    cost: number;
    available?: boolean;
    minOrderQuantity?: number;
    tier: MenuTier[];
    ingredients: string[];
    ingredientsDe?: unknown;
    allergens: string[];
    allergensDe?: unknown;
    productCategories: string[];
    productCategoriesDe?: unknown;
    image?: string;
    menuIds?: number[];
  }) {
    const normalizedData = normalizeProductInput(data);
    const image = await normalizeImageValue(normalizedData.image, { prefix: 'product' });

    const ingredients = normalizeStringArray(normalizedData.ingredients);
    const allergens = normalizeStringArray(normalizedData.allergens);
    const productCategories = normalizeStringArray(normalizedData.productCategories);

    const providedNameDe = typeof data.nameDe === 'string' ? data.nameDe.trim() : '';
    const providedDescriptionDe = typeof data.descriptionDe === 'string' ? data.descriptionDe.trim() : '';

    const hasIngredientsDe = (data as any).ingredientsDe !== undefined;
    const providedIngredientsDe = hasIngredientsDe ? normalizeStringArray((data as any).ingredientsDe) : null;
    const hasAllergensDe = (data as any).allergensDe !== undefined;
    const providedAllergensDe = hasAllergensDe ? normalizeStringArray((data as any).allergensDe) : null;
    const hasProductCategoriesDe = (data as any).productCategoriesDe !== undefined;
    const providedProductCategoriesDe = hasProductCategoriesDe
      ? normalizeStringArray((data as any).productCategoriesDe)
      : null;

    const translationTargets: Array<
      | { kind: 'scalar'; key: 'nameDe' | 'descriptionDe'; text: string }
      | { kind: 'array'; key: 'ingredientsDe' | 'allergensDe' | 'productCategoriesDe'; texts: string[] }
    > = [];

    if (!providedNameDe) translationTargets.push({ kind: 'scalar', key: 'nameDe', text: normalizedData.name });
    if (!providedDescriptionDe) translationTargets.push({ kind: 'scalar', key: 'descriptionDe', text: normalizedData.description });
    if (!hasIngredientsDe) translationTargets.push({ kind: 'array', key: 'ingredientsDe', texts: ingredients });
    if (!hasAllergensDe) translationTargets.push({ kind: 'array', key: 'allergensDe', texts: allergens });
    if (!hasProductCategoriesDe) translationTargets.push({ kind: 'array', key: 'productCategoriesDe', texts: productCategories });

    const texts: string[] = [];
    translationTargets.forEach((target) => {
      if (target.kind === 'scalar') {
        texts.push(target.text);
        return;
      }
      texts.push(...target.texts);
    });

    const translated = texts.length ? await translationService.translateTexts(texts, { targetLang: 'DE' }) : null;
    const translatedMap: Record<string, any> = {};

    if (translated) {
      let cursor = 0;
      translationTargets.forEach((target) => {
        if (target.kind === 'scalar') {
          translatedMap[target.key] = translated[cursor] ?? null;
          cursor += 1;
          return;
        }
        translatedMap[target.key] = translated.slice(cursor, cursor + target.texts.length);
        cursor += target.texts.length;
      });
    }

    const nameDe = providedNameDe ? providedNameDe : (translatedMap.nameDe ?? null);
    const descriptionDe = providedDescriptionDe ? providedDescriptionDe : (translatedMap.descriptionDe ?? null);
    const translatedIngredients = hasIngredientsDe ? providedIngredientsDe : (translatedMap.ingredientsDe ?? null);
    const translatedAllergens = hasAllergensDe ? providedAllergensDe : (translatedMap.allergensDe ?? null);
    const translatedProductCategories = hasProductCategoriesDe ? providedProductCategoriesDe : (translatedMap.productCategoriesDe ?? null);

    const product = await prisma.product.create({
      data: {
        name: normalizedData.name,
        nameDe,
        description: normalizedData.description,
        descriptionDe,
        category: normalizedData.category as ProductCategory,
        price: normalizedData.price,
        cost: normalizedData.cost,
        available: normalizedData.available ?? true,
        minOrderQuantity: normalizedData.minOrderQuantity ?? 1,
        tier: normalizedData.tier as MenuTier[],
        ingredients,
        ingredientsDe: translatedIngredients,
        allergens,
        allergensDe: translatedAllergens,
        productCategories,
        productCategoriesDe: translatedProductCategories,
        image,
        menuProducts: normalizedData.menuIds ? {
          create: normalizedData.menuIds.map(menuId => ({ menuId }))
        } : undefined
      },
      include: {
        menuProducts: true
      }
    });

    return product;
  },

  async updateProduct(id: number, data: Partial<{
    name: string;
    description: string;
    category: ProductCategory;
    price: number;
    cost: number;
    available: boolean;
    minOrderQuantity: number;
    tier: MenuTier[];
    ingredients: unknown;
    allergens: unknown;
    productCategories: unknown;
    image: string;
    menuIds: number[];
    menus: number[];
  }>) {
    const normalized = normalizeProductInput(data);
    const updateData: any = { ...normalized };
    const menuIds = normalized.menuIds;
    delete updateData.menuIds;
    delete updateData.menus;
    delete updateData.id;
    delete updateData.popularity;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.menuProducts;
    delete updateData.orderItems;
    delete updateData.favorites;

    if (updateData.image !== undefined) {
      updateData.image = await normalizeImageValue(updateData.image, { prefix: 'product' });
    }

    const translationTargets: Array<
      | { kind: 'scalar'; key: 'nameDe' | 'descriptionDe'; text: string }
      | { kind: 'array'; key: 'ingredientsDe' | 'allergensDe' | 'productCategoriesDe'; texts: string[] }
    > = [];

    if (updateData.name !== undefined && updateData.nameDe === undefined) {
      const name = String(updateData.name || '').trim();
      if (name) translationTargets.push({ kind: 'scalar', key: 'nameDe', text: name });
    }

    if (updateData.description !== undefined && updateData.descriptionDe === undefined) {
      const description = String(updateData.description || '').trim();
      if (description) translationTargets.push({ kind: 'scalar', key: 'descriptionDe', text: description });
    }

    if (updateData.ingredients !== undefined && updateData.ingredientsDe === undefined) {
      const ingredients = normalizeStringArray(updateData.ingredients);
      updateData.ingredients = ingredients;
      if (ingredients.length === 0) {
        updateData.ingredientsDe = [];
      } else {
        translationTargets.push({ kind: 'array', key: 'ingredientsDe', texts: ingredients });
      }
    }

    if (updateData.allergens !== undefined && updateData.allergensDe === undefined) {
      const allergens = normalizeStringArray(updateData.allergens);
      updateData.allergens = allergens;
      if (allergens.length === 0) {
        updateData.allergensDe = [];
      } else {
        translationTargets.push({ kind: 'array', key: 'allergensDe', texts: allergens });
      }
    }

    if (updateData.productCategories !== undefined && updateData.productCategoriesDe === undefined) {
      const productCategories = normalizeStringArray(updateData.productCategories);
      updateData.productCategories = productCategories;
      if (productCategories.length === 0) {
        updateData.productCategoriesDe = [];
      } else {
        translationTargets.push({ kind: 'array', key: 'productCategoriesDe', texts: productCategories });
      }
    }

    if (translationTargets.length > 0) {
      const texts: string[] = [];
      translationTargets.forEach((target) => {
        if (target.kind === 'scalar') {
          texts.push(target.text);
          return;
        }
        texts.push(...target.texts);
      });

      const translated = await translationService.translateTexts(texts, { targetLang: 'DE' });
      if (translated) {
        let cursor = 0;
        translationTargets.forEach((target) => {
          if (target.kind === 'scalar') {
            updateData[target.key] = translated[cursor] ?? null;
            cursor += 1;
            return;
          }
          const slice = translated.slice(cursor, cursor + target.texts.length);
          updateData[target.key] = slice;
          cursor += target.texts.length;
        });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        menuProducts: true
      }
    });

    // Update menu associations if provided
    if (menuIds !== undefined) {
      // Delete existing associations
      await prisma.menuProduct.deleteMany({
        where: { productId: id }
      });

      // Create new associations
      if (menuIds.length > 0) {
        await prisma.menuProduct.createMany({
          data: menuIds.map(menuId => ({ menuId, productId: id }))
        });
      }

      // Fetch updated product
      return this.getProductById(id);
    }

    return product;
  },

  async deleteProduct(id: number) {
    const existing = await prisma.product.findUnique({
      where: { id }
    });
    if (!existing) {
      throw new AppError('Product not found', 404);
    }

    const orderItemCount = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItemCount > 0) {
      await prisma.menuProduct.deleteMany({
        where: { productId: id }
      });
      await prisma.favorite.deleteMany({
        where: { productId: id }
      });
      await prisma.product.update({
        where: { id },
        data: { available: false }
      });
      return { archived: true };
    }

    await prisma.product.delete({
      where: { id }
    });
    return { deleted: true };
  }
};
