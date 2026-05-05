import React, { useMemo, useState } from 'react'
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
import type { LoginScreenProps } from '../../routes/types'
import { AUTH_PATHS } from '../../routes/paths'
import { useLoginViewModel } from '../hooks/useLoginViewModel'
import InputField from '../../../../../shared/ui/forms/fields/InputField'
import PasswordField from '../../../../../shared/ui/forms/fields/PasswordField'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import type { AppColors } from '../../../../../shared/theme/global/types'
import { API_BASE_URL, APP_ENV, APP_CONTRACT_CODE } from '../../../../../core/config/env'
import { APP_SYSTEM_ID, SYSTEM_LABELS, SystemId } from '../../../../../core/constants/systems'
import OdsMenuDrawer from '../../../../ods/presentation/ui/components/OdsMenuDrawer'
import type { AuthStackParamList } from '../../routes/types'

export default function LoginScreen({ navigation, onAuthenticated }: LoginScreenProps & { onAuthenticated?: () => void }) {
  const vm = useLoginViewModel()
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme.colors), [theme])
  const [menuVisible, setMenuVisible] = useState(false)

  const handleLogin = async () => {
    const session = await vm.submit()
    if (session) {
      onAuthenticated?.()
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {APP_CONTRACT_CODE === 'cont0001' && (
        <View style={styles.menuBar}>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      )}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>H</Text>
            </View>
            <Text style={styles.title}>Habilidade</Text>
            <Text style={styles.subtitle}>
              {SYSTEM_LABELS[APP_SYSTEM_ID as SystemId]}
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar</Text>

            {vm.error && (
              <View style={styles.alertBox}>
                <Text style={styles.alertText}>{vm.error}</Text>
              </View>
            )}

            <InputField
              name="username"
              label="Usuário"
              value={vm.form.username}
              placeholder="seu.usuario"
              required
              allowSpecial
              allowNumbers
              allowLetters
              onChange={(_, v) => vm.setField('username', v)}
              onValidationChange={() => { }}
            />

            <View style={styles.gap} />

            <PasswordField
              name="password"
              label="Senha"
              value={vm.form.password}
              placeholder="••••••••"
              required
              onChange={(_, v) => vm.setField('password', v)}
              onValidationChange={() => { }}
            />

            <TouchableOpacity
              style={[styles.btn, (!vm.isFormValid || vm.loading) && styles.btnDisabled]}
              activeOpacity={0.8}
              disabled={!vm.isFormValid || vm.loading}
              onPress={handleLogin}
            >
              {vm.loading
                ? <ActivityIndicator color={theme.colors.primaryText} />
                : <Text style={styles.btnText}>Entrar</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.link}
              onPress={() => navigation.navigate(AUTH_PATHS.FORGOT_PASSWORD)}
            >
              <Text style={styles.linkText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.link}
              onPress={() => navigation.navigate(AUTH_PATHS.REGISTER)}
            >
              <Text style={styles.linkText}>Criar conta</Text>
            </TouchableOpacity>
          </View>

          {/* Debug panel — apenas em development */}
          {APP_ENV === 'development' && (
            <View style={styles.debugPanel}>
              <Text style={styles.debugTitle}>Variáveis Globais</Text>
              {[
                ['API_BASE_URL', API_BASE_URL],
                ['APP_SYSTEM_ID', `${APP_SYSTEM_ID} — ${SYSTEM_LABELS[APP_SYSTEM_ID as SystemId]}`],
                ['APP_ENV', APP_ENV],
                ['APP_CONTRACT_CODE', APP_CONTRACT_CODE],
              ].map(([k, v]) => (
                <View key={k} style={styles.debugRow}>
                  <Text style={styles.debugKey}>{k}</Text>
                  <Text style={styles.debugVal}>{v}</Text>
                </View>
              ))}
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
      {APP_CONTRACT_CODE === 'cont0001' && (
        <OdsMenuDrawer
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          onNavigate={(name) => navigation.navigate(name as keyof AuthStackParamList)}
        />
      )}
    </SafeAreaView>
  )
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    menuBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: Bootstrap.spacing.xl,
      minHeight: 48,
    },
    flex: { flex: 1 },
    scroll: {
      flexGrow: 1,
      paddingHorizontal: Bootstrap.spacing.xl,
      paddingVertical: Bootstrap.spacing.xxl,
      justifyContent: 'center',
    },
    header: { alignItems: 'center', marginBottom: Bootstrap.spacing.xxl },
    logoBox: {
      width: 72,
      height: 72,
      borderRadius: Bootstrap.borderRadius.lg,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Bootstrap.spacing.md,
      elevation: 4,
    },
    logoText: { fontSize: 38, fontWeight: '700', color: c.primaryText },
    title: { fontSize: 26, fontWeight: '700', color: c.text },
    subtitle: { fontSize: Bootstrap.fontSize.base, color: c.textMuted, marginTop: 4 },
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
    cardTitle: {
      fontSize: Bootstrap.fontSize.md,
      fontWeight: '600',
      color: c.text,
      marginBottom: Bootstrap.spacing.lg,
    },
    alertBox: {
      backgroundColor: c.warningBg,
      borderRadius: Bootstrap.borderRadius.sm,
      padding: Bootstrap.spacing.md,
      marginBottom: Bootstrap.spacing.md,
      borderWidth: 1,
      borderColor: c.warningBorder,
    },
    alertText: { color: c.warningText, fontSize: Bootstrap.fontSize.sm },
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
    debugPanel: {
      marginTop: Bootstrap.spacing.xxl,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Bootstrap.borderRadius.sm,
      backgroundColor: c.surface,
      padding: Bootstrap.spacing.md,
    },
    debugTitle: {
      fontSize: Bootstrap.fontSize.sm,
      fontWeight: '700',
      color: c.textMuted,
      marginBottom: Bootstrap.spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    debugRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingVertical: 4,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
      gap: 6,
    },
    debugKey: { fontSize: Bootstrap.fontSize.sm, fontWeight: '600', color: c.primary, minWidth: 120 },
    debugVal: { fontSize: Bootstrap.fontSize.sm, color: c.text, flex: 1 },
    menuIcon: { fontSize: 24, color: c.text },
  })
}
