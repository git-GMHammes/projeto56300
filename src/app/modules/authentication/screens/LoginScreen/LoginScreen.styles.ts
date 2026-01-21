import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../../core/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: colors.text,
  },
});