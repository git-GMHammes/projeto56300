import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import { isValidCpf } from '../utils/validators';
import { formatCpf, getCpfDigits } from '../utils/formatters';
import Bootstrap from '../../../theme/bootstrap';
import type { CpfFieldProps } from '../types';

const CpfField: React.FC<CpfFieldProps> = ({
    name,
    label,
    value = '',
    readOnly = false,
    disabled = false,
    required = false,
    onChange,
    onBlur,
    onValidationChange,
}) => {
    const [touched, setTouched] = useState(false);
    const [focused, setFocused] = useState(false);
    const [feedback, setFeedback] = useState('');

    const validate = useCallback((val: string): string => {
        const digits = getCpfDigits(val);
        const lbl = label || 'CPF';
        let msg = '';
        if (required && !digits) {
            msg = `${lbl} é obrigatório.`;
        } else if (digits && !isValidCpf(digits)) {
            msg = `${lbl} inválido.`;
        }
        setFeedback(msg);
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [label, required, name, onValidationChange]);

    const handleChange = (text: string) => {
        const formatted = formatCpf(text);
        onChange?.(name, formatted);
        if (touched) validate(formatted);
    };

    const handleBlur = () => {
        setTouched(true);
        setFocused(false);
        validate(value);
        onBlur?.(name, value);
    };

    const isInvalid = touched && !!feedback;
    const isValid = touched && !feedback && getCpfDigits(value).length === 11;

    return (
        <View style={fieldStyles.wrapper}>
            {label && (
                <Text style={fieldStyles.label}>
                    {label}
                    {required && <Text style={fieldStyles.required}> *</Text>}
                </Text>
            )}
            <TextInput
                style={[
                    fieldStyles.input,
                    focused && styles.focused,
                    isInvalid && fieldStyles.inputInvalid,
                    isValid && fieldStyles.inputValid,
                    (disabled || readOnly) && fieldStyles.inputDisabled,
                ]}
                value={value}
                placeholder="000.000.000-00"
                placeholderTextColor="#6c757d"
                keyboardType="numeric"
                maxLength={14}
                editable={!disabled && !readOnly}
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
            />
            {isInvalid && <Text style={fieldStyles.feedback}>{feedback}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    focused: { borderColor: Bootstrap.colors.inputBorderFocus },
});

export default CpfField;
