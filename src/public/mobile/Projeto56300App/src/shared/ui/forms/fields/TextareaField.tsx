import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import { validateInputRules } from '../utils/validators';
import Bootstrap from '../../../theme/bootstrap';
import type { TextareaFieldProps } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';
import type { AppColors } from '../../../theme/global/types';

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
    const { theme } = useTheme();
    const fs = useMemo(() => makeFieldStyles(theme.colors), [theme]);
    const ls = useMemo(() => makeLocalStyles(theme.colors), [theme]);

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
        <View style={fs.wrapper}>
            {label && (
                <Text style={fs.label}>
                    {label}
                    {required && <Text style={fs.required}> *</Text>}
                </Text>
            )}
            <TextInput
                style={[
                    ls.textarea,
                    focused && fs.inputFocused,
                    isInvalid && fs.inputInvalid,
                    isValid && fs.inputValid,
                    (disabled || readOnly) && fs.inputDisabled,
                    { height: rows * 22 + 16 },
                ]}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.placeholder}
                maxLength={maxLength}
                editable={!disabled && !readOnly}
                multiline
                numberOfLines={rows}
                textAlignVertical="top"
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
            />
            <View style={staticStyles.footer}>
                {isInvalid
                    ? <Text style={fs.feedback}>{feedback}</Text>
                    : <Text />
                }
                {showCounter && (
                    <Text style={[ls.counter, nearLimit && ls.counterNear]}>
                        {charCount}/{maxLength}
                    </Text>
                )}
            </View>
        </View>
    );
};

const staticStyles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 2,
    },
});

function makeLocalStyles(c: AppColors) {
    return StyleSheet.create({
        textarea: {
            borderWidth: 1,
            borderColor: c.inputBorder,
            borderRadius: Bootstrap.borderRadius.sm,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: Bootstrap.fontSize.base,
            color: c.inputText,
            backgroundColor: c.inputBg,
        },
        counter: {
            fontSize: Bootstrap.fontSize.sm,
            color: c.textMuted,
            fontStyle: 'italic' as const,
        },
        counterNear: {
            color: c.danger,
        },
    });
}

export default TextareaField;
