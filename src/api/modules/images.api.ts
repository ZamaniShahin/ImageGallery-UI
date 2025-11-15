import http from '../http';

export const ImagesApi = {

  async getById(id: string) {
    const r = await http.get(`/categories/${id}/image`);
    return r.data.valueOrDefault ?? null;
  },
  // Get all images for a specific category
  async list(categoryId: string) {
    const r = await http
      .get(`/categories/${categoryId}/images`);
    return r.data?.valueOrDefault ?? [];
  },
  async getByCategory(categoryId: string) {
    const r = await http.get(`/categories/${categoryId}/images`);
    return r.data.valueOrDefault ?? [];
  },
  // Upload a new image to a specific category
  async create(categoryId: string, file: File, description: string) {
    const base64 = await toBase64(file);
    const payload = {
      id: categoryId,
      content: base64.split(',')[1], // remove the data:image/... prefix
      description,
    };
    return http
      .post(`/categories/${categoryId}/images`, payload)
      .then((r) => r.data);
  },
};

// helper to convert a File into a base64 string
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
