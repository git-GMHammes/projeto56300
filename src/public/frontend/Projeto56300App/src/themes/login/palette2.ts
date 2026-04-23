// ─── Paleta 2 — Corporativo Clássico ─────────────────────────────────────────
// Origem  : docs/json/paleta_cores/azul_cel/paleta_cor.json → paleta id 1
// Estilo  : Formal e Institucional
// Ideal   : Bancos, consultorias, sistemas ERP corporativos
// Modelo  : Login v1 / Modelo002
//
// IMPORTANTE: Aplicar apenas via inline styles em elementos da tela de Login.
//             Nunca sobrescrever variáveis Bootstrap (--bs-*) nem classes
//             como .btn-primary, .text-danger, .bg-primary, etc.
// ─────────────────────────────────────────────────────────────────────────────
import type { LoginPalette } from './types'

const palette2: LoginPalette = {
  name: 'Corporativo Clássico',

  // Fundo da página — gradiente azul corporativo sóbrio
  bgStart: '#012169', // Azul Base escuro
  bgMid:   '#1a3a7a', // Azul Intermediário
  bgEnd:   '#2c5282', // Azul Médio

  // Card cinza claríssimo (não-branco puro, levemente institucional)
  cardBg: '#F5F7FA',

  // Cabeçalho — azul base sólido
  headerStart: '#012169', // Azul Base
  headerEnd:   '#4A90E2', // Azul Claro
  headerText:  '#FFFFFF',

  // Botão Entrar — azul claro profissional
  btnBg:      '#012169',
  btnBgHover: '#01174a',
  btnText:    '#FFFFFF',

  // Links — azul claro navegável
  link:      '#4A90E2', // Azul Claro
  linkHover: '#012169', // Azul Base
}

export default palette2
