import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { API_BASE_URL, APP_ENV } from '../../../../../core/config/env';
import { APP_SYSTEM_ID, SYSTEM_LABELS, SystemId } from '../../../../../core/constants/systems';
import InputField from '../../../../../shared/ui/forms/fields/InputField';
import PasswordField from '../../../../../shared/ui/forms/fields/PasswordField';
import Bootstrap from '../../../../../shared/theme/bootstrap';

// ─── tipos simples de formulário ──────────────────────────────────────────────
interface LoginForm {
    email: string;
    password: string;
}
interface LoginErrors {
    email: boolean;
    password: boolean;
}

// ─── componente ───────────────────────────────────────────────────────────────
const LoginScreen: React.FC = () => {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const [errors, setErrors] = useState<LoginErrors>({ email: false, password: false });

    const handleChange = (name: string, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleValidation = (name: string, isValid: boolean) => {
        setErrors(prev => ({ ...prev, [name]: !isValid }));
    };

    const handleLogin = () => {
        // TODO: chamar AuthService com API_BASE_URL
        console.log('Login', { ...form, API_BASE_URL, APP_SYSTEM_ID });
    };

    const isFormValid = form.email.length > 0 && form.password.length > 0
        && !errors.email && !errors.password;

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Logo / Título ── */}
                    <View style={styles.header}>
                        <View style={styles.logoBox}>
                            <Text style={styles.logoText}>H</Text>
                        </View>
                        <Text style={styles.title}>Habilidade</Text>
                        <Text style={styles.subtitle}>
                            {SYSTEM_LABELS[APP_SYSTEM_ID as SystemId]}
                        </Text>
                    </View>

                    {/* ── Card de Login ── */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Entrar</Text>

                        <InputField
                            name="email"
                            label="E-mail"
                            value={form.email}
                            placeholder="seu@email.com"
                            required
                            allowSpecial
                            allowNumbers
                            allowLetters
                            onChange={handleChange}
                            onValidationChange={handleValidation}
                        />

                        <View style={styles.gap} />

                        <PasswordField
                            name="password"
                            label="Senha"
                            value={form.password}
                            placeholder="••••••••"
                            required
                            onChange={handleChange}
                            onValidationChange={handleValidation}
                        />

                        <TouchableOpacity
                            style={[styles.btn, !isFormValid && styles.btnDisabled]}
                            activeOpacity={0.8}
                            disabled={!isFormValid}
                            onPress={handleLogin}
                        >
                            <Text style={styles.btnText}>Entrar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── Painel de debug (variáveis globais) ── */}
                    <View style={styles.debugPanel}>
                        <Text style={styles.debugTitle}>🔧 Variáveis Globais</Text>
                        <View style={styles.debugRow}>
                            <Text style={styles.debugKey}>API_BASE_URL</Text>
                            <Text style={styles.debugVal}>{API_BASE_URL}</Text>
                        </View>
                        <View style={styles.debugRow}>
                            <Text style={styles.debugKey}>APP_SYSTEM_ID</Text>
                            <Text style={styles.debugVal}>
                                {APP_SYSTEM_ID} — {SYSTEM_LABELS[APP_SYSTEM_ID as SystemId]}
                            </Text>
                        </View>
                        <View style={styles.debugRow}>
                            <Text style={styles.debugKey}>APP_ENV</Text>
                            <Text style={styles.debugVal}>{APP_ENV}</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ─── estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#f8f9fa' },
    flex: { flex: 1 },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: Bootstrap.spacing.xl,
        paddingVertical: Bootstrap.spacing.xxl,
        justifyContent: 'center',
    },

    /* Header */
    header: { alignItems: 'center', marginBottom: Bootstrap.spacing.xxl },
    logoBox: {
        width: 72,
        height: 72,
        borderRadius: Bootstrap.borderRadius.lg,
        backgroundColor: Bootstrap.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Bootstrap.spacing.md,
        elevation: 4,
    },
    logoText: {
        fontSize: 38,
        fontWeight: '700',
        color: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: Bootstrap.colors.body,
    },
    subtitle: {
        fontSize: Bootstrap.fontSize.base,
        color: Bootstrap.colors.muted,
        marginTop: 4,
    },

    /* Card */
    card: {
        backgroundColor: '#fff',
        borderRadius: Bootstrap.borderRadius.lg,
        padding: Bootstrap.spacing.xl,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: {
        fontSize: Bootstrap.fontSize.md,
        fontWeight: '600',
        color: Bootstrap.colors.body,
        marginBottom: Bootstrap.spacing.lg,
    },
    gap: { height: Bootstrap.spacing.md },

    /* Botão */
    btn: {
        marginTop: Bootstrap.spacing.lg,
        height: Bootstrap.inputHeight + 6,
        borderRadius: Bootstrap.borderRadius.sm,
        backgroundColor: Bootstrap.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnDisabled: { opacity: 0.45 },
    btnText: {
        color: '#fff',
        fontSize: Bootstrap.fontSize.md,
        fontWeight: '600',
    },

    /* Debug panel */
    debugPanel: {
        marginTop: Bootstrap.spacing.xxl,
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: Bootstrap.borderRadius.sm,
        backgroundColor: '#fff',
        padding: Bootstrap.spacing.md,
    },
    debugTitle: {
        fontSize: Bootstrap.fontSize.sm,
        fontWeight: '700',
        color: Bootstrap.colors.muted,
        marginBottom: Bootstrap.spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    debugRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f5',
        gap: 6,
    },
    debugKey: {
        fontSize: Bootstrap.fontSize.sm,
        fontWeight: '600',
        color: Bootstrap.colors.primary,
        minWidth: 120,
    },
    debugVal: {
        fontSize: Bootstrap.fontSize.sm,
        color: Bootstrap.colors.body,
        flex: 1,
    },
});

export default LoginScreen;
