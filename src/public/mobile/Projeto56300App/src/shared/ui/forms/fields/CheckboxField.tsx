import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import Bootstrap from '../../../theme/bootstrap';
import type { CheckboxFieldProps } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';
import type { AppColors } from '../../../theme/global/types';

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
    const { theme } = useTheme();
    const fs = useMemo(() => makeFieldStyles(theme.colors), [theme]);
    const ls = useMemo(() => makeLocalStyles(theme.colors), [theme]);

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
        <View style={fs.wrapper}>
            {label && (
                <Text style={fs.legend}>
                    {label}
                    {required && <Text style={fs.required}> *</Text>}
                </Text>
            )}
            <View style={[staticStyles.group, inline && staticStyles.groupInline]}>
                {options.map(opt => {
                    const checked = Array.isArray(value) && value.includes(opt.value);
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            activeOpacity={0.7}
                            disabled={disabled || readOnly || opt.disabled}
                            onPress={() => toggle(opt.value)}
                            style={[staticStyles.item, inline && staticStyles.itemInline]}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked }}
                        >
                            <View style={[
                                ls.box,
                                checked && ls.boxChecked,
                                (disabled || opt.disabled) && ls.boxDisabled,
                                isInvalid && ls.boxInvalid,
                            ]}>
                                {checked && <Text style={staticStyles.checkmark}>✓</Text>}
                            </View>
                            <Text style={[
                                ls.optLabel,
                                (disabled || opt.disabled) && ls.optLabelDisabled,
                            ]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {isInvalid && <Text style={fs.feedback}>{feedback}</Text>}
        </View>
    );
};

const BOX = 20;

const staticStyles = StyleSheet.create({
    group: { flexDirection: 'column', gap: 8 },
    groupInline: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    item: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemInline: { marginRight: 4 },
    checkmark: { color: '#fff', fontSize: 12, fontWeight: 'bold', lineHeight: 14 },
});

function makeLocalStyles(c: AppColors) {
    return StyleSheet.create({
        box: {
            width: BOX,
            height: BOX,
            borderWidth: 2,
            borderColor: c.inputBorder,
            borderRadius: Bootstrap.borderRadius.sm,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: c.inputBg,
        },
        boxChecked: { backgroundColor: c.primary, borderColor: c.primary },
        boxDisabled: { backgroundColor: c.surface, borderColor: c.border },
        boxInvalid: { borderColor: c.danger },
        optLabel: { fontSize: Bootstrap.fontSize.base, color: c.text },
        optLabelDisabled: { color: c.textMuted },
    });
}

export default CheckboxField;
