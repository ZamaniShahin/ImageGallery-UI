import http from '../http';

export const AboutUsApi = {
  get() {
    return http.get('/aboutus/get').then(r => r.data);
  },
  update(data: any) {
    return http.put('/aboutus/update', data).then(r => r.data);
  }
};
