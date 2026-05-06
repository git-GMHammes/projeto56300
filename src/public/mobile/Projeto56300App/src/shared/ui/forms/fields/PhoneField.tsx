import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import { isValidPhone, isValidDdd } from '../utils/validators';
import { formatPhone, getPhoneDigits } from '../utils/formatters';
import type { PhoneFieldProps } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';

const PhoneField: React.FC<PhoneFieldProps> = ({
    name,
    label,
    value = '',
    readOnly = false,
    disabled = false,
    required = false,
    validateDdd = true,
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
        const digits = getPhoneDigits(val);
        const lbl = label || 'Telefone';
        let msg = '';
        if (required && !digits) {
            msg = `${lbl} é obrigatório.`;
        } else if (digits) {
            if (!isValidPhone(digits)) {
                msg = `${lbl} inválido (10 ou 11 dígitos).`;
            } else if (validateDdd && !isValidDdd(digits)) {
                msg = `DDD inválido (${digits.slice(0, 2)}).`;
            }
        }
        setFeedback(msg);
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [label, required, validateDdd, name, onValidationChange]);

    const handleChange = (text: string) => {
        const formatted = formatPhone(text);
        onChange?.(name, formatted);
        if (touched) validate(formatted);
    };

    const handleBlur = () => {
        setTouched(true);
        setFocused(false);
        validate(value);
        onBlur?.(name, value);
    };

    const digits = getPhoneDigits(value);
    const isInvalid = touched && !!feedback;
    const isValid = touched && !feedback && (digits.length === 10 || digits.length === 11);
    const isMobile = digits.length === 11;

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
                placeholder="(XX) XXXXX-XXXX"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="phone-pad"
                maxLength={16}
                editable={!disabled && !readOnly}
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
            />
            {isInvalid
                ? <Text style={fs.feedback}>{feedback}</Text>
                : isValid && (
                    <Text style={fs.feedbackSuccess}>
                        {isMobile ? 'Celular' : 'Fixo'} válido
                    </Text>
                )
            }
        </View>
    );
};

export default PhoneField;
