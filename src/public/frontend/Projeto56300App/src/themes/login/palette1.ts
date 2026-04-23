// ─── Paleta 1 — Neon Purple ───────────────────────────────────────────────────
// Origem  : docs/json/paleta_cores/tom_roxo/paleta_cor.json → paleta id 2
// Estilo  : Moderna e Vibrante
// Ideal   : Startups tech, apps, produtos digitais
// Modelo  : Login v1 / Modelo001
//
// IMPORTANTE: Aplicar apenas via inline styles em elementos da tela de Login.
//             Nunca sobrescrever variáveis Bootstrap (--bs-*) nem classes
//             como .btn-primary, .text-danger, .bg-primary, etc.
// ─────────────────────────────────────────────────────────────────────────────
import type { LoginPalette } from './types'

const palette1: LoginPalette = {
  name: 'Neon Purple',

  // Fundo da página — gradiente noturno roxo
  bgStart: '#1A1A2E', // Preto Azulado
  bgMid:   '#4A3F6B', // Roxo Profundo
  bgEnd:   '#663399', // Púrpura Real

  // Card branco limpo para contraste
  cardBg: '#FFFFFF',

  // Cabeçalho do card — gradiente roxo elétrico
  headerStart: '#4A3F6B', // Roxo Profundo
  headerEnd:   '#8A2BE2', // Roxo Elétrico
  headerText:  '#FFFFFF',

  // Botão Entrar — roxo elétrico
  btnBg:      '#8A2BE2', // Roxo Elétrico
  btnBgHover: '#7122C5',
  btnText:    '#FFFFFF',

  // Links — lilás brilhante
  link:      '#8A2BE2', // Roxo Elétrico
  linkHover: '#BA55D3', // Lilás Brilhante
}

export default palette1
