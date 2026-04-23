// ─── Paleta 6 — Tech Verde Neon ──────────────────────────────────────────────
// Origem  : docs/json/paleta_cores/verde_bandeira/paleta_cor.json → paleta id 3
// Estilo  : Digital e Futurista (Dark Mode)
// Ideal   : Startups de tecnologia, fintechs, apps modernos
// Modelo  : Login v1 / Modelo006
//
// IMPORTANTE: Aplicar apenas via inline styles em elementos da tela de Login.
//             Nunca sobrescrever variáveis Bootstrap (--bs-*) nem classes
//             como .btn-primary, .text-danger, .bg-primary, etc.
// ─────────────────────────────────────────────────────────────────────────────
import type { LoginPalette } from './types'

const palette6: LoginPalette = {
  name: 'Tech Verde Neon',

  // Fundo da página — preto profundo
  bgStart: '#0A0A0F', // Preto Profundo
  bgMid:   '#0d1a0d', // Escuro esverdeado
  bgEnd:   '#0f2318', // Verde muito escuro

  // Card cinza escuro (dark mode)
  cardBg: '#1a1a1a',

  // Cabeçalho — preto com acento verde neon
  headerStart: '#0A0A0F',
  headerEnd:   '#003d1a',
  headerText:  '#00FF88', // Verde Neon

  // Botão Entrar — verde bandeira
  btnBg:      '#009739', // Verde Bandeira
  btnBgHover: '#007a2d',
  btnText:    '#FFFFFF',

  // Links — verde neon / verde bandeira
  link:      '#00FF88', // Verde Neon
  linkHover: '#009739', // Verde Bandeira
}

export default palette6
