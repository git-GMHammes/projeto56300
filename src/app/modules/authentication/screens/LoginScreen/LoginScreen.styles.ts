import { StyleSheet } from 'react-native';
import { colors } from '../../../../core/styles/colors';
import { spacing } from '../../../../core/styles/spacing';
import { typography } from '../../../../core/styles/typography';

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