/**
 * env.ts — Variáveis de ambiente globais do SaaS
 *
 * Troque API_BASE_URL conforme o ambiente:
 *   DEV  (Podman local) : 'http://localhost:56300/'
 *   STG  (servidor QA)  : 'https://hml.habilidade.com.br/'
 *   PROD (produção)     : 'https://app.habilidade.com.br/'
 *
 * Para automação, pode ler de process.env injetado pelo Metro/babel-plugin-transform-inline-env.
 */

export type AppEnv = 'development' | 'staging' | 'production';

/** Ambiente atual da build */
export const APP_ENV: AppEnv = 'development';

/** URL base de todas as chamadas HTTP do sistema */
export const API_BASE_URL: string = 'http://localhost:56300/';

/** Timeout padrão (ms) para requisições HTTP */
export const API_TIMEOUT_MS = 10_000;
