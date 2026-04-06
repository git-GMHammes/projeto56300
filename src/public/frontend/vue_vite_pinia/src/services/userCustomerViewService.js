import { createApiService } from './apiFactory'

/**
 * Service de somente-leitura para a view user_customer_view — /api/v1/user-customer-view
 *
 * Endpoints disponíveis (somente consulta):
 * find, getGrouped, search, getById, getAll, getNoPagination,
 * getDeleted, getDeletedAll
 */
const { find, getGrouped, search, getById, getAll, getNoPagination, getDeleted, getDeletedAll } =
  createApiService('user-customer-view')

export const userCustomerViewService = {
  find,
  getGrouped,
  search,
  getById,
  getAll,
  getNoPagination,
  getDeleted,
  getDeletedAll,
}
