import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { UserProfileScreenProps } from '../../routes/types'
import { USUARIO_PATHS } from '../../routes/paths'
import { GetUserByIdUseCase } from '../../../domain/usecases/GetUserByIdUseCase'
import { UserRepositoryImpl } from '../../../data/repositories/UserRepositoryImpl'
import type { User } from '../../../domain/entities/User'
import Bootstrap from '../../../../../shared/theme/bootstrap'

const getUserByIdUseCase = new GetUserByIdUseCase(new UserRepositoryImpl())

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={row.container}>
      <Text style={row.label}>{label}</Text>
      <Text style={row.value}>{value ?? '—'}</Text>
    </View>
  )
}

const row = StyleSheet.create({
  container: { paddingVertical: Bootstrap.spacing.md, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  label: { fontSize: Bootstrap.fontSize.sm, color: Bootstrap.colors.muted, marginBottom: 2 },
  value: { fontSize: Bootstrap.fontSize.base, color: Bootstrap.colors.body, fontWeight: '500' },
})

export default function UserProfileScreen({ route, navigation }: UserProfileScreenProps) {
  const { userId } = route.params
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getUserByIdUseCase.execute(userId)
      .then(u => setUser(u))
      .catch(e => setError(e instanceof Error ? e.message : 'Erro ao carregar perfil.'))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={styles.loader} color={Bootstrap.colors.primary} size="large" />
      </SafeAreaView>
    )
  }

  if (error || !user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error ?? 'Usuário não encontrado.'}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>← Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.username[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.username}>{user.username}</Text>
          <View style={[styles.badge, user.isActive ? styles.badgeActive : styles.badgeInactive]}>
            <Text style={styles.badgeText}>{user.isActive ? 'Ativo' : 'Inativo'}</Text>
          </View>
        </View>

        {/* Dados */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <InfoRow label="ID" value={user.id} />
          <InfoRow label="UUID" value={user.uuid} />
          <InfoRow label="Usuário" value={user.username} />
          <InfoRow label="Criado em" value={new Date(user.createdAt).toLocaleDateString('pt-BR')} />
          <InfoRow label="Atualizado em" value={new Date(user.updatedAt).toLocaleDateString('pt-BR')} />
        </View>

        {/* Ações */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate(USUARIO_PATHS.FORM, { userId: user.id })}
        >
          <Text style={styles.editBtnText}>Editar Usuário</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f9fa' },
  loader: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Bootstrap.spacing.xl, paddingVertical: Bootstrap.spacing.xxl },
  avatarSection: { alignItems: 'center', marginBottom: Bootstrap.spacing.xxl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Bootstrap.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Bootstrap.spacing.md },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '700' },
  username: { fontSize: 20, fontWeight: '700', color: Bootstrap.colors.body, marginBottom: Bootstrap.spacing.sm },
  badge: { borderRadius: Bootstrap.borderRadius.pill, paddingHorizontal: Bootstrap.spacing.md, paddingVertical: 4 },
  badgeActive: { backgroundColor: '#d1e7dd' },
  badgeInactive: { backgroundColor: '#f8d7da' },
  badgeText: { fontSize: Bootstrap.fontSize.sm, fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: Bootstrap.borderRadius.lg, padding: Bootstrap.spacing.xl, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, marginBottom: Bootstrap.spacing.lg },
  sectionTitle: { fontSize: Bootstrap.fontSize.sm, fontWeight: '700', color: Bootstrap.colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Bootstrap.spacing.sm },
  editBtn: { height: Bootstrap.inputHeight + 6, borderRadius: Bootstrap.borderRadius.sm, borderWidth: 2, borderColor: Bootstrap.colors.primary, alignItems: 'center', justifyContent: 'center' },
  editBtnText: { color: Bootstrap.colors.primary, fontSize: Bootstrap.fontSize.md, fontWeight: '600' },
  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Bootstrap.spacing.xl },
  errorText: { color: '#842029', fontSize: Bootstrap.fontSize.base, textAlign: 'center', marginBottom: Bootstrap.spacing.lg },
  backLink: { color: Bootstrap.colors.primary, fontSize: Bootstrap.fontSize.sm },
})
