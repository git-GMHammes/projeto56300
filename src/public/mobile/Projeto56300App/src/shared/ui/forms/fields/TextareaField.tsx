import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import { validateInputRules } from '../utils/validators';
import Bootstrap from '../../../theme/bootstrap';
import type { TextareaFieldProps } from '../types';

const TextareaField: React.FC<TextareaFieldProps> = ({
    name,
    label,
    value = '',
    placeholder,
    maxLength = 500,
    minLength = 0,
    rows = 4,
    readOnly = false,
    disabled = false,
    required = false,
    allowSpecial = true,
    allowNumbers = true,
    allowLetters = true,
    showCounter = true,
    onChange,
    onBlur,
    onValidationChange,
}) => {
    const [touched, setTouched] = useState(false);
    const [focused, setFocused] = useState(false);
    const [feedback, setFeedback] = useState('');

    const validate = useCallback((val: string): string => {
        const msg = validateInputRules(val, {
            allowSpecial, allowNumbers, allowLetters, required, minLength, label,
        });
        setFeedback(msg);
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [allowSpecial, allowNumbers, allowLetters, required, minLength, label, name, onValidationChange]);

    const handleChange = (text: string) => {
        onChange?.(name, text);
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
    const charCount = value.length;
    const nearLimit = !!maxLength && charCount > maxLength * 0.85;

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
                    styles.textarea,
                    focused && styles.focused,
                    isInvalid && fieldStyles.inputInvalid,
                    isValid && fieldStyles.inputValid,
                    (disabled || readOnly) && fieldStyles.inputDisabled,
                    { height: rows * 22 + 16 },
                ]}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#6c757d"
                maxLength={maxLength}
                editable={!disabled && !readOnly}
                multiline
                numberOfLines={rows}
                textAlignVertical="top"
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
            />
            <View style={styles.footer}>
                {isInvalid
                    ? <Text style={fieldStyles.feedback}>{feedback}</Text>
                    : <Text />
                }
                {showCounter && (
                    <Text style={[styles.counter, nearLimit ? styles.counterNear : undefined]}>
                        {charCount}/{maxLength}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textarea: {
        borderWidth: 1,
        borderColor: Bootstrap.colors.inputBorder,
        borderRadius: Bootstrap.borderRadius.sm,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: Bootstrap.fontSize.base,
        color: Bootstrap.colors.body,
        backgroundColor: Bootstrap.colors.inputBg,
    },
    focused: { borderColor: Bootstrap.colors.inputBorderFocus },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 2,
    },
    counter: {
        fontSize: Bootstrap.fontSize.sm,
        color: Bootstrap.colors.muted,
        fontStyle: 'italic',
    },
    counterNear: {
        color: Bootstrap.colors.danger,
    },
});

export default TextareaField;
