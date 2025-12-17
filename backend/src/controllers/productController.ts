import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { productService } from '../services/productService';

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
    res.json(products);
  },

  async getProductById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const product = await productService.getProductById(parseInt(id));
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
    await productService.deleteProduct(parseInt(id));
    res.status(204).send();
  }
};
