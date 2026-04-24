import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import Bootstrap from '../../../theme/bootstrap';
import type { RadioFieldProps } from '../types';

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
        <View style={fieldStyles.wrapper}>
            {label && (
                <Text style={fieldStyles.legend}>
                    {label}
                    {required && <Text style={fieldStyles.required}> *</Text>}
                </Text>
            )}
            <View style={[styles.group, inline && styles.groupInline]}>
                {options.map(opt => {
                    const checked = value === opt.value;
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            activeOpacity={0.7}
                            disabled={disabled || readOnly || opt.disabled}
                            onPress={() => handleSelect(opt.value)}
                            style={[styles.item, inline && styles.itemInline]}
                            accessibilityRole="radio"
                            accessibilityState={{ checked }}
                        >
                            <View style={[
                                styles.circle,
                                checked && styles.circleChecked,
                                (disabled || opt.disabled) && styles.circleDisabled,
                                isInvalid && styles.circleInvalid,
                            ]}>
                                {checked && <View style={styles.dot} />}
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

const R = 10;

const styles = StyleSheet.create({
    group: { flexDirection: 'column', gap: 8 },
    groupInline: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    item: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemInline: { marginRight: 4 },
    circle: {
        width: R * 2,
        height: R * 2,
        borderRadius: R,
        borderWidth: 2,
        borderColor: Bootstrap.colors.inputBorder,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    circleChecked: { borderColor: Bootstrap.colors.primary },
    circleDisabled: { backgroundColor: Bootstrap.colors.inputDisabledBg, borderColor: '#adb5bd' },
    circleInvalid: { borderColor: Bootstrap.colors.danger },
    dot: {
        width: R,
        height: R,
        borderRadius: R / 2,
        backgroundColor: Bootstrap.colors.primary,
    },
    optLabel: { fontSize: Bootstrap.fontSize.base, color: Bootstrap.colors.body },
    optLabelDisabled: { color: Bootstrap.colors.muted },
});

export default RadioField;
