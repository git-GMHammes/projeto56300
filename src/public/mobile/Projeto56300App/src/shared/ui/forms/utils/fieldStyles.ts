// Estilos Bootstrap-like compartilhados por todos os campos
import { StyleSheet } from 'react-native';
import Bootstrap from '../../../theme/bootstrap';

export const fieldStyles = StyleSheet.create({
  wrapper: {
    marginBottom: Bootstrap.spacing.md,
  },
  label: {
    fontSize:    Bootstrap.fontSize.base,
    color:       Bootstrap.colors.labelColor,
    fontWeight:  Bootstrap.fontWeight.normal,
    marginBottom: Bootstrap.spacing.sm,
  },
  required: {
    color: Bootstrap.colors.danger,
  },
  input: {
    height:           Bootstrap.inputHeight,
    borderWidth:      1,
    borderColor:      Bootstrap.colors.inputBorder,
    borderRadius:     Bootstrap.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical:   6,
    fontSize:         Bootstrap.fontSize.base,
    color:            Bootstrap.colors.body,
    backgroundColor:  Bootstrap.colors.inputBg,
  },
  inputInvalid: {
    borderColor: Bootstrap.colors.danger,
  },
  inputValid: {
    borderColor: Bootstrap.colors.success,
  },
  inputDisabled: {
    backgroundColor: Bootstrap.colors.inputDisabledBg,
    color:           Bootstrap.colors.muted,
  },
  inputFocused: {
    borderColor: Bootstrap.colors.inputBorderFocus,
  },
  feedback: {
    fontSize:   Bootstrap.fontSize.sm,
    color:      Bootstrap.colors.feedbackDanger,
    marginTop:  2,
    fontStyle:  'italic',
    lineHeight: 16,
  },
  feedbackSuccess: {
    fontSize:   Bootstrap.fontSize.sm,
    color:      Bootstrap.colors.feedbackSuccess,
    marginTop:  2,
    fontStyle:  'italic',
    lineHeight: 16,
  },
  legend: {
    fontSize:    Bootstrap.fontSize.base,
    color:       Bootstrap.colors.labelColor,
    fontWeight:  Bootstrap.fontWeight.semibold,
    marginBottom: Bootstrap.spacing.sm,
  },
});
