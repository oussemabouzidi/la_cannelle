import { prisma } from '../prisma';
import { AppError } from '../middleware/errorHandler';
import { normalizeImageValue } from '../utils/uploads';

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
        { description: { contains: filters.search } }
      ];
    }

    if (filters?.serviceId) {
      where.menuServices = { some: { serviceId: filters.serviceId } };
    }

    const includeImages = Boolean(filters?.includeImages);

    const select: any = {
      id: true,
      name: true,
      description: true,
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

    return menus;
  },

  async getMenuById(id: number, options?: { includeImages?: boolean }) {
    const select: any = {
      id: true,
      name: true,
      description: true,
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

    return menu;
  },

  async createMenu(data: {
    name: string;
    description: string;
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

    const menu = await prisma.menu.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
        startDate: data.startDate,
        endDate: data.endDate,
        price: data.price,
        image,
        minPeople: data.minPeople ?? null,
        steps: data.steps ?? undefined,
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
  }
};
