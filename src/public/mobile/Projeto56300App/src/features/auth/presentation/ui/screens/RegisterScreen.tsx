import React, { useMemo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from '../../../../../core/navigation'
import type { RegisterScreenProps } from '../../routes/types'
import { AUTH_PATHS } from '../../routes/paths'
import { useRegisterViewModel } from '../hooks/useRegisterViewModel'
import InputField from '../../../../../shared/ui/forms/fields/InputField'
import PasswordField from '../../../../../shared/ui/forms/fields/PasswordField'
import EmailField from '../../../../../shared/ui/forms/fields/EmailField'
import CpfField from '../../../../../shared/ui/forms/fields/CpfField'
import PhoneField from '../../../../../shared/ui/forms/fields/PhoneField'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import BackButton from '../../../../../shared/ui/components/BackButton'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import type { AppColors } from '../../../../../shared/theme/global/types'

function StepIndicator({ current, total }: { current: number; total: number }) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeIndStyles(theme.colors), [theme])
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i < current && styles.active]} />
      ))}
    </View>
  )
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const vm = useRegisterViewModel()
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme.colors), [theme])

  if (vm.step === 'done') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Cadastro realizado!</Text>
          <Text style={styles.successSub}>Aguarde aprovação para acessar o sistema.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate(AUTH_PATHS.LOGIN)}>
            <Text style={styles.btnText}>Ir para Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton
        onPress={() => vm.step === 'profile' ? vm.goBackToAccess() : navigation.navigate(AUTH_PATHS.LOGIN)}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Criar conta</Text>
        <StepIndicator current={vm.step === 'access' ? 1 : 2} total={2} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.card}>
            {vm.error && (
              <View style={styles.alertBox}>
                <Text style={styles.alertText}>{vm.error}</Text>
              </View>
            )}

            {vm.step === 'access' && (
              <>
                <Text style={styles.stepTitle}>Dados de Acesso</Text>

                <InputField
                  name="username"
                  label="Usuário"
                  value={vm.access.username}
                  placeholder="nome.sobrenome"
                  required
                  allowLetters
                  allowNumbers
                  allowSpecial
                  onChange={(_, v) => vm.setAccessField('username', v)}
                  onValidationChange={() => {}}
                />

                <View style={styles.gap} />

                <PasswordField
                  name="password"
                  label="Senha"
                  value={vm.access.password}
                  placeholder="mínimo 6 caracteres"
                  required
                  minLength={6}
                  doubleField
                  confirmValue={vm.access.confirmPassword}
                  onChange={(_, v) => vm.setAccessField('password', v)}
                  onConfirmChange={(_, v) => vm.setAccessField('confirmPassword', v)}
                  onValidationChange={() => {}}
                />

                <TouchableOpacity
                  style={[styles.btn, !vm.isAccessValid && styles.btnDisabled]}
                  disabled={!vm.isAccessValid}
                  activeOpacity={0.8}
                  onPress={vm.goToProfile}
                >
                  <Text style={styles.btnText}>Próximo</Text>
                </TouchableOpacity>
              </>
            )}

            {vm.step === 'profile' && (
              <>
                <Text style={styles.stepTitle}>Dados Pessoais</Text>

                <InputField
                  name="name"
                  label="Nome completo"
                  value={vm.profile.name}
                  placeholder="Seu Nome"
                  required
                  allowLetters
                  allowSpecial
                  onChange={(_, v) => vm.setProfileField('name', v)}
                  onValidationChange={() => {}}
                />

                <View style={styles.gap} />

                <EmailField
                  name="mail"
                  label="E-mail"
                  value={vm.profile.mail}
                  placeholder="seu@email.com"
                  required
                  onChange={(_, v) => vm.setProfileField('mail', v)}
                  onValidationChange={() => {}}
                />

                <View style={styles.gap} />

                <CpfField
                  name="cpf"
                  label="CPF"
                  value={vm.profile.cpf}
                  placeholder="000.000.000-00"
                  required
                  onChange={(_, v) => vm.setProfileField('cpf', v)}
                  onValidationChange={() => {}}
                />

                <View style={styles.gap} />

                <PhoneField
                  name="whatsapp"
                  label="WhatsApp"
                  value={vm.profile.whatsapp}
                  placeholder="(00) 00000-0000"
                  required
                  onChange={(_, v) => vm.setProfileField('whatsapp', v)}
                  onValidationChange={() => {}}
                />

                <View style={styles.gap} />

                <PhoneField
                  name="phone"
                  label="Telefone (opcional)"
                  value={vm.profile.phone}
                  placeholder="(00) 0000-0000"
                  onChange={(_, v) => vm.setProfileField('phone', v)}
                  onValidationChange={() => {}}
                />

                <TouchableOpacity
                  style={[styles.btn, (!vm.isProfileValid || vm.loading) && styles.btnDisabled]}
                  disabled={!vm.isProfileValid || vm.loading}
                  activeOpacity={0.8}
                  onPress={vm.submit}
                >
                  {vm.loading
                    ? <ActivityIndicator color={theme.colors.primaryText} />
                    : <Text style={styles.btnText}>Cadastrar</Text>
                  }
                </TouchableOpacity>

                <TouchableOpacity style={styles.link} onPress={vm.goBackToAccess}>
                  <Text style={styles.linkText}>← Voltar para Acesso</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

function makeIndStyles(c: AppColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: Bootstrap.spacing.lg },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.border },
    active: { backgroundColor: c.primary, width: 24 },
  })
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    flex: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: Bootstrap.spacing.xl, paddingBottom: Bootstrap.spacing.xxl },
    header: { paddingHorizontal: Bootstrap.spacing.xl, marginBottom: Bootstrap.spacing.lg },
    title: { fontSize: 22, fontWeight: '700', color: c.text, marginBottom: Bootstrap.spacing.md },
    card: {
      backgroundColor: c.surface,
      borderRadius: Bootstrap.borderRadius.lg,
      padding: Bootstrap.spacing.xl,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    stepTitle: {
      fontSize: Bootstrap.fontSize.base,
      fontWeight: '600',
      color: c.textMuted,
      marginBottom: Bootstrap.spacing.lg,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    alertBox: {
      backgroundColor: c.dangerBg,
      borderRadius: Bootstrap.borderRadius.sm,
      padding: Bootstrap.spacing.md,
      marginBottom: Bootstrap.spacing.md,
      borderWidth: 1,
      borderColor: c.dangerBorder,
    },
    alertText: { color: c.dangerText, fontSize: Bootstrap.fontSize.sm },
    gap: { height: Bootstrap.spacing.md },
    btn: {
      marginTop: Bootstrap.spacing.lg,
      height: Bootstrap.inputHeight + 6,
      borderRadius: Bootstrap.borderRadius.sm,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnDisabled: { opacity: 0.45 },
    btnText: { color: c.primaryText, fontSize: Bootstrap.fontSize.md, fontWeight: '600' },
    link: { marginTop: Bootstrap.spacing.md, alignItems: 'center' },
    linkText: { color: c.primary, fontSize: Bootstrap.fontSize.sm },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Bootstrap.spacing.xl },
    successIcon: {
      fontSize: 56,
      color: c.success,
      marginBottom: Bootstrap.spacing.lg,
    },
    successTitle: { fontSize: 22, fontWeight: '700', color: c.text, marginBottom: Bootstrap.spacing.sm },
    successSub: { fontSize: Bootstrap.fontSize.base, color: c.textMuted, textAlign: 'center', marginBottom: Bootstrap.spacing.xxl },
  })
}
