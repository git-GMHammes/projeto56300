import { createApiService } from './apiFactory'

/**
 * Service para o módulo de Usuários — /api/v1/users
 *
 * Herda TODOS os endpoints padrão da factory:
 * find, getGrouped, search, getById, getAll, getNoPagination,
 * getDeleted, getDeletedAll, create, update, deleteSoft,
 * restore, deleteHard, clearDeleted, clearDeletedById.
 *
 * Para criar um novo service, basta duplicar este arquivo
 * e alterar o nome do módulo na linha abaixo.
 */
export const userService = createApiService('users')
