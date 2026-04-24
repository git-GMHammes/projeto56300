// Bootstrap 5 design tokens para React Native
// Fonte: https://getbootstrap.com/docs/5.3/customize/css-variables/

export const colors = {
  primary:          '#0d6efd',
  primaryDark:      '#0a58ca',
  primaryFocus:     '#86b7fe',
  secondary:        '#6c757d',
  success:          '#198754',
  danger:           '#dc3545',
  warning:          '#ffc107',
  warningDark:      '#664d03',
  info:             '#0dcaf0',
  light:            '#f8f9fa',
  dark:             '#212529',
  white:            '#ffffff',
  body:             '#212529',
  muted:            '#6c757d',
  // Form controls
  inputBorder:      '#dee2e6',
  inputBorderFocus: '#86b7fe',
  inputBg:          '#ffffff',
  inputDisabledBg:  '#e9ecef',
  inputPlaceholder: '#6c757d',
  labelColor:       '#212529',
  feedbackDanger:   '#dc3545',
  feedbackSuccess:  '#198754',
  feedbackWarning:  '#664d03',
  // Overlay / Modal
  overlay:          'rgba(0,0,0,0.4)',
} as const;

export const spacing = {
  xs:  2,
  sm:  4,
  md:  8,
  lg:  12,
  xl:  16,
  xxl: 24,
} as const;

export const borderRadius = {
  none: 0,
  sm:   4,
  md:   6,
  lg:   8,
  xl:   12,
  pill: 50,
} as const;

export const fontSize = {
  xs:   10,
  sm:   11,
  base: 14,
  md:   16,
  lg:   18,
  xl:   20,
  xxl:  24,
} as const;

export const fontWeight = {
  normal:   '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
};

export const inputHeight = 38;

const Bootstrap = { colors, spacing, borderRadius, fontSize, fontWeight, inputHeight };
export default Bootstrap;
