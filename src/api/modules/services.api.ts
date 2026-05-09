import http from '../http';

export const ServicesApi = {
  // ✅ Get all services
  getAll() {
    return http.get('/services').then((r) => r.data ?? []);
  },

  // ✅ Add service (base64 logo)
  async add(data: { title: string; description: string; price: number; file: File | null }) {
    let base64Logo = '';
    if (data.file) {
      base64Logo = await toBase64(data.file);
      base64Logo = base64Logo.split(',')[1] ?? ''; // remove data:image/... prefix
    }

    const payload = {
      title: data.title,
      description: data.description,
      price: data.price,
      logo: base64Logo, // 👈 base64 string
    };

    return http.post('/services', payload).then((r) => r.data);
  },

  // ✅ Update service
  async update(id: string, data: { title: string; description: string; price: number; file?: File | null }) {
    let base64Logo = '';
    if (data.file) {
      base64Logo = await toBase64(data.file);
      base64Logo = base64Logo.split(',')[1] ?? '';
    }

    const payload = {
      id,
      title: data.title,
      description: data.description,
      price: data.price,
      logo: base64Logo, // 👈 base64 string
    };

    return http.put(`/services/${id}`, payload).then((r) => r.data);
  },

  // ✅ Delete service
  remove(id: string) {
    return http.delete(`/services/${id}`).then((r) => r.data);
  },
};

// helper — convert file to base64 string
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
