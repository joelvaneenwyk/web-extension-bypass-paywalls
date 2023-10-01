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
import pluginImport from 'eslint-plugin-import';
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  js.configs.recommended,
  // prettierConfig,
  // prettierPlugin.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "prettier": prettierPlugin,
    },
    settings: {
    },
    languageOptions: {
      globals: {
        ...globals.webextensions,
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
      "prettier/prettier": "error",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
      "semi": "off",
      "@typescript-eslint/semi": "off",
      "no-extra-semi": "warn",
      "curly": "warn",
      "quotes": "off",
      "eqeqeq": "error",
      "indent": "off",
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/no-floating-promises": "error"
    }
  }
];
