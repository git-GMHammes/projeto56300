// ─── Paleta 4 — Hexa Campeão (Copa do Mundo) ─────────────────────────────────
// Origem  : docs/json/paleta_cores/copa_mundo/paleta_cor.json → paleta id 1
// Estilo  : Patriótico e Institucional
// Ideal   : Portais esportivos, sistemas de clubes, plataformas nacionais
// Modelo  : Login v1 / Modelo004
//
// IMPORTANTE: Aplicar apenas via inline styles em elementos da tela de Login.
//             Nunca sobrescrever variáveis Bootstrap (--bs-*) nem classes
//             como .btn-primary, .text-danger, .bg-primary, etc.
// ─────────────────────────────────────────────────────────────────────────────
import type { LoginPalette } from './types'

const palette4: LoginPalette = {
  name: 'Hexa Campeão',

  // Fundo da página — gradiente verde bandeira para azul anil
  bgStart: '#006400', // Verde Escuro
  bgMid:   '#009739', // Verde Bandeira
  bgEnd:   '#002776', // Azul Anil

  // Card branco limpo com identidade patriótica
  cardBg: '#FFFFFF',

  // Cabeçalho — verde bandeira com gradiente para o azul anil
  headerStart: '#009739', // Verde Bandeira
  headerEnd:   '#002776', // Azul Anil
  headerText:  '#FFDF00', // Amarelo Ouro

  // Botão Entrar — verde bandeira
  btnBg:      '#009739',
  btnBgHover: '#007a2d',
  btnText:    '#FFDF00', // Amarelo Ouro

  // Links — azul anil / verde bandeira
  link:      '#002776', // Azul Anil
  linkHover: '#009739', // Verde Bandeira
}

export default palette4
