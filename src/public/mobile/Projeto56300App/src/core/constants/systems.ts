/**
 * systems.ts — Identificadores globais de cada sistema/módulo do SaaS
 *
 * APP_SYSTEM_ID  →  número inteiro que identifica qual sistema está ativo.
 *                   Usado nos services, logs, cabeçalhos HTTP (X-System-Id), etc.
 *
 * Como usar:
 *   import { APP_SYSTEM_ID, SystemId, SYSTEM_LABELS } from '@core/constants/systems';
 */

/** Mapa de todos os sistemas do SaaS.
 *  Cada valor corresponde ao ID enviado ao back-end em cabeçalhos e rotas. */
export enum SystemId {
  AUTH              = 1,   // Autenticação & controle de acesso
  ESTOQUE           = 2,   // Controle de estoque
  MECANICA          = 3,   // Oficina mecânica
  VETERINARIA       = 4,   // Clínica veterinária
  TAREFAS           = 5,   // Gestão de tarefas / kanban
  GESTAO_DOCUMENTAL = 6,   // Gestão documental
  USUARIO           = 7,   // Gestão de usuários / perfis
}

/** ID do sistema ativo nesta instalação/build */
export const APP_SYSTEM_ID: SystemId = SystemId.AUTH;

/** Labels legíveis para exibição em telas, logs e menus */
export const SYSTEM_LABELS: Record<SystemId, string> = {
  [SystemId.AUTH]:              'Autenticação',
  [SystemId.ESTOQUE]:           'Controle de Estoque',
  [SystemId.MECANICA]:          'Oficina Mecânica',
  [SystemId.VETERINARIA]:       'Clínica Veterinária',
  [SystemId.TAREFAS]:           'Gestão de Tarefas',
  [SystemId.GESTAO_DOCUMENTAL]: 'Gestão Documental',
  [SystemId.USUARIO]:           'Gestão de Usuários',
};
