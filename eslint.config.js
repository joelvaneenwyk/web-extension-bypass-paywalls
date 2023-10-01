/**
 * ESLint configuration for Bypass Paywalls browser extension.
 *
 * @see https://eslint.org/docs/user-guide/configuring
*/

import globals from "globals";

import js from "@eslint/js";
import pluginTypescript from '@typescript-eslint/eslint-plugin';
import parserTypescript from '@typescript-eslint/parser';
import pluginFunctional from 'eslint-plugin-functional';
import pluginImport from 'eslint-plugin-import'; // 'import' is ambiguous & prettier has trouble

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.webextensions,
        ...globals.commonjs
      }
    },
    plugins: {
      functional: pluginFunctional,
      import: pluginImport,
      '@typescript-eslint': pluginTypescript,
      ts: pluginTypescript,
    },
    rules: {
      ...pluginTypescript.configs['eslint-recommended'].rules,
      ...pluginTypescript.configs['recommended'].rules,

      'ts/return-await': 2,
    }
    // rules: {
    //   "semi": [2, "always"],
    //   "@typescript-eslint/semi": [2, "always"]
    // }
  }
];
