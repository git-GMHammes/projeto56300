import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Bootstrap from '../../theme/bootstrap'
import { useTheme } from '../../../app/providers/ThemeProvider'
import { ANDROID_BOTTOM_INSET } from '../../../core/navigation'
import footerData from '../../../data/message/footer_message.json'

interface Props {
  activeKey: string | null
  onPress: (key: string) => void
}

export default function MessageFooterBar({ activeKey, onPress }: Props) {
  const { theme } = useTheme()

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      {footerData.map((item) => {
        const isActive = activeKey === item.key
        return (
          <Pressable
            key={item.key}
            onPress={() => onPress(item.key)}
            style={({ pressed }) => [
              styles.tab,
              pressed && { opacity: 0.7 },
            ]}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
          >
            {isActive && (
              <View style={[styles.indicator, { backgroundColor: theme.colors.primary }]} />
            )}
            <Text
              style={[
                styles.icon,
                { color: isActive ? theme.colors.primary : theme.colors.textMuted },
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? theme.colors.primary : theme.colors.textMuted,
                  fontWeight: isActive
                    ? Bootstrap.fontWeight.bold
                    : Bootstrap.fontWeight.semibold,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
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
  icon: {
    fontSize: Bootstrap.fontSize.base,
    lineHeight: Bootstrap.fontSize.base + 4,
  },
  label: {
    fontSize: Bootstrap.fontSize.sm,
    marginTop: 2,
  },
})
