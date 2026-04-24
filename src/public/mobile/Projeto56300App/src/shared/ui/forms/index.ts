// ─────────────────────────────────────────────────────────────────
// Biblioteca global de campos de formulário — React Native + TypeScript
// Importar em qualquer feature:
//   import { FormBuilder, InputField, CpfField, ... } from '@shared/ui/forms';
// ─────────────────────────────────────────────────────────────────

// Componentes de campo individuais
export { default as InputField    } from './fields/InputField';
export { default as TextareaField } from './fields/TextareaField';
export { default as EmailField    } from './fields/EmailField';
export { default as PasswordField } from './fields/PasswordField';
export { default as CpfField      } from './fields/CpfField';
export { default as CnpjField     } from './fields/CnpjField';
export { default as CepField      } from './fields/CepField';
export { default as PhoneField    } from './fields/PhoneField';
export { default as SelectField   } from './fields/SelectField';
export { default as CheckboxField } from './fields/CheckboxField';
export { default as RadioField    } from './fields/RadioField';
export { default as DateField     } from './fields/DateField';

// Orquestradores
export { default as FormField   } from './FormField';
export { default as FormBuilder } from './FormBuilder';

// Tipos TypeScript
export type {
  FieldCallbacks,
  InputFieldProps,
  TextareaFieldProps,
  EmailFieldProps,
  PasswordFieldProps,
  CpfFieldProps,
  CnpjFieldProps,
  CepFieldProps,
  CepAddress,
  PhoneFieldProps,
  SelectOption,
  SelectFieldProps,
  CheckboxOption,
  CheckboxFieldProps,
  RadioOption,
  RadioFieldProps,
  DateFieldProps,
  FieldType,
  FieldConfig,
  FormBuilderConfig,
} from './types';

// Utilitários (opcionais — para uso direto)
export * from './utils/validators';
export * from './utils/formatters';
