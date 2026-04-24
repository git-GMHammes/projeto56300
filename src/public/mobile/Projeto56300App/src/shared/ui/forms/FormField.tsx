/**
 * FormField — dispatcher dinâmico baseado em FieldConfig (union discriminada).
 * Recebe um objeto FieldConfig e renderiza o componente correto.
 *
 * Uso:
 *   <FormField config={{ type: 'cpf', name: 'cpf', label: 'CPF', value: state.cpf, onChange: ... }} />
 */
import React from 'react';
import type { FieldConfig } from './types';

import InputField    from './fields/InputField';
import TextareaField from './fields/TextareaField';
import EmailField    from './fields/EmailField';
import PasswordField from './fields/PasswordField';
import CpfField      from './fields/CpfField';
import CnpjField     from './fields/CnpjField';
import CepField      from './fields/CepField';
import PhoneField    from './fields/PhoneField';
import SelectField   from './fields/SelectField';
import CheckboxField from './fields/CheckboxField';
import RadioField    from './fields/RadioField';
import DateField     from './fields/DateField';

interface FormFieldProps {
  config: FieldConfig;
}

const FormField: React.FC<FormFieldProps> = ({ config }) => {
  switch (config.type) {
    case 'input':
      return <InputField    {...config} />;
    case 'textarea':
      return <TextareaField {...config} />;
    case 'email':
      return <EmailField    {...config} />;
    case 'password':
      return <PasswordField {...config} />;
    case 'cpf':
      return <CpfField      {...config} />;
    case 'cnpj':
      return <CnpjField     {...config} />;
    case 'cep':
      return <CepField      {...config} />;
    case 'phone':
      return <PhoneField    {...config} />;
    case 'select':
      return <SelectField   {...config} />;
    case 'checkbox':
      return <CheckboxField {...config} />;
    case 'radio':
      return <RadioField    {...config} />;
    case 'date':
      return <DateField     {...config} />;
    default:
      return null;
  }
};

export default FormField;
