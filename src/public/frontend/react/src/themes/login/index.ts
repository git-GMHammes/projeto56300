// ─── Paletas de Login — Barrel Export ────────────────────────────────────────
//
// Mapeamento:  palette[N]  →  Login v1 / Modelo00[N]
//
// Para adicionar uma nova paleta:
//   1. Crie o arquivo paletteN.ts nesta pasta seguindo o contrato LoginPalette
//   2. Importe e exporte abaixo
//   3. Crie a página correspondente em pages/Auth/Login/v1/ModeloN/
//
// REGRA DE ORO: as paletas usam inline styles / CSS Custom Properties
// prefixadas com --login-*.  NUNCA altere variáveis Bootstrap (--bs-*).
// ─────────────────────────────────────────────────────────────────────────────
export type { LoginPalette } from './types'

export { default as palette1 } from './palette1' // Neon Purple         → Modelo001
export { default as palette2 } from './palette2' // Corporativo Clássico → Modelo002
export { default as palette3 } from './palette3' // Neon Lilac Dark      → Modelo003
export { default as palette4 } from './palette4' // Hexa Campeão         → Modelo004
export { default as palette5 } from './palette5' // Dourado Real         → Modelo005
export { default as palette6 } from './palette6' // Tech Verde Neon      → Modelo006
