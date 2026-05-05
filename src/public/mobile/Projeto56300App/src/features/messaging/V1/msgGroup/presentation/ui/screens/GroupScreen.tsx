import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../../../core/navigation'
import Bootstrap from '../../../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../../../app/providers/ThemeProvider'
import TopBar from '../../../../../../../shared/ui/components/TopBar'
import BackButton from '../../../../../../../shared/ui/components/BackButton'
import footerData from '../../../../../../../data/message/footer_message.json'
import type { MessagingStackParamList } from '../../../../types'

interface Props {
  navigate: (screen: keyof MessagingStackParamList, params?: MessagingStackParamList[keyof MessagingStackParamList]) => void
  goBack: () => void
}

const item = footerData.find(i => i.key === 'groups')!

export default function GroupScreen({ goBack }: Props) {
  const { theme } = useTheme()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <TopBar leftContent={<BackButton onPress={goBack} />} />
      <Text style={[styles.title, { color: theme.colors.text }]}>{item.label}</Text>
      <View style={styles.buttons}>
        <Pressable
          style={[styles.btn, { backgroundColor: theme.colors.primary }]}
          onPress={() => {}}
        >
          <Text style={styles.btnText}>Ler</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, { backgroundColor: theme.colors.primary }]}
          onPress={() => {}}
        >
          <Text style={styles.btnText}>Criar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  title: {
    fontSize: Bootstrap.fontSize.xl,
    fontWeight: Bootstrap.fontWeight.bold,
    textAlign: 'center',
    paddingTop: Bootstrap.spacing.xl,
    paddingHorizontal: Bootstrap.spacing.xl,
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Bootstrap.spacing.xl,
    gap: Bootstrap.spacing.xl,
  },
  btn: {
    paddingVertical: Bootstrap.spacing.lg,
    borderRadius: Bootstrap.borderRadius.md,
    alignItems: 'center',
  },
  btnText: {
    color: Bootstrap.colors.white,
    fontSize: Bootstrap.fontSize.md,
    fontWeight: Bootstrap.fontWeight.semibold,
  },
})
