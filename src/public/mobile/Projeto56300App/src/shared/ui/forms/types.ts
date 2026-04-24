// Contratos TypeScript de todos os campos de formulário
// Baseado nos filed_*.js (CakePHP/web) convertidos para React Native

// ─── Callback padrão de todos os campos ────────────────────────────────────
export interface FieldCallbacks {
  onChange?:          (name: string, value: string)                          => void;
  onBlur?:            (name: string, value: string)                          => void;
  onValidationChange?:(name: string, isValid: boolean, message: string)      => void;
}

// ─── Base compartilhada ────────────────────────────────────────────────────
interface BaseField extends FieldCallbacks {
  name:         string;
  label?:       string;
  value?:       string;
  placeholder?: string;
  readOnly?:    boolean;
  disabled?:    boolean;
  required?:    boolean;
}

// ─── Input (texto genérico) ─────────────────────────────────────────────────
export interface InputFieldProps extends BaseField {
  maxLength?:    number;
  minLength?:    number;
  allowSpecial?: boolean;   // default true
  allowNumbers?: boolean;   // default true
  allowLetters?: boolean;   // default true
  suggestions?:  string[];  // datalist equivalente
}

// ─── Textarea ───────────────────────────────────────────────────────────────
export interface TextareaFieldProps extends BaseField {
  rows?:         number;    // default 4
  maxLength?:    number;    // default 500
  minLength?:    number;    // default 10
  allowSpecial?: boolean;
  allowNumbers?: boolean;
  allowLetters?: boolean;
  showCounter?:  boolean;   // default true
}

// ─── Email ──────────────────────────────────────────────────────────────────
export interface EmailFieldProps extends BaseField {
  allowedDomains?: string[]; // ex: ['rj.gov.br','gov.br','com','com.br']
}

// ─── Password ───────────────────────────────────────────────────────────────
export interface PasswordFieldProps extends BaseField {
  strongPassword?: boolean; // exige maiúsc + núm + especial
  minLength?:      number;  // default 6
  maxLength?:      number;  // default 32
  allowSpecial?:   boolean;
  allowNumbers?:   boolean;
  allowLetters?:   boolean;
  doubleField?:    boolean; // campo de confirmação
  confirmValue?:   string;
  onConfirmChange?:(name: string, value: string) => void;
}

// ─── CPF ────────────────────────────────────────────────────────────────────
export interface CpfFieldProps extends BaseField {}

// ─── CNPJ ───────────────────────────────────────────────────────────────────
export interface CnpjFieldProps extends BaseField {
  allowLetters?: boolean; // novo CNPJ alfanumérico (vigor jul/2026)
}

// ─── CEP ────────────────────────────────────────────────────────────────────
export interface CepAddress {
  cep:         string;
  uf:          string;
  cidade:      string;
  bairro:      string;
  endereco:    string;
  complemento: string;
  codigoIBGE?: string;
}
export interface CepFieldProps extends BaseField {
  apiUrl?:        string;                          // default: ViaCEP
  onAddressFound?:(address: CepAddress) => void;
}

// ─── Phone / Celular ────────────────────────────────────────────────────────
export interface PhoneFieldProps extends BaseField {
  validateDdd?: boolean; // default true
}

// ─── Select (combobox com busca) ────────────────────────────────────────────
export interface SelectOption {
  value: string;
  label: string;
  [key: string]: unknown;
}
export interface SelectFieldProps extends BaseField {
  options?:       SelectOption[];  // lista inline
  src?:           string;          // URL para buscar JSON
  valueKey?:      string;          // default 'id'
  labelKey?:      string;          // default 'nome'
  labelTemplate?: string;          // ex: '{nome} - {codigo}'
  maxVisible?:    number;          // default 150
  rows?:          number;          // linhas visíveis default 8
  onSelectChange?:(name: string, value: string, item: SelectOption) => void;
}

// ─── Checkbox ───────────────────────────────────────────────────────────────
export interface CheckboxOption {
  id?:       string;
  value:     string;
  label:     string;
  checked?:  boolean;
  disabled?: boolean;
}
export interface CheckboxFieldProps {
  name:        string;
  label?:      string;   // alias de legend
  legend?:     string;
  value?:      string[];
  options?:    CheckboxOption[];
  inline?:     boolean;
  readOnly?:   boolean;
  disabled?:   boolean;
  required?:   boolean;
  onChange?:          (name: string, values: string[])               => void;
  onValidationChange?:(name: string, isValid: boolean, msg: string)  => void;
}

// ─── Radio ──────────────────────────────────────────────────────────────────
export interface RadioOption {
  id?:       string;
  value:     string;
  label:     string;
  disabled?: boolean;
}
export interface RadioFieldProps {
  name:      string;
  label?:    string;   // alias de legend
  legend?:   string;
  options?:  RadioOption[];
  value?:    string;
  inline?:   boolean;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  onChange?:          (name: string, value: string)                   => void;
  onValidationChange?:(name: string, isValid: boolean, msg: string)   => void;
}

// ─── Date ───────────────────────────────────────────────────────────────────
export interface DateFieldProps extends BaseField {
  minDate?:     string; // ISO YYYY-MM-DD
  maxDate?:     string;
  doubleField?: boolean;
  name2?:       string;
  label2?:      string;
  value2?:      string;
  onChange2?:   (name: string, value: string) => void;
}

// ─── Union para FormField / FormBuilder ─────────────────────────────────────
export type FieldType =
  | 'input' | 'textarea' | 'email' | 'password'
  | 'cpf'   | 'cnpj'     | 'cep'   | 'phone'
  | 'select'| 'checkbox' | 'radio' | 'date';

export type FieldConfig =
  | ({ type: 'input'    } & InputFieldProps)
  | ({ type: 'textarea' } & TextareaFieldProps)
  | ({ type: 'email'    } & EmailFieldProps)
  | ({ type: 'password' } & PasswordFieldProps)
  | ({ type: 'cpf'      } & CpfFieldProps)
  | ({ type: 'cnpj'     } & CnpjFieldProps)
  | ({ type: 'cep'      } & CepFieldProps)
  | ({ type: 'phone'    } & PhoneFieldProps)
  | ({ type: 'select'   } & SelectFieldProps)
  | ({ type: 'checkbox' } & CheckboxFieldProps)
  | ({ type: 'radio'    } & RadioFieldProps)
  | ({ type: 'date'     } & DateFieldProps);

export interface FormBuilderConfig {
  fields:     FieldConfig[];
  values?:    Record<string, string>;
  callbacks?: FieldCallbacks;
}
