import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const systemService = {
  async getSystemStatus() {
    let status = await prisma.systemStatus.findFirst({
      orderBy: { id: 'desc' }
    });

    if (!status) {
      status = await prisma.systemStatus.create({
        data: {}
      });
    }

    return status;
  },

  async updateSystemStatus(data: {
    orderingPaused?: boolean;
    pauseReason?: string;
    pauseUntil?: Date | null;
    capacityLimit?: number;
    currentReservations?: number;
    dailyLimit?: number;
    perHourLimit?: number;
    weekendMultiplier?: number;
    enableAutoPause?: boolean;
  }) {
    let status = await prisma.systemStatus.findFirst({
      orderBy: { id: 'desc' }
    });

    if (!status) {
      status = await prisma.systemStatus.create({
        data: {}
      });
    }

    const updated = await prisma.systemStatus.update({
      where: { id: status.id },
      data: {
        ...(data.orderingPaused !== undefined && { orderingPaused: data.orderingPaused }),
        ...(data.pauseReason !== undefined && { pauseReason: data.pauseReason }),
        ...(data.pauseUntil !== undefined && { pauseUntil: data.pauseUntil }),
        ...(data.capacityLimit !== undefined && { capacityLimit: data.capacityLimit }),
        ...(data.currentReservations !== undefined && { currentReservations: data.currentReservations }),
        ...(data.dailyLimit !== undefined && { dailyLimit: data.dailyLimit }),
        ...(data.perHourLimit !== undefined && { perHourLimit: data.perHourLimit }),
        ...(data.weekendMultiplier !== undefined && { weekendMultiplier: data.weekendMultiplier }),
        ...(data.enableAutoPause !== undefined && { enableAutoPause: data.enableAutoPause })
      }
    });

    return updated;
  },

  async getClosedDates() {
    const dates = await prisma.closedDate.findMany({
      orderBy: {
        date: 'asc'
      }
    });

    return dates;
  },

  async createClosedDate(data: {
    date: Date;
    reason: string;
    recurring: boolean;
  }) {
    const closedDate = await prisma.closedDate.create({
      data
    });

    return closedDate;
  },

  async deleteClosedDate(id: number) {
    await prisma.closedDate.delete({
      where: { id }
    });
  }
};
