import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { menuService } from '../services/menuService';

export const menuController = {
  async getMenus(req: AuthRequest, res: Response) {
    const { isActive, category, type, search } = req.query;

    const filters: any = {};
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (category) filters.category = category as string;
    if (type) filters.type = type as string;
    if (search) filters.search = search as string;

    const menus = await menuService.getMenus(filters);
    res.json(menus);
  },

  async getMenuById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const menu = await menuService.getMenuById(parseInt(id));
    res.json(menu);
  },

  async createMenu(req: AuthRequest, res: Response) {
    const menu = await menuService.createMenu({
      ...req.body,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
    });
    res.status(201).json(menu);
  },

  async updateMenu(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const updateData: any = { ...req.body };
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const menu = await menuService.updateMenu(parseInt(id), updateData);
    res.json(menu);
  },

  async deleteMenu(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await menuService.deleteMenu(parseInt(id));
    res.status(204).send();
  }
};
