import { prisma } from '../prisma';
import { AppError } from '../middleware/errorHandler';

const toOptionalString = (value: unknown) => {
  if (value === null || value === undefined) return undefined;
  const trimmed = String(value).trim();
  return trimmed ? trimmed : undefined;
};

const toOptionalText = (value: unknown) => {
  const text = toOptionalString(value);
  return text;
};

const toNumber = (value: unknown, field: string) => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) {
    throw new AppError(`Invalid ${field}`, 400);
  }
  return num;
};

const toInt = (value: unknown, field: string) => {
  const num = toNumber(value, field);
  const int = Math.trunc(num);
  if (!Number.isFinite(int)) {
    throw new AppError(`Invalid ${field}`, 400);
  }
  return int;
};

export type AccessoryCreateInput = {
  nameEn: string;
  nameDe?: string | null;
  descriptionEn: string;
  descriptionDe?: string | null;
  detailsEn?: string | null;
  detailsDe?: string | null;
  unitEn?: string | null;
  unitDe?: string | null;
  price: number;
  minQuantity?: number;
  image?: string | null;
  isActive?: boolean;
};

export type AccessoryUpdateInput = Partial<AccessoryCreateInput>;

export const accessoryService = {
  async getAccessories(filters?: { isActive?: boolean; search?: string }) {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where.OR = [
        { nameEn: { contains: filters.search } },
        { nameDe: { contains: filters.search } },
        { descriptionEn: { contains: filters.search } },
        { descriptionDe: { contains: filters.search } }
      ];
    }

    return prisma.accessory.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });
  },

  async getAccessoryById(id: number) {
    const accessory = await prisma.accessory.findUnique({ where: { id } });
    if (!accessory) {
      throw new AppError('Accessory not found', 404);
    }
    return accessory;
  },

  async createAccessory(data: AccessoryCreateInput) {
    const nameEn = toOptionalString(data.nameEn);
    const descriptionEn = toOptionalText(data.descriptionEn);
    if (!nameEn) throw new AppError('nameEn is required', 400);
    if (!descriptionEn) throw new AppError('descriptionEn is required', 400);

    const price = toNumber(data.price, 'price');
    const minQuantity = Math.max(1, data.minQuantity ? toInt(data.minQuantity, 'minQuantity') : 1);

    return prisma.accessory.create({
      data: {
        nameEn,
        nameDe: toOptionalString(data.nameDe),
        descriptionEn,
        descriptionDe: toOptionalText(data.descriptionDe),
        detailsEn: toOptionalText(data.detailsEn),
        detailsDe: toOptionalText(data.detailsDe),
        unitEn: toOptionalString(data.unitEn),
        unitDe: toOptionalString(data.unitDe),
        price,
        minQuantity,
        image: toOptionalString(data.image),
        isActive: data.isActive ?? true
      }
    });
  },

  async updateAccessory(id: number, data: AccessoryUpdateInput) {
    const existing = await prisma.accessory.findUnique({ where: { id } });
    if (!existing) throw new AppError('Accessory not found', 404);

    const update: any = {};
    if (data.nameEn !== undefined) update.nameEn = toOptionalString(data.nameEn) || '';
    if (data.nameDe !== undefined) update.nameDe = toOptionalString(data.nameDe) ?? null;
    if (data.descriptionEn !== undefined) update.descriptionEn = toOptionalText(data.descriptionEn) || '';
    if (data.descriptionDe !== undefined) update.descriptionDe = toOptionalText(data.descriptionDe) ?? null;
    if (data.detailsEn !== undefined) update.detailsEn = toOptionalText(data.detailsEn) ?? null;
    if (data.detailsDe !== undefined) update.detailsDe = toOptionalText(data.detailsDe) ?? null;
    if (data.unitEn !== undefined) update.unitEn = toOptionalString(data.unitEn) ?? null;
    if (data.unitDe !== undefined) update.unitDe = toOptionalString(data.unitDe) ?? null;
    if (data.image !== undefined) update.image = toOptionalString(data.image) ?? null;
    if (data.isActive !== undefined) update.isActive = Boolean(data.isActive);
    if (data.price !== undefined) update.price = toNumber(data.price, 'price');
    if (data.minQuantity !== undefined) update.minQuantity = Math.max(1, toInt(data.minQuantity, 'minQuantity'));

    if (Object.keys(update).length === 0) {
      return existing;
    }

    if (update.nameEn !== undefined && !update.nameEn) {
      throw new AppError('nameEn cannot be empty', 400);
    }
    if (update.descriptionEn !== undefined && !update.descriptionEn) {
      throw new AppError('descriptionEn cannot be empty', 400);
    }

    return prisma.accessory.update({
      where: { id },
      data: update
    });
  },

  async deleteAccessory(id: number) {
    const existing = await prisma.accessory.findUnique({ where: { id } });
    if (!existing) throw new AppError('Accessory not found', 404);
    await prisma.accessory.delete({ where: { id } });
    return { deleted: true };
  }
};
