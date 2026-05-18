import http from '../http';

export const AboutUsApi = {
  get() {
    return http.get('/about-us').then(r => r.data);
  },

  update(data: { title: string; h2Title: string; description: string; file?: File | null }) {
    const fd = new FormData();
    fd.append('Title', data.title);
    fd.append('H2Title', data.h2Title);
    fd.append('Description', data.description);
    if (data.file) fd.append('Image', data.file);
    return http.put('/about-us', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};
