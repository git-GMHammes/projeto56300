import React from 'react'
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import type { GlobalTheme } from '../../../../../shared/theme/global'
import type { NavigationProp } from '../../../../../core/navigation'
import type { OdsStackParamList } from '../../routes/types'
import descriptions from '../../../../../data/ods/description.json'

const imageMap: Record<string, number> = {
  'q01.png': require('../../../../../shared/assets/ods/quadros_ods/q01.png'),
  'q02.png': require('../../../../../shared/assets/ods/quadros_ods/q02.png'),
  'q03.png': require('../../../../../shared/assets/ods/quadros_ods/q03.png'),
  'q04.png': require('../../../../../shared/assets/ods/quadros_ods/q04.png'),
  'q05.png': require('../../../../../shared/assets/ods/quadros_ods/q05.png'),
  'q06.png': require('../../../../../shared/assets/ods/quadros_ods/q06.png'),
  'q07.png': require('../../../../../shared/assets/ods/quadros_ods/q07.png'),
  'q08.png': require('../../../../../shared/assets/ods/quadros_ods/q08.png'),
  'q09.png': require('../../../../../shared/assets/ods/quadros_ods/q09.png'),
  'q10.png': require('../../../../../shared/assets/ods/quadros_ods/q10.png'),
  'q11.png': require('../../../../../shared/assets/ods/quadros_ods/q11.png'),
  'q12.png': require('../../../../../shared/assets/ods/quadros_ods/q12.png'),
  'q13.png': require('../../../../../shared/assets/ods/quadros_ods/q13.png'),
  'q14.png': require('../../../../../shared/assets/ods/quadros_ods/q14.png'),
  'q15.png': require('../../../../../shared/assets/ods/quadros_ods/q15.png'),
  'q16.png': require('../../../../../shared/assets/ods/quadros_ods/q16.png'),
  'q17.png': require('../../../../../shared/assets/ods/quadros_ods/q17.png'),
  'q18.png': require('../../../../../shared/assets/ods/quadros_ods/q18.png'),
}

const SCREEN_KEYS = [
  'pods001', 'pods002', 'pods003', 'pods004', 'pods005', 'pods006',
  'pods007', 'pods008', 'pods009', 'pods010', 'pods011', 'pods012',
  'pods013', 'pods014', 'pods015', 'pods016', 'pods017', 'pods018',
] as const

const ROUTE_MAP: Record<string, keyof OdsStackParamList> = {
  pods001: 'OdsP01', pods002: 'OdsP02', pods003: 'OdsP03',
  pods004: 'OdsP04', pods005: 'OdsP05', pods006: 'OdsP06',
  pods007: 'OdsP07', pods008: 'OdsP08', pods009: 'OdsP09',
  pods010: 'OdsP10', pods011: 'OdsP11', pods012: 'OdsP12',
  pods013: 'OdsP13', pods014: 'OdsP14', pods015: 'OdsP15',
  pods016: 'OdsP16', pods017: 'OdsP17', pods018: 'OdsP18',
}

const HIT_SLOP = { top: 16, bottom: 16, left: 16, right: 16 }

interface Props {
  screenKey: string
  navigation: NavigationProp<OdsStackParamList>
}

export default function OdsPageContent({ screenKey, navigation }: Props) {
  const { theme } = useTheme()
  const styles = makeStyles(theme)

  const data = descriptions.find((d) => d.key === screenKey)
  if (!data) return null

  const idx = SCREEN_KEYS.indexOf(screenKey as typeof SCREEN_KEYS[number])
  const prevRoute = idx > 0 ? ROUTE_MAP[SCREEN_KEYS[idx - 1]] : null
  const nextRoute = idx < SCREEN_KEYS.length - 1 ? ROUTE_MAP[SCREEN_KEYS[idx + 1]] : null

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={imageMap[data.image]}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.titleBox}>
        <Text style={styles.title}>{data.title}</Text>
      </View>

      <View style={styles.descBox}>
        <Text style={styles.description}>{data.description}</Text>
      </View>

      <View style={styles.navRow}>
        {prevRoute && (
          <Pressable
            onPress={() => navigation.navigate(prevRoute)}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.navBtn, pressed && styles.navBtnPressed]}
          >
            <Text style={styles.navArrow}>←</Text>
          </Pressable>
        )}
        {nextRoute && (
          <Pressable
            onPress={() => navigation.navigate(nextRoute)}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.navBtn, pressed && styles.navBtnPressed]}
          >
            <Text style={styles.navArrow}>→</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  )
}

function makeStyles(t: GlobalTheme) {
  return StyleSheet.create({
    container: {
      padding: Bootstrap.spacing.xl,
      gap: Bootstrap.spacing.xl,
      paddingBottom: Bootstrap.spacing.xxl,
    },
    image: {
      width: 160,
      height: 160,
      alignSelf: 'center',
      borderRadius: Bootstrap.borderRadius.md,
    },
    titleBox: {
      borderRadius: Bootstrap.borderRadius.pill,
      borderWidth: 1,
      borderColor: t.colors.border,
      backgroundColor: t.colors.surface,
      paddingHorizontal: Bootstrap.spacing.xl,
      paddingVertical: Bootstrap.spacing.md,
    },
    title: {
      fontSize: Bootstrap.fontSize.lg,
      fontWeight: Bootstrap.fontWeight.bold,
      color: t.colors.text,
      textAlign: 'center',
    },
    descBox: {
      borderRadius: Bootstrap.borderRadius.lg,
      borderWidth: 1,
      borderColor: t.colors.border,
      backgroundColor: t.colors.surface,
      padding: Bootstrap.spacing.xl,
      minHeight: 200,
    },
    description: {
      fontSize: Bootstrap.fontSize.base,
      fontWeight: Bootstrap.fontWeight.normal,
      color: t.colors.text,
      textAlign: 'justify',
      lineHeight: 22,
    },
    navRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Bootstrap.spacing.md,
    },
    navBtn: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Bootstrap.borderRadius.lg,
      borderWidth: 1,
      borderColor: t.colors.border,
      backgroundColor: t.colors.surface,
    },
    navBtnPressed: {
      backgroundColor: t.colors.inputBg,
      opacity: 0.8,
    },
    navArrow: {
      fontSize: Bootstrap.fontSize.xl,
      color: t.colors.primary,
      fontWeight: Bootstrap.fontWeight.bold,
    },
  })
}
