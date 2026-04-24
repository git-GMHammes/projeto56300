import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import { checkPasswordStrength } from '../utils/validators';
import Bootstrap from '../../../theme/bootstrap';
import type { PasswordFieldProps } from '../types';

const EyeIcon = ({ visible }: { visible: boolean }) => (
    <Text style={styles.eyeIcon}>{visible ? '🙈' : '👁️'}</Text>
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
        <View style={fieldStyles.wrapper}>
            {label && (
                <Text style={fieldStyles.label}>
                    {label}
                    {required && <Text style={fieldStyles.required}> *</Text>}
                </Text>
            )}
            <View style={styles.inputRow}>
                <TextInput
                    style={[
                        styles.inputWithEye,
                        focused && styles.focused,
                        isInvalid && fieldStyles.inputInvalid,
                        isValid && fieldStyles.inputValid,
                        (disabled || readOnly) && fieldStyles.inputDisabled,
                    ]}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#6c757d"
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
                <TouchableOpacity onPress={() => setSecure(p => !p)} style={styles.eyeBtn}>
                    <EyeIcon visible={!secure} />
                </TouchableOpacity>
            </View>

            {isInvalid && <Text style={fieldStyles.feedback}>{feedback}</Text>}

            {/* Barra de força da senha */}
            {strongPassword && value.length > 0 && strength && (
                <View style={styles.strengthRow}>
                    <View style={styles.strengthBar}>
                        {[0, 1, 2, 3].map(i => (
                            <View
                                key={i}
                                style={[
                                    styles.strengthSegment,
                                    { backgroundColor: i < strength.score ? strength.color : '#dee2e6' },
                                ]}
                            />
                        ))}
                    </View>
                    <Text style={[styles.strengthLabel, { color: strength.color }]}>
                        {strength.label}
                    </Text>
                </View>
            )}

            {/* Campo de confirmação */}
            {doubleField && (
                <>
                    <Text style={[fieldStyles.label, styles.confirmLabel]}>
                        Confirmar {label || 'senha'}
                        {required && <Text style={fieldStyles.required}> *</Text>}
                    </Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={[
                                styles.inputWithEye,
                                isConfirmInvalid && fieldStyles.inputInvalid,
                                isConfirmValid && fieldStyles.inputValid,
                            ]}
                            value={confirmValue}
                            placeholder={placeholder}
                            placeholderTextColor="#6c757d"
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
                        <TouchableOpacity onPress={() => setSecureConfirm(p => !p)} style={styles.eyeBtn}>
                            <EyeIcon visible={!secureConfirm} />
                        </TouchableOpacity>
                    </View>
                    {isConfirmInvalid && (
                        <Text style={fieldStyles.feedback}>{confirmFeedback}</Text>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputWithEye: {
        flex: 1,
        height: Bootstrap.inputHeight,
        borderWidth: 1,
        borderColor: Bootstrap.colors.inputBorder,
        borderRadius: Bootstrap.borderRadius.sm,
        paddingHorizontal: 12,
        paddingVertical: 6,
        fontSize: Bootstrap.fontSize.base,
        color: Bootstrap.colors.body,
        backgroundColor: Bootstrap.colors.inputBg,
        paddingRight: 44,
    },
    eyeBtn: {
        position: 'absolute',
        right: 8,
        padding: 6,
    },
    eyeIcon: {
        fontSize: 18,
    },
    focused: { borderColor: Bootstrap.colors.inputBorderFocus },
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

export default PasswordField;
