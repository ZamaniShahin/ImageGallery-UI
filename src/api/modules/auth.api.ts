import http from '../http';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const AuthApi = {
  register(payload: RegisterRequest) {
    return http.post<string>('/auth/register', payload).then(r => r.data);
  },
};
