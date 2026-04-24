// Validadores — porta fiel dos filed_*.js para TypeScript puro (sem DOM)

// ─── CPF ────────────────────────────────────────────────────────────────────
export function isValidCpf(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digit = (base: string): string => {
    const n = base.length + 1;
    const sum = base.split('').reduce((a, c, i) => a + parseInt(c) * (n - i), 0);
    const r = sum % 11;
    return r < 2 ? '0' : String(11 - r);
  };
  return digit(d.slice(0, 9)) === d[9] && digit(d.slice(0, 10)) === d[10];
}

// ─── CNPJ ───────────────────────────────────────────────────────────────────
function cnpjCharValue(c: string): number {
  return /\d/.test(c) ? parseInt(c) : c.toUpperCase().charCodeAt(0) - 55;
}
function cnpjDigit(s: string, m: number[]): number {
  const sum = m.reduce((a, mult, i) => a + (i < s.length ? cnpjCharValue(s[i]) * mult : 0), 0);
  const r = sum % 11;
  return r < 2 ? 0 : 11 - r;
}
export function isValidCnpj(cnpj: string, allowLetters = false): boolean {
  const clean = allowLetters
    ? cnpj.replace(/[.\-\/]/g, '')
    : cnpj.replace(/\D/g, '');
  if (clean.length !== 14) return false;
  if (!allowLetters && /^(\d)\1{13}$/.test(clean)) return false;
  const d1 = cnpjDigit(clean.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2]);
  if (d1 !== cnpjCharValue(clean[12])) return false;
  const d2 = cnpjDigit(clean.slice(0, 13), [6,5,4,3,2,9,8,7,6,5,4,3,2]);
  return d2 === cnpjCharValue(clean[13]);
}

// ─── EMAIL ──────────────────────────────────────────────────────────────────
export const DEFAULT_ALLOWED_DOMAINS = ['rj.gov.br', 'gov.br', 'com', 'com.br'];

export function isValidEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function getEmailDomain(email: string): string {
  return email.includes('@') ? email.split('@')[1].toLowerCase() : '';
}
export function isAllowedDomain(domain: string, allowed: string[]): boolean {
  return allowed.some(a => domain === a || domain.endsWith(`.${a}`));
}

// ─── TELEFONE / CELULAR ─────────────────────────────────────────────────────
const VALID_DDDS = new Set([
  11,12,13,14,15,16,17,18,19,
  21,22,24,27,28,
  31,32,33,34,35,37,38,
  41,42,43,44,45,46,47,48,49,
  51,53,54,55,
  61,62,63,64,65,66,67,68,69,
  71,73,74,75,77,79,
  81,82,83,84,85,86,87,88,89,
  91,92,93,94,95,96,97,98,99,
]);
export function isValidDdd(digits: string): boolean {
  return VALID_DDDS.has(parseInt(digits.slice(0, 2)));
}
export function isValidPhone(digits: string): boolean {
  return digits.length === 10 || digits.length === 11;
}
export type PhoneType = 'celular' | 'fixo';
export function getPhoneType(digits: string): PhoneType | null {
  if (digits.length === 11) return 'celular';
  if (digits.length === 10) return 'fixo';
  return null;
}

// ─── CEP ────────────────────────────────────────────────────────────────────
export function isValidCep(digits: string): boolean {
  return digits.length === 8;
}

// ─── PASSWORD ───────────────────────────────────────────────────────────────
export interface PasswordStrength {
  score: number; // 0–4
  label: string;
  color: string;
}
export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8)          score++;
  if (/[A-Z]/.test(password))        score++;
  if (/[0-9]/.test(password))        score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels: PasswordStrength[] = [
    { score: 0, label: 'Muito fraca', color: '#dc3545' },
    { score: 1, label: 'Fraca',       color: '#dc3545' },
    { score: 2, label: 'Regular',     color: '#ffc107' },
    { score: 3, label: 'Forte',       color: '#198754' },
    { score: 4, label: 'Muito forte', color: '#198754' },
  ];
  return levels[score];
}

// ─── INPUT GENÉRICO ─────────────────────────────────────────────────────────
export interface InputRules {
  allowSpecial?: boolean;
  allowNumbers?: boolean;
  allowLetters?: boolean;
  required?:     boolean;
  minLength?:    number;
  label?:        string;
}
export function validateInputRules(value: string, rules: InputRules): string {
  const label = rules.label || 'Campo';
  if (rules.required && !value.trim()) return `${label} é obrigatório.`;
  if (value) {
    if (rules.allowSpecial === false && /[^\p{L}\p{N}\s]/u.test(value))
      return `${label} não permite caracteres especiais.`;
    if (rules.allowNumbers === false && /\d/.test(value))
      return `${label} não permite números.`;
    if (rules.allowLetters === false && /\p{L}/u.test(value))
      return `${label} não permite letras.`;
    if (rules.minLength && value.length < rules.minLength)
      return `${label} deve ter no mínimo ${rules.minLength} caracteres.`;
  }
  return '';
}
