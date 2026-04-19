// ─── Paleta 3 — Neon Lilac Dark ──────────────────────────────────────────────
// Origem  : docs/json/paleta_cores/dark/paleta_cor.json → paleta id 1
// Estilo  : Cyberpunk Neon (Dark Mode)
// Ideal   : Dashboards técnicos, IDEs, ferramentas de produtividade
// Modelo  : Login v1 / Modelo003
//
// IMPORTANTE: Aplicar apenas via inline styles em elementos da tela de Login.
//             Nunca sobrescrever variáveis Bootstrap (--bs-*) nem classes
//             como .btn-primary, .text-danger, .bg-primary, etc.
// ─────────────────────────────────────────────────────────────────────────────
import type { LoginPalette } from './types'

const palette3: LoginPalette = {
  name: 'Neon Lilac Dark',

  // Fundo da página — preto profundo com toque roxo
  bgStart: '#0A0A0F', // Preto Profundo
  bgMid:   '#13101e', // Transição escura
  bgEnd:   '#1c1530', // Roxo escuro sutil

  // Card escuro (não branco — mantém imersão dark)
  cardBg: '#13101e',

  // Cabeçalho — borda neon lilás no topo
  headerStart: '#0A0A0F',
  headerEnd:   '#3a0060',
  headerText:  '#D580FF', // Lilás Elétrico

  // Botão Entrar — roxo neon vibrante
  btnBg:      '#B026FF', // Roxo Neon
  btnBgHover: '#9010e0',
  btnText:    '#FFFFFF',

  // Links — lilás elétrico
  link:      '#D580FF', // Lilás Elétrico
  linkHover: '#FF00FF', // Magenta Brilhante
}

export default palette3
