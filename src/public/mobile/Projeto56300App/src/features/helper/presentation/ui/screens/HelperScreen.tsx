import React, { useMemo } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../core/navigation'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import type { AppColors } from '../../../../../shared/theme/global/types'
import BackButton from '../../../../../shared/ui/components/BackButton'
import BootstrapIcon from '../../../../../shared/ui/components/WaffleMenu/BootstrapIcon'
import helperData from '../../../data/helper.json'

interface Props {
  goBack: () => void
}

interface HelperItem {
  key: string
  icon?: string
  label: string
  description: string
  route?: string
}

export default function HelperScreen({ goBack }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme.colors), [theme])

  function renderItem({ item }: { item: HelperItem }) {
    return (
      <View style={styles.item}>
        {item.icon ? (
          <View style={styles.iconWrapper}>
            <BootstrapIcon name={item.icon} size={22} color={theme.colors.primary} />
          </View>
        ) : null}
        <View style={styles.textWrapper}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={goBack} />
      <Text style={styles.title}>Central de Ajuda</Text>
      <FlatList
        data={helperData as HelperItem[]}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  )
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bg,
    },
    title: {
      fontSize: Bootstrap.fontSize.lg,
      fontWeight: Bootstrap.fontWeight.bold as '700',
      color: c.text,
      paddingHorizontal: Bootstrap.spacing.md,
      paddingBottom: Bootstrap.spacing.md,
    },
    list: {
      paddingHorizontal: Bootstrap.spacing.md,
      paddingBottom: Bootstrap.spacing.lg,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: Bootstrap.spacing.md,
    },
    iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.divider,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Bootstrap.spacing.md,
      flexShrink: 0,
    },
    textWrapper: {
      flex: 1,
    },
    label: {
      fontSize: Bootstrap.fontSize.base,
      fontWeight: Bootstrap.fontWeight.semibold as '600',
      color: c.text,
      marginBottom: 2,
    },
    description: {
      fontSize: Bootstrap.fontSize.sm,
      color: c.textMuted,
      lineHeight: Bootstrap.fontSize.sm + 6,
    },
    separator: {
      height: 1,
      backgroundColor: c.divider,
    },
  })
}
