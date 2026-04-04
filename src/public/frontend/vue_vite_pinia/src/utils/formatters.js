/**
 * Utilitários de formatação para o HUB.
 * Funções puras (sem side effects) — seguras para uso em qualquer contexto.
 */

/**
 * Formata um número para moeda BRL (ou outra).
 * @param {number} value
 * @param {string} [currency='BRL']
 * @returns {string}
 */
export function formatCurrency(value, currency = 'BRL') {
  if (value == null || isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
}

/**
 * Formata uma data ISO para o padrão brasileiro (DD/MM/AAAA).
 * @param {string|Date} date
 * @param {boolean} [includeTime=false]
 * @returns {string}
 */
export function formatDate(date, includeTime = false) {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d)) return '—'

  /** @type {Intl.DateTimeFormatOptions} */
  const options = {
    day: '2-digit', month: '2-digit', year: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  }
  return new Intl.DateTimeFormat('pt-BR', options).format(d)
}

/**
 * Formata um número com separadores de milhar.
 * @param {number} value
 * @param {number} [decimals=0]
 * @returns {string}
 */
export function formatNumber(value, decimals = 0) {
  if (value == null || isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Trunca um texto longo adicionando reticências.
 * @param {string} text
 * @param {number} [maxLength=50]
 * @returns {string}
 */
export function truncate(text, maxLength = 50) {
  if (!text) return ''
  return text.length > maxLength ? `${text.substring(0, maxLength)}…` : text
}

/**
 * Converte snake_case ou kebab-case para Title Case legível.
 * @param {string} str
 * @returns {string}
 * @example toTitleCase('user_name') → 'User Name'
 */
export function toTitleCase(str) {
  if (!str) return ''
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

/**
 * Retorna tempo relativo em PT-BR ("há 5 minutos", "em 2 dias").
 * @param {string|Date} date
 * @returns {string}
 */
export function timeAgo(date) {
  if (!date) return '—'
  const rtf  = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
  const diff = (new Date(date) - Date.now()) / 1000

  const thresholds = [
    { limit: 60,         divisor: 1,          unit: 'second' },
    { limit: 3_600,      divisor: 60,          unit: 'minute' },
    { limit: 86_400,     divisor: 3_600,       unit: 'hour'   },
    { limit: 2_592_000,  divisor: 86_400,      unit: 'day'    },
    { limit: 31_536_000, divisor: 2_592_000,   unit: 'month'  },
    { limit: Infinity,   divisor: 31_536_000,  unit: 'year'   },
  ]

  for (const { limit, divisor, unit } of thresholds) {
    if (Math.abs(diff) < limit) {
      return rtf.format(Math.round(diff / divisor), unit)
    }
  }
  return '—'
}

/**
 * Formata CPF com máscara (somente dígitos → 000.000.000-00).
 * @param {string} cpf
 * @returns {string}
 */
export function formatCpf(cpf) {
  if (!cpf) return ''
  return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata CNPJ com máscara (somente dígitos → 00.000.000/0000-00).
 * @param {string} cnpj
 * @returns {string}
 */
export function formatCnpj(cnpj) {
  if (!cnpj) return ''
  return cnpj.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Formata telefone (somente dígitos → (00) 00000-0000).
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return ''
  const clean = phone.replace(/\D/g, '')
  return clean.length === 11
    ? clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    : clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

/**
 * Retorna a inicial em maiúsculo de um nome (para avatares).
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}
