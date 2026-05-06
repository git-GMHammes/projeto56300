import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { makeFieldStyles } from '../utils/fieldStyles';
import { isValidCep } from '../utils/validators';
import { formatCep, getCepDigits } from '../utils/formatters';
import Bootstrap from '../../../theme/bootstrap';
import type { CepFieldProps, CepAddress } from '../types';
import { useTheme } from '../../../../app/providers/ThemeProvider';
import type { AppColors } from '../../../theme/global/types';

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
    const { theme } = useTheme();
    const fs = useMemo(() => makeFieldStyles(theme.colors), [theme]);
    const ls = useMemo(() => makeLocalStyles(theme.colors), [theme]);

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
        <View style={fs.wrapper}>
            {label && (
                <Text style={fs.label}>
                    {label}
                    {required && <Text style={fs.required}> *</Text>}
                </Text>
            )}
            <View style={staticStyles.row}>
                <TextInput
                    style={[
                        ls.input,
                        focused && fs.inputFocused,
                        isInvalid && fs.inputInvalid,
                        isValid && fs.inputValid,
                        (disabled || readOnly) && fs.inputDisabled,
                    ]}
                    value={value}
                    placeholder="00.000-000"
                    placeholderTextColor={theme.colors.placeholder}
                    keyboardType="numeric"
                    maxLength={10}
                    editable={!disabled && !readOnly}
                    onChangeText={handleChange}
                    onFocus={() => setFocused(true)}
                    onBlur={handleBlur}
                />
                {loading && (
                    <ActivityIndicator
                        style={staticStyles.spinner}
                        size="small"
                        color={theme.colors.primary}
                    />
                )}
            </View>
            {isInvalid && <Text style={fs.feedback}>{feedback}</Text>}
            {!isInvalid && !!success && (
                <Text style={fs.feedbackSuccess}>{success}</Text>
            )}
        </View>
    );
};

const staticStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spinner: { marginLeft: 8 },
});

function makeLocalStyles(c: AppColors) {
    return StyleSheet.create({
        input: {
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
        },
    });
}

export default CepField;
