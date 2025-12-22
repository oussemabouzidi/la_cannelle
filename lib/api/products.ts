import { apiClient } from '../api';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  menuCategory: string;
  price: number;
  cost: number;
  available: boolean;
  minOrderQuantity?: number;
  tier: string[];
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  productCategories: string[];
  image?: string;
  popularity: number;
  menus?: number[];
}

export const productsApi = {
  async getProducts(filters?: {
    category?: string;
    available?: boolean;
    tier?: string;
    search?: string;
    menuId?: number;
  }): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.available !== undefined) params.append('available', String(filters.available));
    if (filters?.tier) params.append('tier', filters.tier);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.menuId) params.append('menuId', String(filters.menuId));

    const query = params.toString();
    const endpoint = query ? `/products?${query}` : '/products';

    const response = await apiClient.get<Product[]>(endpoint);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get products');
  },

  async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get product');
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await apiClient.post<Product>('/products', data);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create product');
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update product');
  },

  async deleteProduct(id: number): Promise<{ deleted?: boolean; archived?: boolean }> {
    const response = await apiClient.delete<{ deleted?: boolean; archived?: boolean }>(`/products/${id}`);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data || {};
  },
};
