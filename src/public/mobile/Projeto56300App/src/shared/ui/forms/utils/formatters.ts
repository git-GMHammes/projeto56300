// Máscaras brasileiras — porta fiel dos filed_*.js para TypeScript puro (sem DOM)

// ─── CPF: 000.000.000-00 ────────────────────────────────────────────────────
export function formatCpf(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
}
export function getCpfDigits(value: string): string {
  return value.replace(/\D/g, '');
}

// ─── CNPJ: 00.000.000/0000-00 ───────────────────────────────────────────────
export function formatCnpj(value: string, allowLetters = false): string {
  const raw = allowLetters
    ? value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 14)
    : value.replace(/\D/g, '').slice(0, 14);
  if (raw.length <=  2) return raw;
  if (raw.length <=  5) return `${raw.slice(0,2)}.${raw.slice(2)}`;
  if (raw.length <=  8) return `${raw.slice(0,2)}.${raw.slice(2,5)}.${raw.slice(5)}`;
  if (raw.length <= 12) return `${raw.slice(0,2)}.${raw.slice(2,5)}.${raw.slice(5,8)}/${raw.slice(8)}`;
  return `${raw.slice(0,2)}.${raw.slice(2,5)}.${raw.slice(5,8)}/${raw.slice(8,12)}-${raw.slice(12)}`;
}
export function getCnpjDigits(value: string): string {
  return value.replace(/\D/g, '');
}

// ─── CEP: 00.000-000 ────────────────────────────────────────────────────────
export function formatCep(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0,2)}.${d.slice(2)}`;
  return `${d.slice(0,2)}.${d.slice(2,5)}-${d.slice(5)}`;
}
export function getCepDigits(value: string): string {
  return value.replace(/\D/g, '');
}

// ─── TELEFONE: (XX) XXXXX-XXXX / (XX) XXXX-XXXX ────────────────────────────
export function formatPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0)  return '';
  if (d.length <= 2)   return `(${d}`;
  if (d.length <= 6)   return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 10)  return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}
export function getPhoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

// ─── DATA: DD/MM/YYYY ───────────────────────────────────────────────────────
export function formatDate(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0,2)}/${d.slice(2)}`;
  return `${d.slice(0,2)}/${d.slice(2,4)}/${d.slice(4)}`;
}
export function getDateDigits(value: string): string {
  return value.replace(/\D/g, '');
}
/** DD/MM/YYYY → YYYY-MM-DD */
export function dateDisplayToISO(value: string): string {
  const d = value.replace(/\D/g, '');
  if (d.length < 8) return '';
  return `${d.slice(4,8)}-${d.slice(2,4)}-${d.slice(0,2)}`;
}
/** YYYY-MM-DD → DD/MM/YYYY */
export function dateISOToDisplay(iso: string): string {
  if (!iso || iso.length < 10) return '';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}
