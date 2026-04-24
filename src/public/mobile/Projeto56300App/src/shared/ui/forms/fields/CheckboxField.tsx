import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import Bootstrap from '../../../theme/bootstrap';
import type { CheckboxFieldProps } from '../types';

const CheckboxField: React.FC<CheckboxFieldProps> = ({
    name,
    label,
    value = [],
    readOnly = false,
    disabled = false,
    required = false,
    options = [],
    inline = false,
    onChange,
    onValidationChange,
}) => {
    const [touched, setTouched] = useState(false);
    const [feedback, setFeedback] = useState('');

    const validate = useCallback((selected: string[]): string => {
        const lbl = label || 'Campo';
        const msg = required && selected.length === 0 ? `${lbl}: selecione ao menos uma opção.` : '';
        setFeedback(msg);
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [label, required, name, onValidationChange]);

    const toggle = (optValue: string) => {
        if (disabled || readOnly) return;
        const current = Array.isArray(value) ? [...value] : [];
        const idx = current.indexOf(optValue);
        const next = idx >= 0
            ? current.filter(v => v !== optValue)
            : [...current, optValue];
        setTouched(true);
        validate(next);
        onChange?.(name, next);
    };

    const isInvalid = touched && !!feedback;

    return (
        <View style={fieldStyles.wrapper}>
            {label && (
                <Text style={fieldStyles.legend}>
                    {label}
                    {required && <Text style={fieldStyles.required}> *</Text>}
                </Text>
            )}
            <View style={[styles.group, inline && styles.groupInline]}>
                {options.map(opt => {
                    const checked = Array.isArray(value) && value.includes(opt.value);
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            activeOpacity={0.7}
                            disabled={disabled || readOnly || opt.disabled}
                            onPress={() => toggle(opt.value)}
                            style={[styles.item, inline && styles.itemInline]}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked }}
                        >
                            <View style={[
                                styles.box,
                                checked && styles.boxChecked,
                                (disabled || opt.disabled) && styles.boxDisabled,
                                isInvalid && styles.boxInvalid,
                            ]}>
                                {checked && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={[
                                styles.optLabel,
                                (disabled || opt.disabled) && styles.optLabelDisabled,
                            ]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {isInvalid && <Text style={fieldStyles.feedback}>{feedback}</Text>}
        </View>
    );
};

const BOX = 20;

const styles = StyleSheet.create({
    group: { flexDirection: 'column', gap: 8 },
    groupInline: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    item: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemInline: { marginRight: 4 },
    box: {
        width: BOX,
        height: BOX,
        borderWidth: 2,
        borderColor: Bootstrap.colors.inputBorder,
        borderRadius: Bootstrap.borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    boxChecked: { backgroundColor: Bootstrap.colors.primary, borderColor: Bootstrap.colors.primary },
    boxDisabled: { backgroundColor: Bootstrap.colors.inputDisabledBg, borderColor: '#adb5bd' },
    boxInvalid: { borderColor: Bootstrap.colors.danger },
    checkmark: { color: '#fff', fontSize: 12, fontWeight: 'bold', lineHeight: 14 },
    optLabel: { fontSize: Bootstrap.fontSize.base, color: Bootstrap.colors.body },
    optLabelDisabled: { color: Bootstrap.colors.muted },
});

export default CheckboxField;
