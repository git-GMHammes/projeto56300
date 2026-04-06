import autoprefixer from 'autoprefixer';

// PostCSS 8 creator-function pattern (postcss = true required)
const removeBootstrapLegacyMoz = () => ({
  postcssPlugin: 'remove-bootstrap-legacy-moz',
  Declaration(decl) {
    if (
      decl.prop === '-webkit-text-size-adjust' ||
      decl.prop === '-moz-column-gap'
    ) {
      decl.remove();
    }
  },
  Rule(rule) {
    const sel = rule.selector ?? '';
    if (
      sel.includes('::-moz-focus-inner') ||
      sel.includes('::-moz-focus-outer') ||
      sel.includes(':-moz-focusring')
    ) {
      rule.remove();
    }
  },
});
removeBootstrapLegacyMoz.postcss = true;

export default {
  plugins: [
    autoprefixer({
      overrideBrowserslist: [
        '> 0.5%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
        'not IE 11',
      ],
    }),
    removeBootstrapLegacyMoz(),
  ],
};
