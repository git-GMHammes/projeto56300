import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Bootstrap from '../../theme/bootstrap'
import { useTheme } from '../../../app/providers/ThemeProvider'
import { ANDROID_BOTTOM_INSET } from '../../../core/navigation'
import BootstrapIcon from './WaffleMenu/BootstrapIcon'
import footerData from '../../../data/message/footer_message.json'

interface FooterItem {
  key: string
  icon?: string
  label: string
  description: string
  route?: string
}

interface Props {
  activeKey: string | null
  onPress: (key: string) => void
}

const CARD_GAP = 8

export default function MessageFooterBar({ activeKey, onPress }: Props) {
  const { theme } = useTheme()
  const [pendingKey, setPendingKey] = useState<string | null>(null)

  const items = footerData as FooterItem[]
  const pendingItem = items.find(item => item.key === pendingKey) ?? null

  function handlePress(key: string) {
    if (pendingKey === key) {
      setPendingKey(null)
      onPress(key)
    } else {
      setPendingKey(key)
    }
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.bg }]}>
      {pendingItem && (
        <View
          style={[
            styles.confirmCard,
            {
              backgroundColor: theme.colors.bg,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.cardLabel, { color: theme.colors.text }]} numberOfLines={1}>
            {pendingItem.label}
          </Text>
          {pendingItem.description ? (
            <Text style={[styles.cardDesc, { color: theme.colors.text }]} numberOfLines={2}>
              {pendingItem.description}
            </Text>
          ) : null}
        </View>
      )}

      <View
        style={[
          styles.bar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        {items.map((item) => {
          const isActive = activeKey === item.key
          const isPending = pendingKey === item.key
          return (
            <Pressable
              key={item.key}
              onPress={() => handlePress(item.key)}
              style={({ pressed }) => [
                styles.tab,
                pressed && { opacity: 0.7 },
              ]}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityHint={isPending ? 'Toque novamente para confirmar' : 'Toque para ver opções'}
            >
              {(isActive || isPending) && (
                <View
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: theme.colors.primary,
                      opacity: isPending ? 0.45 : 1,
                    },
                  ]}
                />
              )}
              {item.icon ? (
                <BootstrapIcon
                  name={item.icon}
                  size={22}
                  color={
                    isActive
                      ? theme.colors.primary
                      : isPending
                      ? theme.colors.primary
                      : theme.colors.textMuted
                  }
                />
              ) : null}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'visible',
  },
  confirmCard: {
    marginHorizontal: 16,
    marginBottom: CARD_GAP,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: Bootstrap.fontSize.base,
    fontWeight: Bootstrap.fontWeight.bold as '700',
    lineHeight: Bootstrap.fontSize.base + 4,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: Bootstrap.fontSize.sm,
    lineHeight: Bootstrap.fontSize.sm + 4,
    opacity: 0.75,
    textAlign: 'center',
    marginTop: 2,
  },
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    minHeight: 56,
    paddingBottom: ANDROID_BOTTOM_INSET,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Bootstrap.spacing.md,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 2,
    borderRadius: 1,
  },
})
