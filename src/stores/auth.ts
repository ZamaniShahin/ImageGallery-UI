import { defineStore } from 'pinia';
import { AuthApi, type LoginRequest } from '../api/modules/auth.api';


interface State {
token: string | null;
user: any | null;
}


export const useAuthStore = defineStore('auth', {
state: (): State => ({ token: localStorage.getItem('token'), user: null }),
getters: { isAuthenticated: (s) => !!s.token },
actions: {
async login(payload: LoginRequest) {
const res = await AuthApi.login(payload);
this.token = res.accessToken;
localStorage.setItem('token', this.token);
this.user = await AuthApi.me().catch(() => null);
},
logout() {
this.token = null; this.user = null; localStorage.removeItem('token');
}
}
});