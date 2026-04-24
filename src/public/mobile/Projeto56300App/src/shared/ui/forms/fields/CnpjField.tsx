import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import { isValidCnpj } from '../utils/validators';
import { formatCnpj, getCnpjDigits } from '../utils/formatters';
import Bootstrap from '../../../theme/bootstrap';
import type { CnpjFieldProps } from '../types';

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
                placeholder={allowLetters ? 'AA.AAA.AAA/AAAA-00' : '00.000.000/0000-00'}
                placeholderTextColor="#6c757d"
                keyboardType={allowLetters ? 'default' : 'numeric'}
                maxLength={18}
                editable={!disabled && !readOnly}
                autoCapitalize="characters"
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

export default CnpjField;
