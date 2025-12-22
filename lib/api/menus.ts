import { apiClient } from '../api';

export interface Menu {
  id: number;
  name: string;
  description: string;
  category: string;
  type: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  price?: number;
  image?: string;
  minPeople?: number | null;
  steps?: Array<{
    label: string;
    included: number;
  }>;
  menuProducts?: Array<{
    id: number;
    menuId: number;
    productId: number;
    product: any;
  }>;
  products?: number[];
}

export const menusApi = {
  async getMenus(filters?: {
    isActive?: boolean;
    category?: string;
    type?: string;
    search?: string;
  }): Promise<Menu[]> {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.category) params.append('category', filters.category);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    const endpoint = query ? `/menus?${query}` : '/menus';

    const response = await apiClient.get<Menu[]>(endpoint);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get menus');
  },

  async getMenuById(id: number): Promise<Menu> {
    const response = await apiClient.get<Menu>(`/menus/${id}`);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get menu');
  },

  async createMenu(data: Partial<Menu>): Promise<Menu> {
    const response = await apiClient.post<Menu>('/menus', data);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create menu');
  },

  async updateMenu(id: number, data: Partial<Menu>): Promise<Menu> {
    const response = await apiClient.put<Menu>(`/menus/${id}`, data);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update menu');
  },

  async deleteMenu(id: number): Promise<void> {
    const response = await apiClient.delete(`/menus/${id}`);
    if (response.error) {
      throw new Error(response.error);
    }
  }
};
