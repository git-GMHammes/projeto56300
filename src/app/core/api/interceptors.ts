import { tokenService } from '../../modules/authentication/services/tokenService';

// Interface para requisições HTTP
export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

// Interface para respostas HTTP
export interface ResponseData {
  http_code: number;
  status: 'success' | 'error';
  message: string;
  data: any;
}

export class ApiInterceptors {
  // Interceptor de REQUISIÇÃO - Adiciona token de autorização
  static async requestInterceptor(config: RequestConfig): Promise<RequestConfig> {
    try {
      const token = await tokenService.getToken();
      
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }

      // Log da requisição em desenvolvimento
      if (__DEV__) {
        console.log('🚀 API Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          body: config.body,
        });
      }

      return config;
    } catch (error) {
      console.error('❌ Request Interceptor Error:', error);
      return config;
    }
  }

  // Interceptor de RESPOSTA - Trata respostas e erros
  static async responseInterceptor(response: Response): Promise<ResponseData> {
    try {
      const data = await response.json();

      // Log da resposta em desenvolvimento
      if (__DEV__) {
        console.log('📥 API Response:', {
          status: response.status,
          url: response.url,
          data,
        });
      }

      // Se token expirou (401), fazer logout automático
      if (response.status === 401) {
        console.warn('🔐 Token expirado, fazendo logout...');
        await tokenService.clearAll();
        // TODO: Redirecionar para tela de login
      }

      // Retorna dados no formato padronizado
      return {
        http_code: response.status,
        status: response.ok ? 'success' : 'error',
        message: data.message || (response.ok ? 'Sucesso' : 'Erro na requisição'),
        data: data.data || data,
      };

    } catch (error) {
      console.error('❌ Response Interceptor Error:', error);
      
      // Retorna erro padronizado
      return {
        http_code: 500,
        status: 'error',
        message: 'Erro ao processar resposta da API',
        data: null,
      };
    }
  }

  // Interceptor de ERRO - Trata erros de rede
  static errorInterceptor(error: Error): ResponseData {
    console.error('❌ API Error:', error);

    // Erro de rede/conexão
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        http_code: 0,
        status: 'error',
        message: 'Erro de conexão. Verifique sua internet.',
        data: null,
      };
    }

    // Erro de timeout
    if (error.message.includes('timeout')) {
      return {
        http_code: 408,
        status: 'error',
        message: 'Tempo limite excedido. Tente novamente.',
        data: null,
      };
    }

    // Erro genérico
    return {
      http_code: 500,
      status: 'error',
      message: 'Erro interno. Tente novamente.',
      data: null,
    };
  }
}