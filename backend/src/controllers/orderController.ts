import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { orderService } from '../services/orderService';
import { AppError } from '../middleware/errorHandler';

export const orderController = {
  async createOrder(req: AuthRequest, res: Response) {
    const {
      clientName,
      contactEmail,
      phone,
      eventType,
      eventDate,
      eventTime,
      guests,
      location,
      menuTier,
      specialRequests,
      businessType,
      serviceType,
      postalCode,
      items,
      subtotal,
      serviceFee,
      total
    } = req.body;

    if (!clientName || !contactEmail || !phone || !eventType || !eventDate || !eventTime || !guests || !location || !items || !total) {
      throw new AppError('Missing required fields', 400);
    }

    if (total < 388.80) {
      throw new AppError('Minimum order of €388.80 required', 400);
    }

    const order = await orderService.createOrder({
      userId: req.user?.id,
      clientName,
      contactEmail,
      phone,
      eventType,
      eventDate: new Date(eventDate),
      eventTime,
      guests: parseInt(guests),
      location,
      menuTier,
      specialRequests,
      businessType,
      serviceType,
      postalCode,
      items,
      subtotal: parseFloat(subtotal) || 0,
      serviceFee: parseFloat(serviceFee) || 0,
      total: parseFloat(total)
    });

    res.status(201).json(order);
  },

  async getOrders(req: AuthRequest, res: Response) {
    const { status, dateFrom, dateTo, search, customerId, userId } = req.query;

    const filters: any = {};

    // Allow explicit customer/user filter (admin dashboards)
    const requestedUserId = customerId || userId;
    if (requestedUserId) {
      const parsedId = parseInt(requestedUserId as string, 10);
      if (!Number.isNaN(parsedId)) {
        filters.userId = parsedId;
      }
    } else if (req.user && req.user.role === 'CLIENT') {
      // If authenticated client, limit to their orders
      filters.userId = req.user.id;
    }

    if (status) {
      filters.status = status;
    }

    if (dateFrom) {
      filters.dateFrom = new Date(dateFrom as string);
    }

    if (dateTo) {
      filters.dateTo = new Date(dateTo as string);
    }

    if (search) {
      filters.search = search as string;
    }

    const orders = await orderService.getOrders(filters);
    res.json(orders);
  },

  async getOrderById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user?.role === 'CLIENT' ? req.user.id : undefined;

    const order = await orderService.getOrderById(id, userId);
    res.json(order);
  },

  async updateOrderStatus(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    if (!status) {
      throw new AppError('Status is required', 400);
    }

    const order = await orderService.updateOrderStatus(id, status, cancellationReason);
    res.json(order);
  },

  async updatePaymentStatus(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      throw new AppError('Payment status is required', 400);
    }

    const order = await orderService.updatePaymentStatus(id, paymentStatus);
    res.json(order);
  }
};
