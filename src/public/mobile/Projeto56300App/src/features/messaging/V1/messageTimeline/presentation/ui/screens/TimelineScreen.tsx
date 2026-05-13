import React from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import type { ListRenderItem } from 'react-native'
import { SafeAreaView } from '../../../../../../../core/navigation'
import Bootstrap from '../../../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../../../app/providers/ThemeProvider'
import TopBar from '../../../../../../../shared/ui/components/TopBar'
import BackButton from '../../../../../../../shared/ui/components/BackButton'
import { useTimelineViewModel } from '../hooks/useTimelineViewModel'
import type { Timeline } from '../../../domain/entities/Timeline'
import type { MessagingStackParamList } from '../../../../types'

interface Props {
  navigate: (screen: keyof MessagingStackParamList, params?: MessagingStackParamList[keyof MessagingStackParamList]) => void
  goBack: () => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

interface CardProps {
  item: Timeline
  primaryColor: string
  primaryTextColor: string
  textColor: string
  textMutedColor: string
  surfaceColor: string
  borderColor: string
}

function TimelineCard({ item, primaryColor, primaryTextColor, textColor, textMutedColor, surfaceColor, borderColor }: CardProps) {
  const initial = item.author_name ? item.author_name.charAt(0).toUpperCase() : '?'

  return (
    <View style={[styles.card, { backgroundColor: surfaceColor, borderColor }]}>
      {item.is_pinned === 1 && (
        <View style={[styles.pinnedBadge, { backgroundColor: primaryColor }]}>
          <Text style={[styles.pinnedText, { color: primaryTextColor }]}>Fixado</Text>
        </View>
      )}
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
          <Text style={[styles.avatarText, { color: primaryTextColor }]}>{initial}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: textColor }]} numberOfLines={1}>
            {item.author_name || 'Usuário'}
          </Text>
          <Text style={[styles.date, { color: textMutedColor }]}>{formatDate(item.created_at)}</Text>
        </View>
      </View>
      <Text style={[styles.content, { color: textColor }]}>{item.content}</Text>
    </View>
  )
}

export default function TimelineScreen({ goBack }: Props) {
  const { theme } = useTheme()
  const { data, loading, error, reload, loadMore, pagination, page } = useTimelineViewModel()

  const cardProps = {
    primaryColor: theme.colors.primary,
    primaryTextColor: theme.colors.primaryText,
    textColor: theme.colors.text,
    textMutedColor: theme.colors.textMuted,
    surfaceColor: theme.colors.surface,
    borderColor: theme.colors.border,
  }

  const renderItem: ListRenderItem<Timeline> = ({ item }) => (
    <TimelineCard item={item} {...cardProps} />
  )

  const isFirstLoad = loading && data.length === 0

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <TopBar leftContent={<BackButton onPress={goBack} />} />

      {isFirstLoad ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={renderItem}
          contentContainerStyle={data.length === 0 ? styles.listEmpty : styles.list}
          refreshing={loading && page === 1}
          onRefresh={reload}
          onEndReached={() => {
            if (!loading && pagination && page < pagination.pageCount) loadMore()
          }}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: theme.colors.textMuted }}>Nenhuma publicação ainda.</Text>
            </View>
          }
          ListFooterComponent={
            loading && page > 1 ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Bootstrap.spacing.xl,
  },
  list: {
    padding: Bootstrap.spacing.md,
    gap: Bootstrap.spacing.lg,
  },
  listEmpty: { flex: 1 },
  card: {
    borderRadius: Bootstrap.borderRadius.lg,
    borderWidth: 1,
    padding: Bootstrap.spacing.md,
    gap: Bootstrap.spacing.sm,
  },
  pinnedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Bootstrap.spacing.sm,
    paddingVertical: 2,
    borderRadius: Bootstrap.borderRadius.sm,
  },
  pinnedText: {
    fontSize: Bootstrap.fontSize.xs,
    fontWeight: Bootstrap.fontWeight.semibold,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Bootstrap.spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Bootstrap.fontSize.md,
    fontWeight: Bootstrap.fontWeight.bold,
  },
  authorInfo: { flex: 1 },
  authorName: {
    fontSize: Bootstrap.fontSize.base,
    fontWeight: Bootstrap.fontWeight.semibold,
  },
  date: { fontSize: Bootstrap.fontSize.xs },
  content: {
    fontSize: Bootstrap.fontSize.base,
    lineHeight: 22,
  },
  errorText: {
    fontSize: Bootstrap.fontSize.base,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: Bootstrap.spacing.lg,
    alignItems: 'center',
  },
})
