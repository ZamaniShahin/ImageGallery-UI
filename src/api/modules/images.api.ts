import http from '../http';

export const ImagesApi = {

  async getById(id: string) {
    const r = await http.get(`/categories/${id}/image`);
    return r.data ?? null;
  },

  async list(categoryId: string) {
    const r = await http.get(`/categories/${categoryId}/images`);
    return r.data ?? [];
  },

  async getByCategory(categoryId: string) {
    const r = await http.get(`/categories/${categoryId}/images`);
    return r.data ?? [];
  },

  async create(categoryId: string, file: File, description: string) {
    const base64 = await toBase64(file);
    const payload = {
      id: categoryId,
      content: base64.split(',')[1],
      description,
    };
    return http.post(`/categories/${categoryId}/images`, payload).then((r) => r.data);
  },

  async update(id: string, description: string) {
    return http.put(`/categories/images/${id}`, { description }).then((r) => r.data);
  },

  async delete(id: string) {
    return http.delete(`/categories/images/${id}`).then((r) => r.data);
  },
};

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
