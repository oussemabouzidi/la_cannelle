import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { promotionService } from '../services/promotionService';
import { AppError } from '../middleware/errorHandler';

export const promotionController = {
  async send(req: AuthRequest, res: Response) {
    const { title, message, discount, validUntil, recipients, selectedCustomerIds } = req.body;

    if (!title || !message || !recipients) {
      throw new AppError('Title, message, and recipients are required', 400);
    }

    const result = await promotionService.sendPromotion({
      title,
      message,
      discount,
      validUntil: validUntil ? new Date(validUntil) : null,
      recipients,
      selectedCustomerIds
    });

    res.status(201).json(result);
  },

  async getForUser(req: AuthRequest, res: Response) {
    const userIdParam = req.query.userId || req.user?.id;
    if (!userIdParam) {
      throw new AppError('userId is required', 400);
    }
    const userId = parseInt(userIdParam as string, 10);
    const promos = await promotionService.getPromotionsForUser(userId);
    res.json(promos);
  },

  async getAll(req: AuthRequest, res: Response) {
    const promos = await promotionService.getAllPromotions();
    res.json(promos);
  }
};
