import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { fieldStyles } from '../utils/fieldStyles';
import { isValidCep } from '../utils/validators';
import { formatCep, getCepDigits } from '../utils/formatters';
import Bootstrap from '../../../theme/bootstrap';
import type { CepFieldProps, CepAddress } from '../types';

const VIACEP_URL = 'https://viacep.com.br/ws/{cep}/json/';

const CepField: React.FC<CepFieldProps> = ({
    name,
    label,
    value = '',
    readOnly = false,
    disabled = false,
    required = false,
    apiUrl = VIACEP_URL,
    onAddressFound,
    onChange,
    onBlur,
    onValidationChange,
}) => {
    const [touched, setTouched] = useState(false);
    const [focused, setFocused] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const lookup = useCallback(async (digits: string) => {
        if (digits.length !== 8 || !onAddressFound) return;
        setLoading(true);
        setSuccess('');
        try {
            const url = apiUrl.replace('{cep}', digits);
            const res = await fetch(url);
            if (!res.ok) throw new Error('Resposta inválida');
            const data = await res.json();
            if (data.erro) {
                setFeedback('CEP não encontrado.');
                onValidationChange?.(name, false, 'CEP não encontrado.');
            } else {
                const address: CepAddress = {
                    cep: data.cep ?? digits,
                    uf: data.uf ?? '',
                    cidade: data.localidade ?? '',
                    bairro: data.bairro ?? '',
                    endereco: data.logradouro ?? '',
                    complemento: data.complemento ?? '',
                    codigoIBGE: data.ibge ?? '',
                };
                setSuccess('CEP encontrado.');
                onAddressFound(address);
            }
        } catch {
            setFeedback('Erro ao buscar CEP. Tente novamente.');
            onValidationChange?.(name, false, 'Erro ao buscar CEP.');
        } finally {
            setLoading(false);
        }
    }, [apiUrl, name, onAddressFound, onValidationChange]);

    const validate = useCallback((val: string): string => {
        const digits = getCepDigits(val);
        const lbl = label || 'CEP';
        let msg = '';
        if (required && !digits) {
            msg = `${lbl} é obrigatório.`;
        } else if (digits && !isValidCep(digits)) {
            msg = `${lbl} inválido (8 dígitos).`;
        }
        setFeedback(msg);
        setSuccess('');
        onValidationChange?.(name, !msg, msg);
        return msg;
    }, [label, required, name, onValidationChange]);

    const handleChange = (text: string) => {
        const formatted = formatCep(text);
        onChange?.(name, formatted);
        setSuccess('');
        if (touched) validate(formatted);
    };

    const handleBlur = () => {
        setTouched(true);
        setFocused(false);
        const err = validate(value);
        const digits = getCepDigits(value);
        if (!err && digits.length === 8) lookup(digits);
        onBlur?.(name, value);
    };

    const isInvalid = touched && !!feedback;
    const isValid = touched && !feedback && getCepDigits(value).length === 8;

    return (
        <View style={fieldStyles.wrapper}>
            {label && (
                <Text style={fieldStyles.label}>
                    {label}
                    {required && <Text style={fieldStyles.required}> *</Text>}
                </Text>
            )}
            <View style={styles.row}>
                <TextInput
                    style={[
                        styles.input,
                        focused && styles.focused,
                        isInvalid && fieldStyles.inputInvalid,
                        isValid && fieldStyles.inputValid,
                        (disabled || readOnly) && fieldStyles.inputDisabled,
                    ]}
                    value={value}
                    placeholder="00.000-000"
                    placeholderTextColor="#6c757d"
                    keyboardType="numeric"
                    maxLength={10}
                    editable={!disabled && !readOnly}
                    onChangeText={handleChange}
                    onFocus={() => setFocused(true)}
                    onBlur={handleBlur}
                />
                {loading && (
                    <ActivityIndicator
                        style={styles.spinner}
                        size="small"
                        color={Bootstrap.colors.primary}
                    />
                )}
            </View>
            {isInvalid && <Text style={fieldStyles.feedback}>{feedback}</Text>}
            {!isInvalid && !!success && (
                <Text style={fieldStyles.feedbackSuccess}>{success}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
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
    },
    focused: { borderColor: Bootstrap.colors.inputBorderFocus },
    spinner: { marginLeft: 8 },
});

export default CepField;
