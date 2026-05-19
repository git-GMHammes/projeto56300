import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import type { Asset } from 'react-native-image-picker'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import Bootstrap from '../../../../theme/bootstrap'
import BootstrapIcon from '../../WaffleMenu/BootstrapIcon'
import { getUser } from '../../../../../core/services/StorageService'
import { CreateTimelineWithFileUseCase } from '../../../../../features/messaging/V1/messageTimeline/domain/usecases/TimelineUseCases'
import { TimelineRepositoryImpl } from '../../../../../features/messaging/V1/messageTimeline/data/repositories/TimelineRepositoryImpl'
import type { AuthSessionUser } from '../../../../../features/auth/domain/entities/AuthSession'
import type { SheetContentProps } from '../sheetRegistry'

const createUseCase = new CreateTimelineWithFileUseCase(new TimelineRepositoryImpl())

export default function TimelineSheet({ onClose, onSuccess, onError }: SheetContentProps) {
  const { theme } = useTheme()
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<Asset | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handlePickFile() {
    const result = await launchImageLibrary({ mediaType: 'mixed', selectionLimit: 1 })
    if (result.assets && result.assets.length > 0) {
      setSelectedFile(result.assets[0])
    }
  }

  async function handleSubmit() {
    const trimmed = content.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      const user = await getUser<AuthSessionUser>()
      if (!user) throw new Error('Sessão expirada. Faça login novamente.')

      const payload = {
        tenant_id: parseInt(user.ut_user_saas_tenants_id, 10),
        user_management_id: parseInt(user.ut_user_id, 10),
        content: trimmed,
      }

      const file =
        selectedFile?.uri && selectedFile.fileName && selectedFile.type
          ? { uri: selectedFile.uri, name: selectedFile.fileName, type: selectedFile.type }
          : undefined

      await createUseCase.execute(payload, file)
      setContent('')
      setSelectedFile(null)
      onClose()
      onSuccess('Publicação criada com sucesso!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao publicar. Tente novamente.'
      onError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = content.trim().length > 0 && !submitting

  return (
    <View style={[styles.container, { paddingBottom: Platform.OS === 'android' ? Bootstrap.spacing.xl : 32 }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Nova Publicação</Text>
        <Pressable onPress={submitting ? undefined : onClose} hitSlop={12}>
          <BootstrapIcon name="x-lg" size={20} color={theme.colors.textMuted} />
        </Pressable>
      </View>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBg,
            borderColor: theme.colors.inputBorder,
            color: theme.colors.inputText,
          },
        ]}
        placeholder="O que você quer compartilhar?"
        placeholderTextColor={theme.colors.placeholder}
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        editable={!submitting}
      />

      <Pressable
        style={[
          styles.filePicker,
          {
            borderColor: selectedFile ? theme.colors.primary : theme.colors.border,
            backgroundColor: theme.colors.bg,
          },
        ]}
        onPress={submitting ? undefined : handlePickFile}
      >
        <BootstrapIcon
          name={selectedFile ? 'file-earmark-check' : 'paperclip'}
          size={18}
          color={selectedFile ? theme.colors.primary : theme.colors.textMuted}
        />
        <Text
          style={[styles.filePickerText, { color: selectedFile ? theme.colors.primary : theme.colors.textMuted }]}
          numberOfLines={1}
        >
          {selectedFile ? (selectedFile.fileName ?? 'Arquivo selecionado') : 'Adicionar arquivo'}
        </Text>
        {selectedFile && (
          <Pressable hitSlop={8} onPress={() => setSelectedFile(null)}>
            <BootstrapIcon name="x" size={16} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </Pressable>

      <Pressable
        style={[
          styles.submitBtn,
          { backgroundColor: canSubmit ? theme.colors.primary : theme.colors.border },
        ]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={theme.colors.primaryText} />
        ) : (
          <Text style={[styles.submitText, { color: theme.colors.primaryText }]}>Publicar</Text>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Bootstrap.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Bootstrap.spacing.md,
  },
  title: {
    fontSize: Bootstrap.fontSize.lg,
    fontWeight: Bootstrap.fontWeight.bold,
  },
  input: {
    borderWidth: 1,
    borderRadius: Bootstrap.borderRadius.md,
    padding: Bootstrap.spacing.md,
    fontSize: Bootstrap.fontSize.base,
    minHeight: 110,
    marginBottom: Bootstrap.spacing.md,
  },
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Bootstrap.borderRadius.md,
    paddingHorizontal: Bootstrap.spacing.md,
    paddingVertical: Bootstrap.spacing.lg,
    gap: Bootstrap.spacing.sm,
    marginBottom: Bootstrap.spacing.lg,
  },
  filePickerText: {
    flex: 1,
    fontSize: Bootstrap.fontSize.sm,
  },
  submitBtn: {
    borderRadius: Bootstrap.borderRadius.md,
    paddingVertical: Bootstrap.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  submitText: {
    fontSize: Bootstrap.fontSize.base,
    fontWeight: Bootstrap.fontWeight.semibold,
  },
})
