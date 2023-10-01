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
const globals = require('globals');
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  "eslint:recommended",
  {
    files: ["**/*.js"],
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
    files: ["sub/*.js"],
    rules: {
      "no-undef": "warn",
      "no-console": "warn"
    }
  },
  {
    output: "dist",
    files: ["*.ts", "**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptPlugin
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
