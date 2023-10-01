/**
 * ESLint configuration for Bypass Paywalls browser extension.
 *
 * @see https://eslint.org/docs/user-guide/configuring
*/

import globals from "globals";

import js from "@eslint/js";
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import pluginFunctional from 'eslint-plugin-functional';
import pluginImport from 'eslint-plugin-import'; // 'import' is ambiguous & prettier has trouble

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  js.configs.recommended,
  {
    files: ["src/ts/*.ts"],
    languageOptions: {
      parserOptions: {
        sourceType: "module"
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.commonjs
      }
    },
  },
  {
    files: ["*.js"],
    rules: {
      "no-undef": "warn",
      "no-console": "warn"
    }
  },
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptPlugin
    },
    settings: {
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.commonjs
      },
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2020
      }
    },
    rules: {
      "semi": "off",
      "@typescript-eslint/semi": "error",
      "no-extra-semi": "warn",
      "curly": "warn",
      "quotes": ["error", "single", { "allowTemplateLiterals": true }],
      "eqeqeq": "error",
      "indent": "off",
      "@typescript-eslint/indent": ["warn", "tab", { "SwitchCase": 1 }],
      "@typescript-eslint/no-floating-promises": "error"
    }
  }
];
