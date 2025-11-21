import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js", "tests/**/*.js"],
    ignores: ["uploads/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        module: "readonly",
        __dirname: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "no-underscore-dangle": "off",
    },
  },
];

