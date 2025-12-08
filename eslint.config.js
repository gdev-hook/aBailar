// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  // Configuración base de Expo (ya incluye TypeScript, React, React Hooks)
  ...expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', '.eas/*'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Prettier - deshabilitar reglas conflictivas
      ...prettier.rules,
      // Configuraciones adicionales
      'react/react-in-jsx-scope': 'off', // No necesario en React 17+
      'react/prop-types': 'off', // Usamos TypeScript para tipos
    },
  },
]);
