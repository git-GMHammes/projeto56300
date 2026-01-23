export const API_CONFIG = {
  BASE_URL: 'https://habilidade.com/codeigniter56300/src/public',
  ENDPOINTS: {
    LOGIN: '/api/v1/user-management/login',
  },
  TIMEOUT: 10000, // 10 segundos
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
} as const;

export const APP_CONFIG = {
  NAME: 'Projeto56300',
  VERSION: '1.0.0',
  ENVIRONMENT: 'development', // Valor fixo, sem process.env
} as const;