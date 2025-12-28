import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { menuService } from '../services/menuService';
import { DEFAULT_TRANSLATABLE_KEYS, parseAppLanguage, translateJsonByKeys } from '../services/translationService';

export const menuController = {
  async getMenus(req: AuthRequest, res: Response) {
    const { isActive, search, serviceId, includeImages } = req.query;

    const filters: any = {};
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (search) filters.search = search as string;
    if (serviceId !== undefined) {
      const parsed = parseInt(String(serviceId), 10);
      if (Number.isFinite(parsed)) filters.serviceId = parsed;
    }
    if (includeImages !== undefined) {
      filters.includeImages = String(includeImages) === 'true' || String(includeImages) === '1';
    }

    const menus = await menuService.getMenus(filters);
    const language = parseAppLanguage(req.header('x-language') ?? req.query.lang ?? req.query.language);
    const dataDefaultLanguage = parseAppLanguage(process.env.DATA_DEFAULT_LANGUAGE) ?? 'DE';
    if (language && language !== dataDefaultLanguage) {
      await translateJsonByKeys(menus, language, DEFAULT_TRANSLATABLE_KEYS);
    }
    res.json(menus);
  },

  async getMenuById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const includeImages = String(req.query.includeImages ?? '') === 'true' || String(req.query.includeImages ?? '') === '1';
    const menu = await menuService.getMenuById(parseInt(id), { includeImages });
    const language = parseAppLanguage(req.header('x-language') ?? req.query.lang ?? req.query.language);
    const dataDefaultLanguage = parseAppLanguage(process.env.DATA_DEFAULT_LANGUAGE) ?? 'DE';
    if (language && language !== dataDefaultLanguage) {
      await translateJsonByKeys(menu, language, DEFAULT_TRANSLATABLE_KEYS);
    }
    res.json(menu);
  },

  async createMenu(req: AuthRequest, res: Response) {
    const minPeopleValue = req.body.minPeople;
    const minPeople = minPeopleValue === '' || minPeopleValue === null || minPeopleValue === undefined
      ? null
      : parseInt(minPeopleValue, 10);
    const serviceIdsSource = Array.isArray(req.body?.serviceIds)
      ? req.body.serviceIds
      : Array.isArray(req.body?.services)
      ? req.body.services
      : undefined;
    const serviceIds = Array.isArray(serviceIdsSource)
      ? (serviceIdsSource as any[]).map((id) => parseInt(id as any, 10)).filter((id) => Number.isFinite(id))
      : undefined;
    const { category: _category, type: _type, services: _services, ...body } = req.body || {};
    const menu = await menuService.createMenu({
      ...body,
      serviceIds,
      minPeople: Number.isFinite(minPeople) ? minPeople : null,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
    });
    res.status(201).json(menu);
  },

  async updateMenu(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const updateData: any = { ...req.body };

    // Normalize date fields
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    // Normalize price (avoid sending empty string/NaN to Prisma)
    if (updateData.price === '' || updateData.price === null) {
      updateData.price = null;
    } else if (updateData.price !== undefined) {
      const parsedPrice = parseFloat(updateData.price);
      updateData.price = Number.isFinite(parsedPrice) ? parsedPrice : null;
    }

    if (updateData.minPeople === '' || updateData.minPeople === null) {
      updateData.minPeople = null;
    } else if (updateData.minPeople !== undefined) {
      const parsedMinPeople = parseInt(updateData.minPeople, 10);
      updateData.minPeople = Number.isFinite(parsedMinPeople) ? parsedMinPeople : null;
    }
    // Remove client-only fields that Prisma doesn't accept
    delete updateData.products;
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.menuProducts;
    delete updateData.menuServices;
    delete updateData.category;
    delete updateData.type;
    delete updateData.services;

    const serviceIdsSource = Array.isArray(req.body?.serviceIds)
      ? req.body.serviceIds
      : Array.isArray(req.body?.services)
      ? req.body.services
      : undefined;
    const serviceIds = Array.isArray(serviceIdsSource)
      ? (serviceIdsSource as any[]).map((id) => parseInt(id as any, 10)).filter((id) => Number.isFinite(id))
      : undefined;

    const menu = await menuService.updateMenu(parseInt(id), { ...updateData, serviceIds });
    res.json(menu);
  },

  async deleteMenu(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await menuService.deleteMenu(parseInt(id));
    res.status(204).send();
  }
};
