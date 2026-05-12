import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import { isValidCnpj } from '../utils/validators';
import { formatCnpj, getCnpjDigits } from '../utils/formatters';
import type { CnpjFieldProps } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';

const CnpjField: React.FC<CnpjFieldProps> = ({
    name,
    label,
    value = '',
    readOnly = false,
    disabled = false,
    required = false,
    allowLetters = false,
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
        const raw = allowLetters
            ? val.replace(/[^A-Za-z0-9]/g, '')
            : getCnpjDigits(val);
        const lbl = label || 'CNPJ';
        let msg = '';
        if (required && !raw) {
            msg = `${lbl} é obrigatório.`;
        } else if (raw && !isValidCnpj(raw, allowLetters)) {
            msg = `${lbl} inválido.`;
        }
        setFeedback(msg);
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [label, required, allowLetters, name, onValidationChange]);

    const handleChange = (text: string) => {
        const formatted = formatCnpj(text, allowLetters);
        onChange?.(name, formatted);
        if (touched) validate(formatted);
    };

    const handleBlur = () => {
        setTouched(true);
        setFocused(false);
        validate(value);
        onBlur?.(name, value);
    };

    const rawLen = allowLetters
        ? value.replace(/[^A-Za-z0-9]/g, '').length
        : getCnpjDigits(value).length;
    const isInvalid = touched && !!feedback;
    const isValid = touched && !feedback && rawLen === 14;

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
                placeholder={allowLetters ? 'AA.AAA.AAA/AAAA-00' : '00.000.000/0000-00'}
                placeholderTextColor={theme.colors.placeholder}
                keyboardType={allowLetters ? 'default' : 'numeric'}
                maxLength={18}
                editable={!disabled && !readOnly}
                autoCapitalize="characters"
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
            />
            {isInvalid && <Text style={fs.feedback}>{feedback}</Text>}
        </View>
    );
};

export default CnpjField;
