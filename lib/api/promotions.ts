import { apiClient } from '../api';

export interface Promotion {
  id: number;
  title: string;
  message: string;
  discount?: string;
  validUntil?: string | null;
  recipients: string;
  userId?: number | null;
  createdAt: string;
}

export const promotionsApi = {
  async sendPromotion(data: {
    title: string;
    message: string;
    discount?: string;
    validUntil?: string;
    recipients: 'all' | 'active' | 'vip' | 'selected';
    selectedCustomerIds?: number[];
  }) {
    const response = await apiClient.post('/promotions', data);
    if (response.error) throw new Error(response.error);
    return response.data;
  },

  async getMyPromotions(): Promise<Promotion[]> {
    const response = await apiClient.get<Promotion[]>('/promotions/mine');
    if (response.data) return response.data;
    throw new Error(response.error || 'Failed to fetch promotions');
  },

  async getAll(): Promise<Promotion[]> {
    const response = await apiClient.get<Promotion[]>('/promotions');
    if (response.data) return response.data;
    throw new Error(response.error || 'Failed to fetch promotions');
  }
};
