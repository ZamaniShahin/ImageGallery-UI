import http from '../http';


export interface LoginRequest { email: string; password: string }
export interface LoginResponse { accessToken: string; refreshToken?: string }


export const AuthApi = {
login(payload: LoginRequest) {
return http.post<LoginResponse>('/auth/login', payload).then(r => r.data);
},
me() { return http.get('/auth/me').then(r => r.data); }
};