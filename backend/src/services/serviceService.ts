import { ServiceOccasion } from '@prisma/client';
import { prisma } from '../prisma';
import { AppError } from '../middleware/errorHandler';
import { normalizeImageValue } from '../utils/uploads';

function normalizeOccasion(value: unknown): ServiceOccasion | undefined {
  if (!value) return undefined;
  const raw = String(value).toUpperCase();
  if (raw === 'BUSINESS') return 'BUSINESS';
  if (raw === 'PRIVATE') return 'PRIVATE';
  if (raw === 'BOTH') return 'BOTH';
  return undefined;
}

export const serviceService = {
  normalizeOccasion,

  async getServices(filters?: { occasion?: string; isActive?: boolean; search?: string }) {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const occasion = normalizeOccasion(filters?.occasion);
    if (occasion) {
      where.OR = [{ occasion }, { occasion: 'BOTH' }];
    }

    if (filters?.search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { name: { contains: filters.search } },
            { description: { contains: filters.search } }
          ]
        }
      ];
    }

    return await prisma.service.findMany({
      where,
      orderBy: { name: 'asc' }
    });
  },

  async getServiceById(id: number) {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new AppError('Service not found', 404);
    return service;
  },

  async createService(data: {
    name: string;
    occasion: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  }) {
    const name = String(data.name || '').trim();
    if (!name) throw new AppError('Name is required', 400);
    const occasion = normalizeOccasion(data.occasion);
    if (!occasion) throw new AppError('Occasion is required', 400);

    const image = await normalizeImageValue(data.image, { prefix: 'service' });

    return await prisma.service.create({
      data: {
        name,
        occasion,
        description: data.description || null,
        image: image || null,
        isActive: data.isActive ?? true
      }
    });
  },

  async updateService(id: number, data: Partial<{
    name: string;
    occasion: string;
    description: string | null;
    image: string | null;
    isActive: boolean;
  }>) {
    const updateData: any = { ...data };
    if (updateData.name !== undefined) updateData.name = String(updateData.name).trim();
    if (updateData.occasion !== undefined) {
      const occasion = normalizeOccasion(updateData.occasion);
      if (!occasion) throw new AppError('Invalid occasion', 400);
      updateData.occasion = occasion;
    }
    if (updateData.image !== undefined) {
      updateData.image = await normalizeImageValue(updateData.image, { prefix: 'service' });
    }

    return await prisma.service.update({
      where: { id },
      data: updateData
    });
  },

  async deleteService(id: number) {
    await prisma.service.delete({ where: { id } });
  }
};
