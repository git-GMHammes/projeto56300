import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import { validateInputRules } from '../utils/validators';
import type { InputFieldProps } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';

const InputField: React.FC<InputFieldProps> = ({
    name,
    label,
    value = '',
    placeholder,
    maxLength,
    minLength,
    readOnly = false,
    disabled = false,
    required = false,
    allowSpecial = true,
    allowNumbers = true,
    allowLetters = true,
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
                maxLength={maxLength}
                editable={!disabled && !readOnly}
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {isInvalid && <Text style={fs.feedback}>{feedback}</Text>}
        </View>
    );
};

export default InputField;
