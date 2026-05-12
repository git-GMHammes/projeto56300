import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Modal,
    FlatList, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import Bootstrap from '../../../theme/bootstrap';
import type { SelectFieldProps, SelectOption } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';
import type { AppColors } from '../../../theme/global/types';

const SelectField: React.FC<SelectFieldProps> = ({
    name,
    label,
    value = '',
    placeholder = 'Selecione...',
    readOnly = false,
    disabled = false,
    required = false,
    options = [],
    src,
    valueKey = 'value',
    labelKey = 'label',
    labelTemplate,
    onChange,
    onBlur: _onBlur,
    onValidationChange,
}) => {
    const { theme } = useTheme();
    const fs = useMemo(() => makeFieldStyles(theme.colors), [theme]);
    const ls = useMemo(() => makeLocalStyles(theme.colors), [theme]);

    const [touched, setTouched] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [items, setItems] = useState<SelectOption[]>(options);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!src) return;
        setLoading(true);
        fetch(src)
            .then(r => r.json())
            .then((data: Record<string, unknown>[]) => {
                const mapped: SelectOption[] = data.map(d => ({
                    value: String(d[valueKey]),
                    label: labelTemplate
                        ? labelTemplate.replace(/\{(\w+)\}/g, (_, k) => String(d[k] ?? ''))
                        : String(d[labelKey] ?? d[valueKey]),
                }));
                setItems(mapped);
            })
            .catch(() => setFeedback('Erro ao carregar opções.'))
            .finally(() => setLoading(false));
    }, [src, valueKey, labelKey, labelTemplate]);

    const selectedLabel = items.find(o => o.value === value)?.label ?? '';

    const validate = useCallback((val: string): string => {
        const lbl = label || 'Campo';
        const msg = required && !val ? `${lbl} é obrigatório.` : '';
        setFeedback(msg);
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [label, required, name, onValidationChange]);

    const handleSelect = (option: SelectOption) => {
        setVisible(false);
        setSearch('');
        setTouched(true);
        onChange?.(name, option.value);
        validate(option.value);
    };

    const filtered = search
        ? items.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
        : items;

    const isInvalid = touched && !!feedback;
    const isValid = touched && !feedback && !!value;

    return (
        <View style={fs.wrapper}>
            {label && (
                <Text style={fs.label}>
                    {label}
                    {required && <Text style={fs.required}> *</Text>}
                </Text>
            )}

            <TouchableOpacity
                activeOpacity={0.7}
                disabled={disabled || readOnly || loading}
                onPress={() => setVisible(true)}
                style={[
                    ls.selector,
                    isInvalid && fs.inputInvalid,
                    isValid && fs.inputValid,
                    (disabled || readOnly) && fs.inputDisabled,
                ]}
            >
                {loading
                    ? <ActivityIndicator size="small" color={theme.colors.primary} />
                    : <>
                        <Text style={[ls.selectorText, !selectedLabel && ls.placeholder]}>
                            {selectedLabel || placeholder}
                        </Text>
                        <Text style={ls.caret}>▾</Text>
                    </>
                }
            </TouchableOpacity>

            {isInvalid && <Text style={fs.feedback}>{feedback}</Text>}

            <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
                <TouchableOpacity style={staticStyles.overlay} activeOpacity={1} onPress={() => setVisible(false)} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={ls.sheet}>
                    <View style={ls.handle} />
                    <TextInput
                        style={ls.search}
                        placeholder="Buscar..."
                        placeholderTextColor={theme.colors.placeholder}
                        value={search}
                        onChangeText={setSearch}
                        autoFocus
                    />
                    <FlatList
                        data={filtered}
                        keyExtractor={item => item.value}
                        style={staticStyles.list}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[ls.item, item.value === value && ls.itemSelected]}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={[ls.itemText, item.value === value && ls.itemTextSelected]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <Text style={ls.empty}>Nenhuma opção encontrada.</Text>
                        }
                    />
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const staticStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    list: { flex: 1 },
});

function makeLocalStyles(c: AppColors) {
    return StyleSheet.create({
        selector: {
            height: Bootstrap.inputHeight,
            borderWidth: 1,
            borderColor: c.inputBorder,
            borderRadius: Bootstrap.borderRadius.sm,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: c.inputBg,
        },
        selectorText: {
            flex: 1,
            fontSize: Bootstrap.fontSize.base,
            color: c.inputText,
        },
        placeholder: { color: c.placeholder },
        caret: {
            fontSize: 14,
            color: c.textMuted,
            marginLeft: 4,
        },
        sheet: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '70%',
            backgroundColor: c.surface,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            paddingBottom: 16,
            elevation: 8,
        },
        handle: {
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: c.border,
            alignSelf: 'center',
            marginTop: 8,
            marginBottom: 12,
        },
        search: {
            marginHorizontal: 16,
            marginBottom: 8,
            height: 40,
            borderWidth: 1,
            borderColor: c.inputBorder,
            borderRadius: Bootstrap.borderRadius.sm,
            paddingHorizontal: 10,
            fontSize: Bootstrap.fontSize.base,
            color: c.inputText,
            backgroundColor: c.inputBg,
        },
        item: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: c.divider,
        },
        itemSelected: {
            backgroundColor: c.bg,
        },
        itemText: {
            fontSize: Bootstrap.fontSize.base,
            color: c.text,
        },
        itemTextSelected: {
            color: c.primary,
            fontWeight: Bootstrap.fontWeight.semibold as 'bold',
        },
        empty: {
            textAlign: 'center',
            padding: 24,
            color: c.textMuted,
            fontSize: Bootstrap.fontSize.base,
        },
    });
}

export default SelectField;
