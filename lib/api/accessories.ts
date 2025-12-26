type ApiResponse<T> = { data?: T; error?: string };

export interface Accessory {
  id: number;
  nameEn: string;
  nameDe?: string | null;
  descriptionEn: string;
  descriptionDe?: string | null;
  detailsEn?: string | null;
  detailsDe?: string | null;
  unitEn?: string | null;
  unitDe?: string | null;
  price: number;
  minQuantity: number;
  image?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
      credentials: 'include'
    });

    const text = await response.text();
    let data: any = undefined;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        return {
          error: parseError instanceof Error ? parseError.message : 'Invalid response format'
        };
      }
    }

    if (!response.ok) {
      return { error: (data && data.error) || text || `HTTP error! status: ${response.status}` };
    }

    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
};

export const accessoriesApi = {
  async getAccessories(filters?: { isActive?: boolean; search?: string }): Promise<Accessory[]> {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString();
    const endpoint = query ? `/api/accessories?${query}` : '/api/accessories';

    const response = await request<Accessory[]>(endpoint, { method: 'GET' });
    if (response.data) return response.data;
    throw new Error(response.error || 'Failed to get accessories');
  },

  async getAccessoryById(id: number): Promise<Accessory> {
    const response = await request<Accessory>(`/api/accessories/${id}`, { method: 'GET' });
    if (response.data) return response.data;
    throw new Error(response.error || 'Failed to get accessory');
  },

  async createAccessory(data: Partial<Accessory>): Promise<Accessory> {
    const response = await request<Accessory>('/api/accessories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (response.data) return response.data;
    throw new Error(response.error || 'Failed to create accessory');
  },

  async updateAccessory(id: number, data: Partial<Accessory>): Promise<Accessory> {
    const response = await request<Accessory>(`/api/accessories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (response.data) return response.data;
    throw new Error(response.error || 'Failed to update accessory');
  },

  async deleteAccessory(id: number): Promise<{ deleted?: boolean }> {
    const response = await request<{ deleted?: boolean }>(`/api/accessories/${id}`, { method: 'DELETE' });
    if (response.error) throw new Error(response.error);
    return response.data || {};
  }
};
