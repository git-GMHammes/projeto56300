import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../../core/styles';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  leftButton: {
    padding: spacing.xs,
  },
  rightButton: {
    padding: spacing.xs,
  },
});
