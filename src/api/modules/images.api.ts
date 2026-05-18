import http from '../http';
import type { ImageItem } from '../../types/image';
import type { Paged } from '../../types/common';

export const ImagesApi = {
  async getById(id: string): Promise<ImageItem | null> {
    const r = await http.get(`/categories/${id}/image`);
    return r.data ?? null;
  },

  async listByCategory(
    categoryId: string,
    p: { pageNumber?: number; pageSize?: number; search?: string } = {},
  ): Promise<Paged<ImageItem>> {
    const r = await http.get(`/categories/${categoryId}/images`, {
      params: {
        pageNumber: p.pageNumber ?? 1,
        pageSize: p.pageSize ?? 12,
        search: p.search?.trim() ? p.search.trim() : undefined,
      },
    });
    return r.data;
  },

  async create(categoryId: string, file: File, title: string, description: string) {
    const fd = new FormData();
    fd.append('Id', categoryId);
    fd.append('Title', title);
    fd.append('Description', description);
    fd.append('Content', file);
    const r = await http.post(`/categories/${categoryId}/images`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return r.data;
  },

  async update(id: string, title: string, description: string, file?: File | null) {
    const fd = new FormData();
    fd.append('Id', id);
    fd.append('Title', title);
    fd.append('Description', description);
    if (file) fd.append('Content', file);
    const r = await http.put(`/categories/images/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return r.data;
  },

  async delete(id: string) {
    return http.delete(`/categories/images/${id}`).then((r) => r.data);
  },
};
