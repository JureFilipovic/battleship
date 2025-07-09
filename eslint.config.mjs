import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
      prettier: prettierPlugin,
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    files: ["webpack.*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["dist/**/*"],
    rules: {
      "no-unused-vars": "off",
    },
  },
]);