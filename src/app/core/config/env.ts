// Configurações de ambiente para React Native
// Como não temos process.env no RN, usamos configurações estáticas

export const ENV = {
  NODE_ENV: 'development', // ou 'production'
  API_URL: 'https://habilidade.com/codeigniter56300/src/public',
  APP_NAME: 'Projeto56300',
  VERSION: '1.0.0',
  DEBUG: true, // false em produção
  TIMEOUT: 10000,
} as const;