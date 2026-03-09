import api from './client'
import type { User } from '../types';

export interface AuthResponse { user: User; accessToken: string; refreshToken: string }

export const authApi = {
  register: (data: { email: string; password: string; name: string; role: string }) =>
    api.post<AuthResponse>('/auth/register', data).then(r => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then(r => r.data),
  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string }>('/auth/refresh', { refreshToken }).then(r => r.data),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }).then(r => r.data),
}