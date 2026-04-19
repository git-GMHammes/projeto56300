// ─── Paleta 5 — Dourado Real ──────────────────────────────────────────────────
// Origem  : docs/json/paleta_cores/azul_cel/paleta_cor.json → paleta id 4
// Estilo  : Sofisticado e Elegante (premium)
// Ideal   : Joalheria, imobiliárias de alto padrão, marcas exclusivas
// Modelo  : Login v1 / Modelo005
//
// IMPORTANTE: Aplicar apenas via inline styles em elementos da tela de Login.
//             Nunca sobrescrever variáveis Bootstrap (--bs-*) nem classes
//             como .btn-primary, .text-danger, .bg-primary, etc.
// ─────────────────────────────────────────────────────────────────────────────
import type { LoginPalette } from './types'

const palette5: LoginPalette = {
  name: 'Dourado Real',

  // Fundo da página — azul meia-noite profundo
  bgStart: '#191970', // Azul Meia-Noite
  bgMid:   '#012169', // Azul Base
  bgEnd:   '#0a0f2e', // Escuro azulado

  // Card com fundo creme sofisticado
  cardBg: '#FFFDD0', // Creme

  // Cabeçalho — azul escuro com dourado
  headerStart: '#012169', // Azul Base
  headerEnd:   '#191970', // Azul Meia-Noite
  headerText:  '#D4AF37', // Dourado

  // Botão Entrar — dourado metálico
  btnBg:      '#C4A94D', // Dourado Metálico
  btnBgHover: '#a8903f',
  btnText:    '#191970', // Azul Meia-Noite (contraste)

  // Links — dourado / prata
  link:      '#C4A94D', // Dourado Metálico
  linkHover: '#D4AF37', // Dourado Vivo
}

export default palette5
