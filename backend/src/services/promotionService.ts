import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
// Temporary any-cast until Prisma client is regenerated
const promotionRepo = (prisma as any).promotion;

type PromotionPayload = {
  title: string;
  message: string;
  discount?: string;
  validUntil?: Date | null;
  recipients: 'all' | 'active' | 'vip' | 'selected';
  selectedCustomerIds?: number[];
};

export const promotionService = {
  async sendPromotion(data: PromotionPayload) {
    if (!data.title || !data.message) {
      throw new AppError('Title and message are required', 400);
    }

    // Determine targets
    let targetUserIds: number[] = [];
    if (data.recipients === 'selected' && data.selectedCustomerIds?.length) {
      targetUserIds = data.selectedCustomerIds;
    } else {
      const where: any = { role: 'CLIENT' };
      if (data.recipients === 'active') {
        where.status = 'active';
      }
      if (data.recipients === 'vip') {
        where.tier = 'VIP';
      }
      const users = await prisma.user.findMany({ where, select: { id: true } });
      targetUserIds = users.map(u => u.id);
    }

    const validUntil = data.validUntil ? new Date(data.validUntil) : null;

    if (targetUserIds.length === 0) {
      // still record generic promotion without user
      if (!promotionRepo) {
        return { sent: 0 };
      }

      await promotionRepo.create({
        data: {
          title: data.title,
          message: data.message,
          discount: data.discount,
          validUntil,
          recipients: data.recipients
        }
      });
      return { sent: 0 };
    }

    const createData = targetUserIds.map(userId => ({
      title: data.title,
      message: data.message,
      discount: data.discount,
      validUntil,
      recipients: data.recipients,
      userId
    }));

    if (promotionRepo) {
      await promotionRepo.createMany({
        data: createData
      });
    }

    return { sent: targetUserIds.length };
  },

  async getPromotionsForUser(userId: number) {
    if (!promotionRepo) return [];
    return promotionRepo.findMany({
      where: { OR: [{ userId }, { recipients: 'all' }] },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getAllPromotions() {
    if (!promotionRepo) return [];
    return promotionRepo.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
};
