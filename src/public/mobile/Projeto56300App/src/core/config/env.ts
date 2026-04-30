/**
 * env.ts — Variáveis de ambiente globais do SaaS
 *
 * Troque APP_ENV conforme o ambiente:
 *   development : Podman local  → http://localhost:56300
 *   staging     : servidor QA   → https://habilidade.com/projeto56300/src/public
 *   production  : produção      → https://habilidade.com/projeto56300/src/public
 */

export type AppEnv = 'development' | 'staging' | 'production';

/** Ambiente atual da build */
export const APP_ENV: AppEnv = 'development';

/** Versão da API consumida pelo app */
export const APP_VERSION = 'V1';

/** URL base de todas as chamadas HTTP do sistema */
export const API_BASE_URL: string =
    (APP_ENV as string) === 'production' || (APP_ENV as string) === 'staging'
        ? 'https://habilidade.com/projeto56300/src/public'
        : 'http://localhost:56300';

/** Timeout padrão (ms) para requisições HTTP */
export const API_TIMEOUT_MS = 10_000;

/** Código único do contrato/cliente desta instalação */
export const APP_CONTRACT_CODE = 'cont0001';
