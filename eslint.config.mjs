import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      '**/vendor/**',
      '**/*.min.js',
      'report_folder/**',
      '**/assets/**',
      "node_modules", 
      "dist", 
    ]
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        __report: "writable",
        __history: "writable",
        jQuery: "readonly",
        $: "readonly",
        define: "readonly",
        eve: "readonly",
        Raphael: "readonly",
        ActiveXObject: "readonly",
        Op: "readonly", // Sequelize operator
        Student: "readonly", // Sequelize models
        StudentOccupancy: "readonly",
        Room: "readonly",
        Dormitory: "readonly",
        Application: "readonly"
      },
    },
    rules: {
      "no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        args: "after-used",
        ignoreRestSiblings: true
      }],
      "no-global-assign": ["error", {
        exceptions: ["__report", "__history", "Raphael"]
      }],
      "no-undef": "error",
      "no-dupe-class-members": "error"
    }
  }
]);