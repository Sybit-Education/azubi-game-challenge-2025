import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist/", "vite/", "public/assets/"]),

  {
    files: ["**/*.{js,ts}"],

    extends: [js.configs.recommended, tseslint.configs.recommended],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "_",
        },
      ],

      // General
      "no-case-declarations": "off",
      "prefer-const": "warn",

      // Console
      "no-console": [
        "warn",
        {
          allow: ["log", "warn", "error"],
        },
      ],

      // Formatting
      semi: ["error", "always"],
      quotes: [
        "warn",
        "double",
        {
          allowTemplateLiterals: true,
        },
      ],
    },
  },
]);
