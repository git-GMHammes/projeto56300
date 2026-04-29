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
import type { ForgotPasswordScreenProps } from '../../routes/types'
import { AUTH_PATHS } from '../../routes/paths'
import { useForgotPasswordViewModel } from '../hooks/useForgotPasswordViewModel'
import EmailField from '../../../../../shared/ui/forms/fields/EmailField'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import BackButton from '../../../../../shared/ui/components/BackButton'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import type { AppColors } from '../../../../../shared/theme/global/types'

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const vm = useForgotPasswordViewModel()
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme.colors), [theme])

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={() => navigation.navigate(AUTH_PATHS.LOGIN)} />
      <View style={styles.headerText}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.sub}>
          Informe seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
        </Text>
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

            {vm.sent ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>
                  E-mail enviado! Verifique sua caixa de entrada.
                </Text>
              </View>
            ) : (
              <>
                <EmailField
                  name="mail"
                  label="E-mail"
                  value={vm.mail}
                  placeholder="seu@email.com"
                  required
                  onChange={(_, v) => vm.setMail(v)}
                  onValidationChange={() => {}}
                />

                <TouchableOpacity
                  style={[styles.btn, (!vm.isValid || vm.loading) && styles.btnDisabled]}
                  disabled={!vm.isValid || vm.loading}
                  activeOpacity={0.8}
                  onPress={vm.submit}
                >
                  {vm.loading
                    ? <ActivityIndicator color={theme.colors.primaryText} />
                    : <Text style={styles.btnText}>Enviar link</Text>
                  }
                </TouchableOpacity>
              </>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    flex: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: Bootstrap.spacing.xl, paddingBottom: Bootstrap.spacing.xxl, justifyContent: 'center' },
    headerText: { paddingHorizontal: Bootstrap.spacing.xl, marginBottom: Bootstrap.spacing.lg },
    title: { fontSize: 22, fontWeight: '700', color: c.text, marginBottom: Bootstrap.spacing.sm },
    sub: { fontSize: Bootstrap.fontSize.base, color: c.textMuted },
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
    alertBox: {
      backgroundColor: c.dangerBg,
      borderRadius: Bootstrap.borderRadius.sm,
      padding: Bootstrap.spacing.md,
      marginBottom: Bootstrap.spacing.md,
      borderWidth: 1,
      borderColor: c.dangerBorder,
    },
    alertText: { color: c.dangerText, fontSize: Bootstrap.fontSize.sm },
    successBox: {
      backgroundColor: c.successBg,
      borderRadius: Bootstrap.borderRadius.sm,
      padding: Bootstrap.spacing.lg,
      borderWidth: 1,
      borderColor: c.successBorder,
    },
    successText: { color: c.successText, fontSize: Bootstrap.fontSize.base, textAlign: 'center' },
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
  })
}
