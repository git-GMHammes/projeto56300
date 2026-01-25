module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // Permite componentes memoizados para ícones
    'react/no-unstable-nested-components': [
      'warn',
      {
        allowAsProps: true,
      },
    ],
  },
};
