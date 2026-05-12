import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import { isValidCpf } from '../utils/validators';
import { formatCpf, getCpfDigits } from '../utils/formatters';
import type { CpfFieldProps } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';

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
    const { theme } = useTheme();
    const fs = useMemo(() => makeFieldStyles(theme.colors), [theme]);

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
        <View style={fs.wrapper}>
            {label && (
                <Text style={fs.label}>
                    {label}
                    {required && <Text style={fs.required}> *</Text>}
                </Text>
            )}
            <TextInput
                style={[
                    fs.input,
                    focused && fs.inputFocused,
                    isInvalid && fs.inputInvalid,
                    isValid && fs.inputValid,
                    (disabled || readOnly) && fs.inputDisabled,
                ]}
                value={value}
                placeholder="000.000.000-00"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="numeric"
                maxLength={14}
                editable={!disabled && !readOnly}
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
            />
            {isInvalid && <Text style={fs.feedback}>{feedback}</Text>}
        </View>
    );
};

export default CpfField;
