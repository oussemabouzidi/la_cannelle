import { PrismaClient, ProductCategory, MenuTier } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

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
        { description: { contains: filters.search } }
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

    return products;
  },

  async getProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        menuProducts: {
          include: {
            menu: true
          }
        }
      }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  },

  async createProduct(data: {
    name: string;
    description: string;
    category: ProductCategory;
    menuCategory: string;
    price: number;
    cost: number;
    available?: boolean;
    minOrderQuantity?: number;
    tier: MenuTier[];
    preparationTime: number;
    ingredients: string[];
    allergens: string[];
    productCategories: string[];
    image?: string;
    menuIds?: number[];
  }) {
    const normalizedData = normalizeProductInput(data);

    const product = await prisma.product.create({
      data: {
        name: normalizedData.name,
        description: normalizedData.description,
        category: normalizedData.category as ProductCategory,
        menuCategory: normalizedData.menuCategory,
        price: normalizedData.price,
        cost: normalizedData.cost,
        available: normalizedData.available ?? true,
        minOrderQuantity: normalizedData.minOrderQuantity ?? 1,
        tier: normalizedData.tier as MenuTier[],
        preparationTime: normalizedData.preparationTime,
        ingredients: normalizedData.ingredients,
        allergens: normalizedData.allergens,
        productCategories: normalizedData.productCategories,
        image: normalizedData.image,
        menuProducts: normalizedData.menuIds ? {
          create: normalizedData.menuIds.map(menuId => ({ menuId }))
        } : undefined
      },
      include: {
        menuProducts: {
          include: {
            menu: true
          }
        }
      }
    });

    return product;
  },

  async updateProduct(id: number, data: Partial<{
    name: string;
    description: string;
    category: ProductCategory;
    menuCategory: string;
    price: number;
    cost: number;
    available: boolean;
    minOrderQuantity: number;
    tier: MenuTier[];
    preparationTime: number;
    ingredients: string[];
    allergens: string[];
    productCategories: string[];
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

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        menuProducts: {
          include: {
            menu: true
          }
        }
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
