import api from '@/api/axios-config'
import { createApiService } from './apiFactory'

/**
 * Service para o módulo de Pagamentos — /api/v1/payments
 *
 * Estende os endpoints padrão da factory com métodos específicos
 * do domínio financeiro (processar, extrato, estorno).
 */
export const paymentService = {
  // Herda todos os endpoints CRUD padrão
  ...createApiService('payments'),

  /**
   * Processa um novo pagamento.
   * @param {{ amount: number, method: string, reference: string, description?: string }} payload
   */
  process: (payload) =>
    api.post('/api/v1/payments/process', payload),

  /**
   * Consulta extrato de pagamentos por período.
   * @param {string} startDate - Formato ISO: YYYY-MM-DD
   * @param {string} endDate   - Formato ISO: YYYY-MM-DD
   */
  getStatement: (startDate, endDate) =>
    api.get('/api/v1/payments/statement', {
      params: { start_date: startDate, end_date: endDate },
    }),

  /**
   * Realiza o estorno de um pagamento.
   * @param {number|string} id
   * @param {string} reason - Motivo do estorno
   */
  refund: (id, reason) =>
    api.post(`/api/v1/payments/refund/${id}`, { reason }),

  /**
   * Consulta o resumo financeiro (totais por período).
   * @param {{ period?: 'day'|'week'|'month'|'year' }} params
   */
  getSummary: (params = { period: 'month' }) =>
    api.get('/api/v1/payments/summary', { params }),
}
