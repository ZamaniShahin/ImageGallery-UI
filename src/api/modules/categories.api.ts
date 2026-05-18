import http from '../http';
import type { Category } from '../../types/category';
import type { Paged } from '../../types/common';

export const CategoriesApi = {
  async list(p: { pageNumber?: number; pageSize?: number } = {}): Promise<Paged<Category>> {
    const r = await http.get('/categories', {
      params: { pageNumber: p.pageNumber ?? 1, pageSize: p.pageSize ?? 12 },
    });
    return r.data;
  },

  async listAll(): Promise<Category[]> {
    const r = await http.get('/categories', { params: { pageNumber: 1, pageSize: 100 } });
    return r.data?.items ?? [];
  },

  async add(data: { title: string; description: string }) {
    const r = await http.post('/categories', data);
    return r.data;
  },

  async update(id: string, data: { title: string; description: string }) {
    const r = await http.put(`/categories/${id}`, data);
    return r.data;
  },

  async remove(id: string) {
    const r = await http.delete(`/categories/${id}`);
    return r.data;
  },
};
