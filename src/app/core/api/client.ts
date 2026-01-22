import { API_CONFIG } from '../config/constants';

class ApiClient {
    private baseURL = API_CONFIG.BASE_URL;

    async post<T>(endpoint: string, data: any): Promise<T> {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            return result;
        } catch (error) {
            throw new Error(`Erro de conexão ${error}`);
        }
    }
}

export const apiClient = new ApiClient();