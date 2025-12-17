import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const reportsService = {
  async getRevenueReport(dateFrom?: Date, dateTo?: Date) {
    const where: any = {
      paymentStatus: 'PAID'
    };

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily revenue breakdown
    const dailyRevenueMap = new Map<string, { revenue: number; orders: number }>();
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      const existing = dailyRevenueMap.get(date) || { revenue: 0, orders: 0 };
      dailyRevenueMap.set(date, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1
      });
    });

    const dailyRevenue = Array.from(dailyRevenueMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Revenue by category
    const categoryMap = new Map<string, number>();
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product.category;
        const existing = categoryMap.get(category) || 0;
        categoryMap.set(category, existing + (item.price * item.quantity));
      });
    });

    const byCategory = Array.from(categoryMap.entries())
      .map(([category, revenue]) => ({
        category,
        revenue,
        percentage: (revenue / totalRevenue) * 100
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Revenue by tier
    const tierMap = new Map<string, { revenue: number; orders: number }>();
    orders.forEach(order => {
      if (order.menuTier) {
        const existing = tierMap.get(order.menuTier) || { revenue: 0, orders: 0 };
        tierMap.set(order.menuTier, {
          revenue: existing.revenue + order.total,
          orders: existing.orders + 1
        });
      }
    });

    const byTier = Array.from(tierMap.entries())
      .map(([tier, data]) => ({
        tier,
        ...data
      }));

    return {
      totalRevenue,
      averageOrderValue,
      totalOrders,
      dailyRevenue,
      byCategory,
      byTier
    };
  },

  async getPopularItems(dateFrom?: Date, dateTo?: Date) {
    const where: any = {};
    if (dateFrom || dateTo) {
      where.order = {
        createdAt: {},
        paymentStatus: 'PAID'
      };
      if (dateFrom) where.order.createdAt.gte = dateFrom;
      if (dateTo) where.order.createdAt.lte = dateTo;
    } else {
      where.order = {
        paymentStatus: 'PAID'
      };
    }

    const orderItems = await prisma.orderItem.findMany({
      where,
      include: {
        product: true,
        order: true
      }
    });

    const itemMap = new Map<number, {
      id: number;
      name: string;
      category: string;
      orders: number;
      revenue: number;
      popularity: number;
    }>();

    orderItems.forEach(item => {
      const existing = itemMap.get(item.productId) || {
        id: item.productId,
        name: item.product.name,
        category: item.product.category,
        orders: 0,
        revenue: 0,
        popularity: item.product.popularity
      };
      existing.orders += item.quantity;
      existing.revenue += item.price * item.quantity;
      itemMap.set(item.productId, existing);
    });

    const popularItems = Array.from(itemMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20);

    return popularItems;
  },

  async getCustomerAnalytics() {
    const totalCustomers = await prisma.user.count({
      where: { role: 'CLIENT' }
    });

    const customersWithOrders = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        orders: {
          some: {}
        }
      },
      include: {
        orders: {
          where: {
            paymentStatus: 'PAID'
          }
        }
      }
    });

    const returningCustomers = customersWithOrders.filter(c => c.orders.length > 1).length;
    const newCustomers = totalCustomers - customersWithOrders.length;

    const retentionRate = customersWithOrders.length > 0
      ? (returningCustomers / customersWithOrders.length) * 100
      : 0;

    const totalRevenue = await prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true }
    });

    const avgCustomerValue = customersWithOrders.length > 0
      ? (totalRevenue._sum.total || 0) / customersWithOrders.length
      : 0;

    return {
      newCustomers,
      returningCustomers,
      retentionRate: Math.round(retentionRate * 10) / 10,
      avgCustomerValue: Math.round(avgCustomerValue * 100) / 100
    };
  }
};
