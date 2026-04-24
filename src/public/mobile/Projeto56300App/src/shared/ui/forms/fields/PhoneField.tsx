import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import { isValidPhone, isValidDdd } from '../utils/validators';
import { formatPhone, getPhoneDigits } from '../utils/formatters';
import Bootstrap from '../../../theme/bootstrap';
import type { PhoneFieldProps } from '../types';

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
                placeholder="(XX) XXXXX-XXXX"
                placeholderTextColor="#6c757d"
                keyboardType="phone-pad"
                maxLength={16}
                editable={!disabled && !readOnly}
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
            />
            {isInvalid
                ? <Text style={fieldStyles.feedback}>{feedback}</Text>
                : isValid && (
                    <Text style={fieldStyles.feedbackSuccess}>
                        {isMobile ? 'Celular' : 'Fixo'} válido
                    </Text>
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    focused: { borderColor: Bootstrap.colors.inputBorderFocus },
});

export default PhoneField;
