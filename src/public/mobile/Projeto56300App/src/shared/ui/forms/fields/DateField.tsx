import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import { formatDate, getDateDigits, dateDisplayToISO } from '../utils/formatters';
import Bootstrap from '../../../theme/bootstrap';
import type { DateFieldProps } from '../types';

function isValidDateDisplay(val: string): boolean {
    const d = getDateDigits(val);
    if (d.length !== 8) return false;
    const day = parseInt(d.slice(0, 2), 10);
    const month = parseInt(d.slice(2, 4), 10);
    const year = parseInt(d.slice(4, 8), 10);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

const DateField: React.FC<DateFieldProps> = ({
    name,
    label,
    value = '',
    readOnly = false,
    disabled = false,
    required = false,
    minDate,
    maxDate,
    onChange,
    onBlur,
    onValidationChange,
}) => {
    const [touched, setTouched] = useState(false);
    const [focused, setFocused] = useState(false);
    const [feedback, setFeedback] = useState('');

    const validate = useCallback((val: string): string => {
        const lbl = label || 'Data';
        let msg = '';
        const digits = getDateDigits(val);
        if (required && !digits) {
            msg = `${lbl} é obrigatória.`;
        } else if (digits && digits.length > 0) {
            if (!isValidDateDisplay(val)) {
                msg = `${lbl} inválida.`;
            } else {
                const iso = dateDisplayToISO(val);
                if (minDate && iso < minDate) msg = `${lbl} deve ser após ${minDate}.`;
                else if (maxDate && iso > maxDate) msg = `${lbl} deve ser antes de ${maxDate}.`;
            }
        }
        setFeedback(msg);
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [label, required, minDate, maxDate, name, onValidationChange]);

    const handleChange = (text: string) => {
        const formatted = formatDate(text);
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
    const isValid = touched && !feedback && getDateDigits(value).length === 8;

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
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#6c757d"
                keyboardType="numeric"
                maxLength={10}
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

export default DateField;
