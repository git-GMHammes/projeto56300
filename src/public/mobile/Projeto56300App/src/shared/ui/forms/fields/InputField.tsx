import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import { validateInputRules } from '../utils/validators';
import type { InputFieldProps } from '../types';

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
                maxLength={maxLength}
                editable={!disabled && !readOnly}
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {isInvalid && <Text style={fieldStyles.feedback}>{feedback}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    focused: { borderColor: '#86b7fe' },
});

export default InputField;
