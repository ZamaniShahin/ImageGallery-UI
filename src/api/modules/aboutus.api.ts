import http from '../http';

export const AboutUsApi = {
  get() {
    return http.get('/about-us').then(r => r.data);
  },
  update(data: any) {
    return http.put('/about-us', data).then(r => r.data);
  }
};
