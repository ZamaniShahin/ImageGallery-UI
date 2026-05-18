import http from '../http';
import type { Service } from '../../types/service';
import type { Paged } from '../../types/common';

export const ServicesApi = {
  async list(p: { pageNumber?: number; pageSize?: number } = {}): Promise<Paged<Service>> {
    const r = await http.get('/services', {
      params: { pageNumber: p.pageNumber ?? 1, pageSize: p.pageSize ?? 12 },
    });
    return r.data;
  },

  async add(data: { title: string; description: string; price: number; file: File }) {
    const fd = new FormData();
    fd.append('Title', data.title);
    fd.append('Description', data.description);
    fd.append('Price', String(data.price));
    fd.append('Logo', data.file);
    const r = await http.post('/services', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return r.data;
  },

  async update(id: string, data: { title: string; description: string; price: number; file?: File | null }) {
    const fd = new FormData();
    fd.append('Id', id);
    fd.append('Title', data.title);
    fd.append('Description', data.description);
    fd.append('Price', String(data.price));
    if (data.file) fd.append('Logo', data.file);
    const r = await http.put(`/services/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return r.data;
  },

  async remove(id: string) {
    const r = await http.delete(`/services/${id}`);
    return r.data;
  },
};
