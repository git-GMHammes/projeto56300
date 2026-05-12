import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import {
    isValidEmailFormat,
    getEmailDomain,
    isAllowedDomain,
    DEFAULT_ALLOWED_DOMAINS,
} from '../utils/validators';
import type { EmailFieldProps } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';

const EmailField: React.FC<EmailFieldProps> = ({
    name,
    label,
    value = '',
    placeholder = 'usuario@dominio.com.br',
    readOnly = false,
    disabled = false,
    required = false,
    allowedDomains = DEFAULT_ALLOWED_DOMAINS,
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
        const lbl = label || 'E-mail';
        let msg = '';
        if (required && !val.trim()) {
            msg = `${lbl} é obrigatório.`;
        } else if (val) {
            if (!isValidEmailFormat(val)) {
                msg = `${lbl} inválido.`;
            } else {
                const domain = getEmailDomain(val);
                if (allowedDomains && allowedDomains.length > 0 && !isAllowedDomain(domain, allowedDomains)) {
                    msg = `Domínio "@${domain}" não é permitido.`;
                }
            }
        }
        setFeedback(msg);
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [label, required, allowedDomains, name, onValidationChange]);

    const handleChange = (text: string) => {
        onChange?.(name, text.toLowerCase().trim());
        if (touched) validate(text);
    };

    const handleBlur = () => {
        setTouched(true);
        setFocused(false);
        validate(value);
        onBlur?.(name, value);
    };

    const isInvalid = touched && !!feedback;
    const isValid = touched && !feedback && value.length > 0;

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
                placeholder={placeholder}
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!disabled && !readOnly}
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
            />
            {isInvalid && <Text style={fs.feedback}>{feedback}</Text>}
        </View>
    );
};

export default EmailField;
