/**
 * ESLint configuration for Bypass Paywalls browser extension.
 *
 * @see https://eslint.org/docs/user-guide/configuring
*/

import globals from "globals";

import js from "@eslint/js";

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.webextensions,
        ...globals.commonjs
      }
    },
    // rules: {
    //   "semi": [2, "always"],
    //   "@typescript-eslint/semi": [2, "always"]
    // }
  }
];
