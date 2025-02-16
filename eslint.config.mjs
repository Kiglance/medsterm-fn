import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("plugin:react/recommended", "airbnb", "prettier"), {
    plugins: {
        react,
        prettier,
        "react-hooks": fixupPluginRules(reactHooks),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        ecmaVersion: 12,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
                js: true,
            },
        },
    },

    rules: {
        "react/jsx-filename-extension": "off",
        "no-unused-vars": "warn",
        "react/react-in-jsx-scope": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/prop-types": "off",
        camelcase: "off",
        "no-plusplus": "off",
        "no-shadow": "off",
        "no-param-reassign": "off",
        "react/jsx-props-no-spreading": "off",
        "arrow-body-style": "off",
        "no-unused-expressions": "off",
        "consistent-return": "off",
        "no-console": "warn",
        "no-nested-ternary": "off",
        "react/jsx-curly-brace-presence": "off",
    },
}];