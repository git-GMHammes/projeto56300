import { createApiService } from './apiFactory'

/**
 * Service para o módulo de Clientes — /api/v1/user-customer
 *
 * Endpoints disponíveis (via factory):
 * find, getGrouped, search, getById, getAll, getNoPagination,
 * getDeleted, getDeletedAll, create, update, deleteSoft,
 * restore, deleteHard, clearDeleted, clearDeletedById.
 */
export const userCustomerService = createApiService('user-customer')
