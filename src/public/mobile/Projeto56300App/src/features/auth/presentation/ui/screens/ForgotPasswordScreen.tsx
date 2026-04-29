import React from 'react'
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
import { SafeAreaView } from 'react-native-safe-area-context'
import type { ForgotPasswordScreenProps } from '../../routes/types'
import { useForgotPasswordViewModel } from '../hooks/useForgotPasswordViewModel'
import EmailField from '../../../../../shared/ui/forms/fields/EmailField'
import Bootstrap from '../../../../../shared/theme/bootstrap'

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const vm = useForgotPasswordViewModel()

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.sub}>
            Informe seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
          </Text>

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
                    ? <ActivityIndicator color="#fff" />
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f9fa' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Bootstrap.spacing.xl, paddingVertical: Bootstrap.spacing.xxl, justifyContent: 'center' },
  backBtn: { marginBottom: Bootstrap.spacing.lg },
  backText: { color: Bootstrap.colors.primary, fontSize: Bootstrap.fontSize.sm },
  title: { fontSize: 22, fontWeight: '700', color: Bootstrap.colors.body, marginBottom: Bootstrap.spacing.sm },
  sub: { fontSize: Bootstrap.fontSize.base, color: Bootstrap.colors.muted, marginBottom: Bootstrap.spacing.xxl },
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
  alertBox: {
    backgroundColor: '#f8d7da',
    borderRadius: Bootstrap.borderRadius.sm,
    padding: Bootstrap.spacing.md,
    marginBottom: Bootstrap.spacing.md,
    borderWidth: 1,
    borderColor: '#f5c2c7',
  },
  alertText: { color: '#842029', fontSize: Bootstrap.fontSize.sm },
  successBox: {
    backgroundColor: '#d1e7dd',
    borderRadius: Bootstrap.borderRadius.sm,
    padding: Bootstrap.spacing.lg,
    borderWidth: 1,
    borderColor: '#a3cfbb',
  },
  successText: { color: '#0a3622', fontSize: Bootstrap.fontSize.base, textAlign: 'center' },
  btn: {
    marginTop: Bootstrap.spacing.lg,
    height: Bootstrap.inputHeight + 6,
    borderRadius: Bootstrap.borderRadius.sm,
    backgroundColor: Bootstrap.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: '#fff', fontSize: Bootstrap.fontSize.md, fontWeight: '600' },
})
