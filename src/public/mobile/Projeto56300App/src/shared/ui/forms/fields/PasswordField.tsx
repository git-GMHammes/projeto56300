import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import { checkPasswordStrength } from '../utils/validators';
import Bootstrap from '../../../theme/bootstrap';
import type { PasswordFieldProps } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';
import type { AppColors } from '../../../theme/global/types';

const EyeIcon = ({ visible }: { visible: boolean }) => (
    <Text style={staticStyles.eyeIcon}>{visible ? '🙈' : '👁️'}</Text>
);

const PasswordField: React.FC<PasswordFieldProps> = ({
    name,
    label,
    value = '',
    placeholder = '••••••••',
    readOnly = false,
    disabled = false,
    required = false,
    strongPassword = false,
    minLength = 6,
    maxLength = 32,
    allowSpecial = true,
    allowNumbers = true,
    allowLetters = true,
    doubleField = false,
    confirmValue = '',
    onChange,
    onConfirmChange,
    onBlur,
    onValidationChange,
}) => {
    const { theme } = useTheme();
    const fs = useMemo(() => makeFieldStyles(theme.colors), [theme]);
    const ls = useMemo(() => makeLocalStyles(theme.colors), [theme]);

    const [touched, setTouched] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);
    const [focused, setFocused] = useState(false);
    const [secure, setSecure] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [confirmFeedback, setConfirmFeedback] = useState('');

    const validatePassword = useCallback((val: string): string => {
        const lbl = label || 'Senha';
        if (required && !val) return `${lbl} é obrigatória.`;
        if (!val) return '';
        if (val.length < minLength) return `${lbl} deve ter no mínimo ${minLength} caracteres.`;
        if (val.length > maxLength) return `${lbl} deve ter no máximo ${maxLength} caracteres.`;
        if (allowSpecial === false && /[^A-Za-z0-9]/.test(val)) return `${lbl} não permite caracteres especiais.`;
        if (allowNumbers === false && /\d/.test(val)) return `${lbl} não permite números.`;
        if (allowLetters === false && /[A-Za-z]/.test(val)) return `${lbl} não permite letras.`;
        if (strongPassword) {
            if (!/[A-Z]/.test(val)) return `${lbl} deve conter ao menos uma letra maiúscula.`;
            if (!/[0-9]/.test(val)) return `${lbl} deve conter ao menos um número.`;
            if (!/[^A-Za-z0-9]/.test(val)) return `${lbl} deve conter ao menos um caractere especial.`;
        }
        return '';
    }, [label, required, minLength, maxLength, allowSpecial, allowNumbers, allowLetters, strongPassword]);

    const validate = useCallback((val: string): string => {
        const msg = validatePassword(val);
        setFeedback(msg);
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [validatePassword, name, onValidationChange]);

    const validateConfirm = useCallback((confirm: string, pass: string): string => {
        if (!confirm) return '';
        const msg = confirm !== pass ? 'As senhas não coincidem.' : '';
        setConfirmFeedback(msg);
        return msg;
    }, []);

    const handleChange = (text: string) => {
        onChange?.(name, text);
        if (touched) validate(text);
        if (confirmTouched) validateConfirm(confirmValue, text);
    };

    const handleConfirmChange = (text: string) => {
        onConfirmChange?.(name + '_confirm', text);
        if (confirmTouched) validateConfirm(text, value);
    };

    const strength = value ? checkPasswordStrength(value) : null;

    const isInvalid = touched && !!feedback;
    const isValid = touched && !feedback && value.length > 0;
    const isConfirmInvalid = confirmTouched && !!confirmFeedback;
    const isConfirmValid = confirmTouched && !confirmFeedback && confirmValue.length > 0;

    return (
        <View style={fs.wrapper}>
            {label && (
                <Text style={fs.label}>
                    {label}
                    {required && <Text style={fs.required}> *</Text>}
                </Text>
            )}
            <View style={staticStyles.inputRow}>
                <TextInput
                    style={[
                        ls.inputWithEye,
                        focused && fs.inputFocused,
                        isInvalid && fs.inputInvalid,
                        isValid && fs.inputValid,
                        (disabled || readOnly) && fs.inputDisabled,
                    ]}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.placeholder}
                    secureTextEntry={secure}
                    maxLength={maxLength}
                    editable={!disabled && !readOnly}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={handleChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                        setTouched(true);
                        setFocused(false);
                        validate(value);
                        onBlur?.(name, value);
                    }}
                />
                <TouchableOpacity onPress={() => setSecure(p => !p)} style={staticStyles.eyeBtn}>
                    <EyeIcon visible={!secure} />
                </TouchableOpacity>
            </View>

            {isInvalid && <Text style={fs.feedback}>{feedback}</Text>}

            {strongPassword && value.length > 0 && strength && (
                <View style={staticStyles.strengthRow}>
                    <View style={staticStyles.strengthBar}>
                        {[0, 1, 2, 3].map(i => (
                            <View
                                key={i}
                                style={[
                                    staticStyles.strengthSegment,
                                    { backgroundColor: i < strength.score ? strength.color : theme.colors.border },
                                ]}
                            />
                        ))}
                    </View>
                    <Text style={[staticStyles.strengthLabel, { color: strength.color }]}>
                        {strength.label}
                    </Text>
                </View>
            )}

            {doubleField && (
                <>
                    <Text style={[fs.label, staticStyles.confirmLabel]}>
                        Confirmar {label || 'senha'}
                        {required && <Text style={fs.required}> *</Text>}
                    </Text>
                    <View style={staticStyles.inputRow}>
                        <TextInput
                            style={[
                                ls.inputWithEye,
                                isConfirmInvalid && fs.inputInvalid,
                                isConfirmValid && fs.inputValid,
                            ]}
                            value={confirmValue}
                            placeholder={placeholder}
                            placeholderTextColor={theme.colors.placeholder}
                            secureTextEntry={secureConfirm}
                            maxLength={maxLength}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={handleConfirmChange}
                            onBlur={() => {
                                setConfirmTouched(true);
                                validateConfirm(confirmValue, value);
                            }}
                        />
                        <TouchableOpacity onPress={() => setSecureConfirm(p => !p)} style={staticStyles.eyeBtn}>
                            <EyeIcon visible={!secureConfirm} />
                        </TouchableOpacity>
                    </View>
                    {isConfirmInvalid && (
                        <Text style={fs.feedback}>{confirmFeedback}</Text>
                    )}
                </>
            )}
        </View>
    );
};

const staticStyles = StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeBtn: {
        position: 'absolute',
        right: 8,
        padding: 6,
    },
    eyeIcon: {
        fontSize: 18,
    },
    strengthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 8,
    },
    strengthBar: {
        flex: 1,
        flexDirection: 'row',
        gap: 3,
        height: 6,
    },
    strengthSegment: {
        flex: 1,
        borderRadius: 3,
    },
    strengthLabel: {
        fontSize: Bootstrap.fontSize.sm,
        fontStyle: 'italic',
        minWidth: 70,
    },
    confirmLabel: {
        marginTop: Bootstrap.spacing.md,
    },
});

function makeLocalStyles(c: AppColors) {
    return StyleSheet.create({
        inputWithEye: {
            flex: 1,
            height: Bootstrap.inputHeight,
            borderWidth: 1,
            borderColor: c.inputBorder,
            borderRadius: Bootstrap.borderRadius.sm,
            paddingHorizontal: 12,
            paddingVertical: 6,
            fontSize: Bootstrap.fontSize.base,
            color: c.inputText,
            backgroundColor: c.inputBg,
            paddingRight: 44,
        },
    });
}

export default PasswordField;
