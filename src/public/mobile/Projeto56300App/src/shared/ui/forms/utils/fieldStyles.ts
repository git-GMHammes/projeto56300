import { StyleSheet } from 'react-native';
import Bootstrap from '../../../theme/bootstrap';
import type { AppColors } from '../../../theme/global/types';

export function makeFieldStyles(c: AppColors) {
  return StyleSheet.create({
    wrapper: {
      marginBottom: Bootstrap.spacing.md,
    },
    label: {
      fontSize: Bootstrap.fontSize.base,
      color: c.text,
      fontWeight: Bootstrap.fontWeight.normal,
      marginBottom: Bootstrap.spacing.sm,
    },
    required: {
      color: c.danger,
    },
    input: {
      height: Bootstrap.inputHeight,
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: Bootstrap.borderRadius.sm,
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: Bootstrap.fontSize.base,
      color: c.inputText,
      backgroundColor: c.inputBg,
    },
    inputInvalid: {
      borderColor: c.danger,
    },
    inputValid: {
      borderColor: c.success,
    },
    inputDisabled: {
      backgroundColor: c.surface,
      color: c.textMuted,
    },
    inputFocused: {
      borderColor: c.primary,
    },
    feedback: {
      fontSize: Bootstrap.fontSize.sm,
      color: c.danger,
      marginTop: 2,
      fontStyle: 'italic' as const,
      lineHeight: 16,
    },
    feedbackSuccess: {
      fontSize: Bootstrap.fontSize.sm,
      color: c.success,
      marginTop: 2,
      fontStyle: 'italic' as const,
      lineHeight: 16,
    },
    legend: {
      fontSize: Bootstrap.fontSize.base,
      color: c.text,
      fontWeight: Bootstrap.fontWeight.semibold,
      marginBottom: Bootstrap.spacing.sm,
    },
  });
}
