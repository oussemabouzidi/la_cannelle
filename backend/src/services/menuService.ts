import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const menuService = {
  async getMenus(filters?: {
    isActive?: boolean;
    category?: string;
    type?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } }
      ];
    }

    const menus = await prisma.menu.findMany({
      where,
      include: {
        menuProducts: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return menus;
  },

  async getMenuById(id: number) {
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        menuProducts: {
          include: {
            product: true
          }
        }
      }
    });

    if (!menu) {
      throw new AppError('Menu not found', 404);
    }

    return menu;
  },

  async createMenu(data: {
    name: string;
    description: string;
    category: string;
    type: string;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    price?: number;
    image?: string;
    productIds?: number[];
  }) {
    const menu = await prisma.menu.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        type: data.type,
        isActive: data.isActive ?? true,
        startDate: data.startDate,
        endDate: data.endDate,
        price: data.price,
        image: data.image,
        menuProducts: data.productIds ? {
          create: data.productIds.map(productId => ({ productId }))
        } : undefined
      },
      include: {
        menuProducts: {
          include: {
            product: true
          }
        }
      }
    });

    return menu;
  },

  async updateMenu(id: number, data: Partial<{
    name: string;
    description: string;
    category: string;
    type: string;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    price: number;
    image: string;
    productIds: number[];
  }>) {
    const updateData: any = { ...data };
    delete updateData.productIds;

    const menu = await prisma.menu.update({
      where: { id },
      data: updateData,
      include: {
        menuProducts: {
          include: {
            product: true
          }
        }
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
      return this.getMenuById(id);
    }

    return menu;
  },

  async deleteMenu(id: number) {
    await prisma.menu.delete({
      where: { id }
    });
  }
};
