import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { UserListScreenProps } from '../../routes/types'
import { USUARIO_PATHS } from '../../routes/paths'
import { useUserListViewModel } from '../hooks/useUserListViewModel'
import type { User } from '../../../domain/entities/User'
import Bootstrap from '../../../../../shared/theme/bootstrap'

function UserItem({ user, onPress }: { user: User; onPress: () => void }) {
  return (
    <TouchableOpacity style={item.row} activeOpacity={0.7} onPress={onPress}>
      <View style={item.avatar}>
        <Text style={item.avatarText}>{user.username[0].toUpperCase()}</Text>
      </View>
      <View style={item.info}>
        <Text style={item.username}>{user.username}</Text>
        <Text style={item.meta}>ID {user.id}</Text>
      </View>
      <View style={[item.badge, user.isActive ? item.badgeActive : item.badgeInactive]}>
        <Text style={item.badgeText}>{user.isActive ? 'Ativo' : 'Inativo'}</Text>
      </View>
    </TouchableOpacity>
  )
}

const item = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: Bootstrap.spacing.md, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Bootstrap.colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: Bootstrap.spacing.md },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: Bootstrap.fontSize.base },
  info: { flex: 1 },
  username: { fontWeight: '600', fontSize: Bootstrap.fontSize.base, color: Bootstrap.colors.body },
  meta: { fontSize: Bootstrap.fontSize.sm, color: Bootstrap.colors.muted, marginTop: 2 },
  badge: { borderRadius: Bootstrap.borderRadius.pill, paddingHorizontal: Bootstrap.spacing.sm, paddingVertical: 2 },
  badgeActive: { backgroundColor: '#d1e7dd' },
  badgeInactive: { backgroundColor: '#f8d7da' },
  badgeText: { fontSize: Bootstrap.fontSize.xs, fontWeight: '600' },
})

export default function UserListScreen({ navigation }: UserListScreenProps) {
  const vm = useUserListViewModel()

  const renderItem: ListRenderItem<User> = ({ item: user }) => (
    <UserItem
      user={user}
      onPress={() => navigation.navigate(USUARIO_PATHS.PROFILE, { userId: user.id })}
    />
  )

  return (
    <SafeAreaView style={styles.safe}>
      {/* Barra de busca */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={vm.search}
          onChangeText={vm.setSearch}
          onSubmitEditing={vm.submitSearch}
          placeholder="Buscar usuário..."
          returnKeyType="search"
          placeholderTextColor={Bootstrap.colors.muted}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate(USUARIO_PATHS.FORM, {})}
        >
          <Text style={styles.addBtnText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Erro */}
      {vm.error && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>{vm.error}</Text>
        </View>
      )}

      {/* Lista */}
      {vm.loading ? (
        <ActivityIndicator style={styles.loader} color={Bootstrap.colors.primary} size="large" />
      ) : (
        <FlatList<User>
          data={vm.users}
          keyExtractor={u => u.id}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={vm.users.length === 0 && styles.emptyContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
          }
        />
      )}

      {/* Paginação */}
      {vm.totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={vm.prevPage}
            disabled={vm.page <= 1}
            style={[styles.pageBtn, vm.page <= 1 && styles.pageBtnDisabled]}
          >
            <Text style={styles.pageBtnText}>← Anterior</Text>
          </TouchableOpacity>
          <Text style={styles.pageInfo}>{vm.page} / {vm.totalPages}</Text>
          <TouchableOpacity
            onPress={vm.nextPage}
            disabled={vm.page >= vm.totalPages}
            style={[styles.pageBtn, vm.page >= vm.totalPages && styles.pageBtnDisabled]}
          >
            <Text style={styles.pageBtnText}>Próxima →</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f9fa' },
  searchRow: { flexDirection: 'row', padding: Bootstrap.spacing.md, gap: Bootstrap.spacing.sm, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#dee2e6' },
  searchInput: {
    flex: 1,
    height: Bootstrap.inputHeight,
    borderWidth: 1,
    borderColor: Bootstrap.colors.inputBorder,
    borderRadius: Bootstrap.borderRadius.sm,
    paddingHorizontal: Bootstrap.spacing.md,
    fontSize: Bootstrap.fontSize.base,
    color: Bootstrap.colors.body,
    backgroundColor: Bootstrap.colors.inputBg,
  },
  addBtn: { height: Bootstrap.inputHeight, paddingHorizontal: Bootstrap.spacing.md, backgroundColor: Bootstrap.colors.primary, borderRadius: Bootstrap.borderRadius.sm, justifyContent: 'center' },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: Bootstrap.fontSize.sm },
  alertBox: { margin: Bootstrap.spacing.md, backgroundColor: '#f8d7da', borderRadius: Bootstrap.borderRadius.sm, padding: Bootstrap.spacing.md, borderWidth: 1, borderColor: '#f5c2c7' },
  alertText: { color: '#842029', fontSize: Bootstrap.fontSize.sm },
  loader: { flex: 1 },
  list: { flex: 1, backgroundColor: '#fff' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: Bootstrap.colors.muted, fontSize: Bootstrap.fontSize.base },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Bootstrap.spacing.md, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#dee2e6' },
  pageBtn: { paddingHorizontal: Bootstrap.spacing.md, paddingVertical: Bootstrap.spacing.sm, backgroundColor: Bootstrap.colors.primary, borderRadius: Bootstrap.borderRadius.sm },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { color: '#fff', fontSize: Bootstrap.fontSize.sm, fontWeight: '600' },
  pageInfo: { fontSize: Bootstrap.fontSize.sm, color: Bootstrap.colors.muted },
})
