import {
  ApiMessageResponse,
  AuthResponse,
  ForgotPasswordRequest,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  User,
} from '../../types/auth';
import { apiClient } from './client';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: Omit<RegisterCredentials, 'confirmSenha'>): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiMessageResponse> {
    const response = await apiClient.post<ApiMessageResponse>(
      '/auth/forgot-password',
      data,
    );
    return response.data;
  },

  async resetPassword(
    data: Omit<ResetPasswordRequest, 'confirmNovaSenha'>,
  ): Promise<ApiMessageResponse> {
    const response = await apiClient.post<ApiMessageResponse>(
      '/auth/reset-password',
      data,
    );
    return response.data;
  },
};
