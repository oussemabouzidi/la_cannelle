import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const orderService = {
  async createOrder(data: {
    userId?: number;
    clientName: string;
    contactEmail: string;
    phone: string;
    eventType: string;
    eventDate: Date;
    eventTime: string;
    guests: number;
    location: string;
    menuTier?: string;
    specialRequests?: string;
    businessType?: string;
    serviceType?: string;
    postalCode?: string;
    items: Array<{ productId: number; quantity: number; price: number; name: string }>;
    subtotal: number;
    serviceFee: number;
    total: number;
  }) {
    if (data.items.some(item => item.quantity < 0)) {
      throw new AppError('Item quantity cannot be negative', 400);
    }

    const productIds = data.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, minOrderQuantity: true }
    });
    const minMap = new Map(products.map(product => [product.id, product.minOrderQuantity]));
    for (const item of data.items) {
      const minQuantityRaw = minMap.get(item.productId);
      if (minQuantityRaw === undefined) {
        throw new AppError(`Product not found: ${item.productId}`, 404);
      }
      const minQuantity = Math.max(1, minQuantityRaw ?? 1);
      if (item.quantity > 0 && item.quantity < minQuantity) {
        throw new AppError(`Minimum quantity for product ${item.productId} is ${minQuantity}`, 400);
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        clientName: data.clientName,
        contactEmail: data.contactEmail,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        guests: data.guests,
        location: data.location,
        menuTier: data.menuTier as any,
        specialRequests: data.specialRequests,
        businessType: data.businessType,
        serviceType: data.serviceType,
        postalCode: data.postalCode,
        subtotal: data.subtotal,
        serviceFee: data.serviceFee,
        total: data.total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name
          }))
        }
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return order;
  },

  async getOrders(filters?: {
    userId?: number;
    status?: OrderStatus;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.eventDate = {};
      if (filters.dateFrom) where.eventDate.gte = filters.dateFrom;
      if (filters.dateTo) where.eventDate.lte = filters.dateTo;
    }

    if (filters?.search) {
      where.OR = [
        { clientName: { contains: filters.search } },
        { contactEmail: { contains: filters.search } },
        { id: { contains: filters.search } }
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return orders;
  },

  async getOrderById(id: string, userId?: number) {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      }
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  },

  async updateOrderStatus(id: string, status: OrderStatus, cancellationReason?: string) {
    const safeStatus = status?.toString().toUpperCase() as OrderStatus;
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: safeStatus,
        ...(cancellationReason && { cancellationReason }),
        ...(safeStatus === 'CANCELLED' && { paymentStatus: 'REFUNDED' as PaymentStatus })
      },
      include: {
        items: true
      }
    });

    return order;
  },

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: {
        items: true
      }
    });

    return order;
  }
};
