import { PrismaClient, ProductCategory, MenuTier } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

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
      where.category = filters.category;
    }

    if (filters?.available !== undefined) {
      where.available = filters.available;
    }

    if (filters?.tier) {
      where.tier = { has: filters.tier };
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
    tier: MenuTier[];
    preparationTime: number;
    ingredients: string[];
    allergens: string[];
    productCategories: string[];
    image?: string;
    menuIds?: number[];
  }) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        menuCategory: data.menuCategory,
        price: data.price,
        cost: data.cost,
        available: data.available ?? true,
        tier: data.tier,
        preparationTime: data.preparationTime,
        ingredients: data.ingredients,
        allergens: data.allergens,
        productCategories: data.productCategories,
        image: data.image,
        menuProducts: data.menuIds ? {
          create: data.menuIds.map(menuId => ({ menuId }))
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
    tier: MenuTier[];
    preparationTime: number;
    ingredients: string[];
    allergens: string[];
    productCategories: string[];
    image: string;
    menuIds: number[];
  }>) {
    const updateData: any = { ...data };
    delete updateData.menuIds;

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
    if (data.menuIds !== undefined) {
      // Delete existing associations
      await prisma.menuProduct.deleteMany({
        where: { productId: id }
      });

      // Create new associations
      if (data.menuIds.length > 0) {
        await prisma.menuProduct.createMany({
          data: data.menuIds.map(menuId => ({ menuId, productId: id }))
        });
      }

      // Fetch updated product
      return this.getProductById(id);
    }

    return product;
  },

  async deleteProduct(id: number) {
    await prisma.product.delete({
      where: { id }
    });
  }
};
