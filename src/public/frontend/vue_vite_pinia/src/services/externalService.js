import axios from 'axios'

/**
 * Cliente HTTP dedicado para APIs externas de terceiros.
 * NÃO usa a instância principal (api) para não expor o Bearer token interno.
 */
const externalClient = axios.create({
  timeout: 10_000,
  headers: { Accept: 'application/json' },
})

/**
 * Service para integrações com APIs de terceiros e serviços públicos.
 * Exemplos: ViaCEP, IBGE, cotações de câmbio, etc.
 */
export const externalService = {
  /**
   * Consulta endereço completo a partir de um CEP (ViaCEP).
   * @param {string} cep - CEP sem formatação (ex: '01310100')
   * @returns {Promise} { cep, logradouro, bairro, localidade, uf, ... }
   */
  getAddressByCep: (cep) =>
    externalClient.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`),

  /**
   * Consulta lista de estados brasileiros ordenada por nome (IBGE).
   */
  getStates: () =>
    externalClient.get(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
    ),

  /**
   * Consulta municípios de um estado (IBGE).
   * @param {string|number} stateId - ID do estado (ex: 35 para SP, 33 para RJ)
   */
  getCitiesByState: (stateId) =>
    externalClient.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`,
    ),

  /**
   * Consulta cotações do dia (AwesomeAPI).
   * @param {string[]} pairs - Pares de moedas (ex: ['USD-BRL', 'EUR-BRL'])
   */
  getExchangeRates: (pairs = ['USD-BRL', 'EUR-BRL']) =>
    externalClient.get(`https://economia.awesomeapi.com.br/json/last/${pairs.join(',')}`),
}
