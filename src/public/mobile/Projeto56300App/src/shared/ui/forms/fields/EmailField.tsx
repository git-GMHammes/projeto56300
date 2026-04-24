import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import {
    isValidEmailFormat,
    getEmailDomain,
    isAllowedDomain,
    DEFAULT_ALLOWED_DOMAINS,
} from '../utils/validators';
import Bootstrap from '../../../theme/bootstrap';
import type { EmailFieldProps } from '../types';

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
                placeholder={placeholder}
                placeholderTextColor="#6c757d"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
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

export default EmailField;
