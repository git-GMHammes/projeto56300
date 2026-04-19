// ─── Contrato de paleta para telas de Login ───────────────────────────────────
//
// REGRA: Essas paletas são aplicadas EXCLUSIVAMENTE via inline styles e
//        CSS Custom Properties com prefixo --login-*  para NUNCA conflitar
//        com as classes e variáveis padrão do Bootstrap
//        (--bs-primary, --bs-success, .btn-primary, .text-danger, etc.)
//
export interface LoginPalette {
  /** Nome legível da paleta (para debug e documentação) */
  name: string

  // ── Fundo da página ────────────────────────────────────────────────────────
  /** Cor de início do gradiente de fundo */
  bgStart: string
  /** Cor intermediária do gradiente de fundo */
  bgMid: string
  /** Cor final do gradiente de fundo */
  bgEnd: string

  // ── Card principal ─────────────────────────────────────────────────────────
  /** Cor de fundo do card */
  cardBg: string

  // ── Cabeçalho do card ──────────────────────────────────────────────────────
  /** Cor de início do gradiente do header do card */
  headerStart: string
  /** Cor final do gradiente do header do card */
  headerEnd: string
  /** Cor do texto do header */
  headerText: string

  // ── Botão primário (Entrar) ────────────────────────────────────────────────
  /** Cor de fundo do botão */
  btnBg: string
  /** Cor de fundo do botão no estado hover */
  btnBgHover: string
  /** Cor do texto do botão */
  btnText: string

  // ── Links (Novo Registro / Recuperar Senha) ────────────────────────────────
  /** Cor padrão dos links */
  link: string
  /** Cor dos links no hover */
  linkHover: string
}
