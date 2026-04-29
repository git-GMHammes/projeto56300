import React, { useMemo } from 'react'
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
import { SafeAreaView } from '../../../../../core/navigation'
import type { UserListScreenProps } from '../../routes/types'
import { USUARIO_PATHS } from '../../routes/paths'
import { useUserListViewModel } from '../hooks/useUserListViewModel'
import type { User } from '../../../domain/entities/User'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import type { AppColors } from '../../../../../shared/theme/global/types'

function UserItem({ user, onPress, colors }: { user: User; onPress: () => void; colors: AppColors }) {
  const styles = useMemo(() => makeItemStyles(colors), [colors])
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.username[0].toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.meta}>ID {user.id}</Text>
      </View>
      <View style={[styles.badge, user.isActive ? styles.badgeActive : styles.badgeInactive]}>
        <Text style={styles.badgeText}>{user.isActive ? 'Ativo' : 'Inativo'}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function UserListScreen({ navigation }: UserListScreenProps) {
  const vm = useUserListViewModel()
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme.colors), [theme])

  const renderItem: ListRenderItem<User> = ({ item: user }) => (
    <UserItem
      user={user}
      colors={theme.colors}
      onPress={() => navigation.navigate(USUARIO_PATHS.PROFILE, { userId: user.id })}
    />
  )

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={vm.search}
          onChangeText={vm.setSearch}
          onSubmitEditing={vm.submitSearch}
          placeholder="Buscar usuário..."
          returnKeyType="search"
          placeholderTextColor={theme.colors.placeholder}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate(USUARIO_PATHS.FORM, {})}
        >
          <Text style={styles.addBtnText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {vm.error && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>{vm.error}</Text>
        </View>
      )}

      {vm.loading ? (
        <ActivityIndicator style={styles.loader} color={theme.colors.primary} size="large" />
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

function makeItemStyles(c: AppColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', padding: Bootstrap.spacing.md, borderBottomWidth: 1, borderBottomColor: c.divider },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', marginRight: Bootstrap.spacing.md },
    avatarText: { color: c.primaryText, fontWeight: '700', fontSize: Bootstrap.fontSize.base },
    info: { flex: 1 },
    username: { fontWeight: '600', fontSize: Bootstrap.fontSize.base, color: c.text },
    meta: { fontSize: Bootstrap.fontSize.sm, color: c.textMuted, marginTop: 2 },
    badge: { borderRadius: Bootstrap.borderRadius.pill, paddingHorizontal: Bootstrap.spacing.sm, paddingVertical: 2 },
    badgeActive: { backgroundColor: c.successBg },
    badgeInactive: { backgroundColor: c.dangerBg },
    badgeText: { fontSize: Bootstrap.fontSize.xs, fontWeight: '600' },
  })
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    searchRow: { flexDirection: 'row', padding: Bootstrap.spacing.md, gap: Bootstrap.spacing.sm, backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border },
    searchInput: {
      flex: 1,
      height: Bootstrap.inputHeight,
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: Bootstrap.borderRadius.sm,
      paddingHorizontal: Bootstrap.spacing.md,
      fontSize: Bootstrap.fontSize.base,
      color: c.inputText,
      backgroundColor: c.inputBg,
    },
    addBtn: { height: Bootstrap.inputHeight, paddingHorizontal: Bootstrap.spacing.md, backgroundColor: c.primary, borderRadius: Bootstrap.borderRadius.sm, justifyContent: 'center' },
    addBtnText: { color: c.primaryText, fontWeight: '600', fontSize: Bootstrap.fontSize.sm },
    alertBox: { margin: Bootstrap.spacing.md, backgroundColor: c.dangerBg, borderRadius: Bootstrap.borderRadius.sm, padding: Bootstrap.spacing.md, borderWidth: 1, borderColor: c.dangerBorder },
    alertText: { color: c.dangerText, fontSize: Bootstrap.fontSize.sm },
    loader: { flex: 1 },
    list: { flex: 1, backgroundColor: c.surface },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: c.textMuted, fontSize: Bootstrap.fontSize.base },
    pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Bootstrap.spacing.md, backgroundColor: c.surface, borderTopWidth: 1, borderTopColor: c.border },
    pageBtn: { paddingHorizontal: Bootstrap.spacing.md, paddingVertical: Bootstrap.spacing.sm, backgroundColor: c.primary, borderRadius: Bootstrap.borderRadius.sm },
    pageBtnDisabled: { opacity: 0.4 },
    pageBtnText: { color: c.primaryText, fontSize: Bootstrap.fontSize.sm, fontWeight: '600' },
    pageInfo: { fontSize: Bootstrap.fontSize.sm, color: c.textMuted },
  })
}
