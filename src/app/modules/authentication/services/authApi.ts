import { API_CONFIG } from '../../../core/config/constants';

export const authApi = {
  async login(user: string, password: string) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, password }),
    });

    return await response.json();
  },
};