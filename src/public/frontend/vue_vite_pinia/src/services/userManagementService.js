import { createApiService } from './apiFactory'

/**
 * Service para o módulo de Gerenciamento de Usuários — /api/v1/user-management
 *
 * Endpoints disponíveis (via factory):
 * find, getGrouped, search, getById, getAll, getNoPagination,
 * getDeleted, getDeletedAll, create, update, deleteSoft,
 * restore, deleteHard, clearDeleted, clearDeletedById.
 */
export const userManagementService = createApiService('user-management')
