import { apiClient } from '../../../core/api/client';
import { API_CONFIG } from '../../../core/config/constants';
import { LoginRequest } from '../types/auth';
import { ResponseData } from '../../../core/api/interceptors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface LoginApiResponse {
  user: {
    id: string;
    user: string;
    last_login: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  token: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ValidationErrorData {
  validation: Record<string, string>;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<ResponseData> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
      return response;
    } catch (error) {
      throw new Error(`Erro de conexão: ${error}`);
    }
  },

  async loginLegacy(user: string, password: string): Promise<ResponseData> {
    return this.login({ user, password });
  }
};

// C:\laragon\www\mobile\react\projeto56300\src\app\modules\authentication\services\authApi.ts 