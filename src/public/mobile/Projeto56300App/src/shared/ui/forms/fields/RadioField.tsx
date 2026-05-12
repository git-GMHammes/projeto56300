import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import Bootstrap from '../../../theme/bootstrap';
import type { RadioFieldProps } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';
import type { AppColors } from '../../../theme/global/types';

const RadioField: React.FC<RadioFieldProps> = ({
    name,
    label,
    value = '',
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

    const validate = useCallback((val: string): string => {
        const lbl = label || 'Campo';
        const msg = required && !val ? `${lbl}: selecione uma opção.` : '';
        setFeedback(msg);
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [label, required, name, onValidationChange]);

    const handleSelect = (optValue: string) => {
        if (disabled || readOnly) return;
        setTouched(true);
        validate(optValue);
        onChange?.(name, optValue);
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
                    const checked = value === opt.value;
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            activeOpacity={0.7}
                            disabled={disabled || readOnly || opt.disabled}
                            onPress={() => handleSelect(opt.value)}
                            style={[staticStyles.item, inline && staticStyles.itemInline]}
                            accessibilityRole="radio"
                            accessibilityState={{ checked }}
                        >
                            <View style={[
                                ls.circle,
                                checked && ls.circleChecked,
                                (disabled || opt.disabled) && ls.circleDisabled,
                                isInvalid && ls.circleInvalid,
                            ]}>
                                {checked && <View style={ls.dot} />}
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

const R = 10;

const staticStyles = StyleSheet.create({
    group: { flexDirection: 'column', gap: 8 },
    groupInline: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    item: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemInline: { marginRight: 4 },
});

function makeLocalStyles(c: AppColors) {
    return StyleSheet.create({
        circle: {
            width: R * 2,
            height: R * 2,
            borderRadius: R,
            borderWidth: 2,
            borderColor: c.inputBorder,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: c.inputBg,
        },
        circleChecked: { borderColor: c.primary },
        circleDisabled: { backgroundColor: c.surface, borderColor: c.border },
        circleInvalid: { borderColor: c.danger },
        dot: {
            width: R,
            height: R,
            borderRadius: R / 2,
            backgroundColor: c.primary,
        },
        optLabel: { fontSize: Bootstrap.fontSize.base, color: c.text },
        optLabelDisabled: { color: c.textMuted },
    });
}

export default RadioField;
