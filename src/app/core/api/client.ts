import { API_CONFIG } from '../config/constants';
import { ApiInterceptors, RequestConfig, ResponseData } from './interceptors';

class ApiClient {
  private baseURL = API_CONFIG.BASE_URL;
  private timeout = API_CONFIG.TIMEOUT;

  async post<T>(endpoint: string, data: any): Promise<ResponseData> { // ✅ Retorna ResponseData
    const config: RequestConfig = {
      url: `${this.baseURL}${endpoint}`,
      method: 'POST',
      headers: {
        ...API_CONFIG.HEADERS,
      },
      body: data,
    };

    try {
      // Aplica interceptor de requisição
      const interceptedConfig = await ApiInterceptors.requestInterceptor(config);

      // Faz a requisição
      const response = await Promise.race([
        fetch(interceptedConfig.url, {
          method: interceptedConfig.method,
          headers: interceptedConfig.headers,
          body: JSON.stringify(interceptedConfig.body),
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.timeout)
        ),
      ]);

      // Aplica interceptor de resposta
      const result = await ApiInterceptors.responseInterceptor(response);
      return result; // ✅ Retorna ResponseData diretamente

    } catch (error) {
      // Aplica interceptor de erro
      const errorResult = ApiInterceptors.errorInterceptor(error as Error);
      return errorResult; // ✅ Retorna ResponseData diretamente
    }
  }

  // Métodos GET, PUT, DELETE podem ser adicionados aqui seguindo o mesmo padrão
  async get(endpoint: string): Promise<ResponseData> {
    const config: RequestConfig = {
      url: `${this.baseURL}${endpoint}`,
      method: 'GET',
      headers: {
        ...API_CONFIG.HEADERS,
      },
    };

    try {
      const interceptedConfig = await ApiInterceptors.requestInterceptor(config);

      const response = await Promise.race([
        fetch(interceptedConfig.url, {
          method: interceptedConfig.method,
          headers: interceptedConfig.headers,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.timeout)
        ),
      ]);

      return await ApiInterceptors.responseInterceptor(response);
    } catch (error) {
      return ApiInterceptors.errorInterceptor(error as Error);
    }
  }
}

export const apiClient = new ApiClient();