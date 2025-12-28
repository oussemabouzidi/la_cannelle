import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { productService } from '../services/productService';
import { AppError } from '../middleware/errorHandler';
import { DEFAULT_TRANSLATABLE_KEYS, parseAppLanguage, translateJsonByKeys } from '../services/translationService';

export const productController = {
  async getProducts(req: AuthRequest, res: Response) {
    const { category, available, tier, search, menuId } = req.query;

    const filters: any = {};
    if (category) filters.category = category;
    if (available !== undefined) filters.available = available === 'true';
    if (tier) filters.tier = tier;
    if (search) filters.search = search as string;
    if (menuId) filters.menuId = parseInt(menuId as string);

    const products = await productService.getProducts(filters);
    const language = parseAppLanguage(req.header('x-language') ?? req.query.lang ?? req.query.language);
    const dataDefaultLanguage = parseAppLanguage(process.env.DATA_DEFAULT_LANGUAGE) ?? 'DE';
    if (language && language !== dataDefaultLanguage) {
      await translateJsonByKeys(products, language, DEFAULT_TRANSLATABLE_KEYS);
    }
    res.json(products);
  },

  async getProductById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const product = await productService.getProductById(parseInt(id));
    const language = parseAppLanguage(req.header('x-language') ?? req.query.lang ?? req.query.language);
    const dataDefaultLanguage = parseAppLanguage(process.env.DATA_DEFAULT_LANGUAGE) ?? 'DE';
    if (language && language !== dataDefaultLanguage) {
      await translateJsonByKeys(product, language, DEFAULT_TRANSLATABLE_KEYS);
    }
    res.json(product);
  },

  async createProduct(req: AuthRequest, res: Response) {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  },

  async updateProduct(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const product = await productService.updateProduct(parseInt(id), req.body);
    res.json(product);
  },

  async deleteProduct(req: AuthRequest, res: Response) {
    const { id } = req.params;
    try {
      const result = await productService.deleteProduct(parseInt(id));
      res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Failed to delete product', error);
      return res.status(500).json({ error: 'Unable to delete product' });
    }
  }
};
