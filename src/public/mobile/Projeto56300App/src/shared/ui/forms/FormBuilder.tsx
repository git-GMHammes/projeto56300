/**
 * FormBuilder — renderiza um formulário completo a partir de um JSON de configuração.
 *
 * Uso:
 *   const fields: FieldConfig[] = [
 *     { type: 'input',  name: 'nome',  label: 'Nome',  required: true },
 *     { type: 'cpf',    name: 'cpf',   label: 'CPF',   required: true },
 *     { type: 'email',  name: 'email', label: 'Email', required: true },
 *   ];
 *
 *   <FormBuilder
 *     fields={fields}
 *     values={formValues}
 *     onChange={(name, val) => setFormValues(p => ({ ...p, [name]: val }))}
 *     onValidationChange={(name, valid, msg) => console.log(name, valid, msg)}
 *   />
 */
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import type { FieldConfig, FieldCallbacks } from './types';
import FormField from './FormField';

type FormValues = Record<string, string | string[]>;

interface FormBuilderProps {
  fields:              FieldConfig[];
  values?:             FormValues;
  onChange?:           (name: string, value: string | string[]) => void;
  onBlur?:             (name: string, value: string | string[]) => void;
  onValidationChange?: (name: string, valid: boolean, message: string) => void;
  /** Estilo adicional para o container */
  style?:              ViewStyle;
  /** Envolver em ScrollView — padrão true */
  scrollable?:         boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  values          = {},
  onChange,
  onBlur,
  onValidationChange,
  style,
  scrollable = true,
}) => {
  const callbacks: FieldCallbacks = {
    onChange,
    onBlur:             onBlur as FieldCallbacks['onBlur'],
    onValidationChange,
  };

  const resolveValue = (name: string): string | string[] => values[name] ?? '';

  const buildConfig = useCallback((field: FieldConfig): FieldConfig => {
    const val = resolveValue(field.name);

    // Para checkbox o valor é string[]
    if (field.type === 'checkbox') {
      return {
        ...field,
        value: Array.isArray(val) ? val : [],
        onChange:            callbacks.onChange as (name: string, value: string[]) => void,
        onValidationChange:  callbacks.onValidationChange,
      } as FieldConfig;
    }

    return {
      ...field,
      value:               Array.isArray(val) ? val[0] : val,
      onChange:            callbacks.onChange as (name: string, value: string) => void,
      onBlur:              callbacks.onBlur,
      onValidationChange:  callbacks.onValidationChange,
    } as FieldConfig;
  }, [values, callbacks]);

  const content = (
    <ScrollView
      style={[styles.scroll, scrollable ? {} : styles.noScroll, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {fields.map(field => (
        <FormField
          key={field.name}
          config={buildConfig(field)}
        />
      ))}
    </ScrollView>
  );

  return content;
};

const styles = StyleSheet.create({
  scroll:   { flex: 1 },
  noScroll: { flex: 0 },
  content:  { flexGrow: 1, paddingBottom: 16 },
});

export default FormBuilder;
