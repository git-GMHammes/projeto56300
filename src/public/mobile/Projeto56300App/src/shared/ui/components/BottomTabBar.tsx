import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Bootstrap from '../../theme/bootstrap'
import { useTheme } from '../../../app/providers/ThemeProvider'
import { APP_CONTRACT_CODE } from '../../../core/config/env'

export interface TabItem {
  key: string
  label: string
}

interface Props {
  tabs: TabItem[]
  activeTab: string
  onTabPress: (key: string) => void
}

export default function BottomTabBar({ tabs, activeTab, onTabPress }: Props) {
  const { theme } = useTheme()

  if (APP_CONTRACT_CODE !== 'cont0001') return null

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
      ]}
    >
      {tabs.map(tab => {
        const isActive = tab.key === activeTab
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              { borderTopColor: isActive ? theme.colors.primary : 'transparent' },
              pressed && { backgroundColor: theme.colors.divider },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? theme.colors.primary : theme.colors.textMuted },
              ]}
            >
              {tab.label}
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
    height: 56,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
  },
  label: {
    fontSize: Bootstrap.fontSize.sm,
    fontWeight: Bootstrap.fontWeight.semibold,
  },
})
