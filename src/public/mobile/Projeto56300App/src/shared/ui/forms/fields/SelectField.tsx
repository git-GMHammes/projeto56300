import React, { useState, useCallback, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Modal,
    FlatList, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import Bootstrap from '../../../theme/bootstrap';
import type { SelectFieldProps, SelectOption } from '../types';

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
    const [touched, setTouched] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [items, setItems] = useState<SelectOption[]>(options);
    const [loading, setLoading] = useState(false);

    // Fetch remoto se src estiver definido
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
        <View style={fieldStyles.wrapper}>
            {label && (
                <Text style={fieldStyles.label}>
                    {label}
                    {required && <Text style={fieldStyles.required}> *</Text>}
                </Text>
            )}

            <TouchableOpacity
                activeOpacity={0.7}
                disabled={disabled || readOnly || loading}
                onPress={() => setVisible(true)}
                style={[
                    styles.selector,
                    isInvalid && fieldStyles.inputInvalid,
                    isValid && fieldStyles.inputValid,
                    (disabled || readOnly) && fieldStyles.inputDisabled,
                ]}
            >
                {loading
                    ? <ActivityIndicator size="small" color={Bootstrap.colors.primary} />
                    : <>
                        <Text style={[styles.selectorText, !selectedLabel && styles.placeholder]}>
                            {selectedLabel || placeholder}
                        </Text>
                        <Text style={styles.caret}>▾</Text>
                    </>
                }
            </TouchableOpacity>

            {isInvalid && <Text style={fieldStyles.feedback}>{feedback}</Text>}

            <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheet}>
                    <View style={styles.handle} />
                    <TextInput
                        style={styles.search}
                        placeholder="Buscar..."
                        placeholderTextColor="#6c757d"
                        value={search}
                        onChangeText={setSearch}
                        autoFocus
                    />
                    <FlatList
                        data={filtered}
                        keyExtractor={item => item.value}
                        style={styles.list}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.item, item.value === value && styles.itemSelected]}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={[styles.itemText, item.value === value && styles.itemTextSelected]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.empty}>Nenhuma opção encontrada.</Text>
                        }
                    />
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    selector: {
        height: Bootstrap.inputHeight,
        borderWidth: 1,
        borderColor: Bootstrap.colors.inputBorder,
        borderRadius: Bootstrap.borderRadius.sm,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Bootstrap.colors.inputBg,
    },
    selectorText: {
        flex: 1,
        fontSize: Bootstrap.fontSize.base,
        color: Bootstrap.colors.body,
    },
    placeholder: { color: '#6c757d' },
    caret: {
        fontSize: 14,
        color: Bootstrap.colors.muted,
        marginLeft: 4,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '70%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingBottom: 16,
        elevation: 8,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#dee2e6',
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 12,
    },
    search: {
        marginHorizontal: 16,
        marginBottom: 8,
        height: 40,
        borderWidth: 1,
        borderColor: Bootstrap.colors.inputBorder,
        borderRadius: Bootstrap.borderRadius.sm,
        paddingHorizontal: 10,
        fontSize: Bootstrap.fontSize.base,
    },
    list: { flex: 1 },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    itemSelected: {
        backgroundColor: '#e7f1ff',
    },
    itemText: {
        fontSize: Bootstrap.fontSize.base,
        color: Bootstrap.colors.body,
    },
    itemTextSelected: {
        color: Bootstrap.colors.primary,
        fontWeight: Bootstrap.fontWeight.semibold as 'bold',
    },
    empty: {
        textAlign: 'center',
        padding: 24,
        color: Bootstrap.colors.muted,
        fontSize: Bootstrap.fontSize.base,
    },
});

export default SelectField;
