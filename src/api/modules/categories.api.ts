import http from '../http';

export const CategoriesApi = {
  async getAll() {
    const r = await http.get('/categories');
    return r.data.valueOrDefault ?? [];
  },

  async add(data: any) {
    const r = await http.post('/categories', data);
    return r.data;
  },

  async update(id: number, data: any) {
    const r = await http.put(`/categories/${id}`, data);
    return r.data;
  },

  async remove(id: number) {
    const r = await http.delete(`/categories/${id}`);
    return r.data;
  },
};
