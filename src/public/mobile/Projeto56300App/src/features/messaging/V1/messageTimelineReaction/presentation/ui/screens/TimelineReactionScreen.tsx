import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../../../core/navigation'
import Bootstrap from '../../../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../../../app/providers/ThemeProvider'
import TopBar from '../../../../../../../shared/ui/components/TopBar'
import BackButton from '../../../../../../../shared/ui/components/BackButton'
import { useTimelineReactionViewModel } from '../hooks/useTimelineReactionViewModel'
import type { MessagingStackParamList } from '../../../../types'

interface Props {
  timelineId: number
  navigate: (screen: keyof MessagingStackParamList, params?: MessagingStackParamList[keyof MessagingStackParamList]) => void
  goBack: () => void
}

export default function TimelineReactionScreen({ timelineId, goBack }: Props) {
  const { theme } = useTheme()
  const vm = useTimelineReactionViewModel(timelineId)

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
        {!vm.loading && vm.error === null && (
          <Text style={[styles.info, { color: theme.colors.text }]}>
            {vm.data.length} reações
          </Text>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  info: { fontSize: Bootstrap.fontSize.base },
})
