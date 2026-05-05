import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../../../core/navigation'
import Bootstrap from '../../../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../../../app/providers/ThemeProvider'
import TopBar from '../../../../../../../shared/ui/components/TopBar'
import BackButton from '../../../../../../../shared/ui/components/BackButton'
import { useGroupViewModel } from '../hooks/useGroupViewModel'
import type { MessagingStackParamList } from '../../../../types'
import { MESSAGING_PATHS } from '../../../../paths'

interface Props {
  navigate: (screen: keyof MessagingStackParamList, params?: MessagingStackParamList[keyof MessagingStackParamList]) => void
  goBack: () => void
}

export default function GroupScreen({ navigate, goBack }: Props) {
  const { theme } = useTheme()
  const vm = useGroupViewModel()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <TopBar leftContent={<BackButton onPress={goBack} />} />
      <View style={styles.content}>
        {vm.loading && (
          <Text style={[styles.info, { color: theme.colors.textMuted }]}>Carregando...</Text>
        )}
        {vm.error !== null && (
          <Text style={[styles.info, { color: theme.colors.primary }]}>{vm.error}</Text>
        )}
        {!vm.loading && vm.error === null && vm.data.map(group => (
          <Text
            key={group.id}
            style={[styles.item, { color: theme.colors.text }]}
            onPress={() => navigate(MESSAGING_PATHS.GROUP_MESSAGE, { groupId: group.id })}
          >
            {group.name}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, padding: Bootstrap.spacing.xl },
  info: { fontSize: Bootstrap.fontSize.base, textAlign: 'center', marginTop: Bootstrap.spacing.xl },
  item: { fontSize: Bootstrap.fontSize.base, paddingVertical: Bootstrap.spacing.md },
})
