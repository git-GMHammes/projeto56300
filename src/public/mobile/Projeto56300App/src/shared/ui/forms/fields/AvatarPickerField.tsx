import React, { useMemo, useCallback } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { useTheme } from '../../../../app/providers/ThemeProvider'
import Bootstrap from '../../../theme/bootstrap'
import type { AppColors } from '../../../theme/global/types'

interface AvatarPickerFieldProps {
  value: string | null
  onChange: (uri: string | null) => void
  size?: number
}

export default function AvatarPickerField({ value, onChange, size = 96 }: AvatarPickerFieldProps) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme.colors, size), [theme, size])

  const handlePick = useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, maxWidth: 800, maxHeight: 800 },
      (response) => {
        if (response.didCancel || response.errorCode) return
        const asset = response.assets?.[0]
        if (asset?.uri) onChange(asset.uri)
      },
    )
  }, [onChange])

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handlePick} activeOpacity={0.8} style={styles.circle}>
        {value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.icon}>📷</Text>
            <Text style={styles.label}>Adicionar foto</Text>
          </View>
        )}
      </TouchableOpacity>
      {value && (
        <TouchableOpacity
          onPress={() => onChange(null)}
          activeOpacity={0.8}
          style={styles.removeBtn}
        >
          <Text style={styles.removeText}>Remover foto</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

function makeStyles(c: AppColors, size: number) {
  return StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      marginBottom: Bootstrap.spacing.lg,
    },
    circle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: c.bg,
      borderWidth: 2,
      borderColor: c.border,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    placeholder: {
      alignItems: 'center',
      gap: 4,
    },
    icon: {
      fontSize: 24,
    },
    label: {
      fontSize: Bootstrap.fontSize.sm,
      color: c.textMuted,
      textAlign: 'center',
    },
    removeBtn: {
      marginTop: Bootstrap.spacing.sm,
      paddingHorizontal: Bootstrap.spacing.md,
      paddingVertical: Bootstrap.spacing.sm,
      borderRadius: Bootstrap.borderRadius.sm,
      backgroundColor: c.dangerBg,
      borderWidth: 1,
      borderColor: c.dangerBorder,
    },
    removeText: {
      color: c.dangerText,
      fontSize: Bootstrap.fontSize.sm,
      fontWeight: '600',
    },
  })
}
