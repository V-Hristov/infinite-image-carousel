import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintRecommended from '@eslint/js'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import typescriptEslintParser from '@typescript-eslint/parser'

export default [
    {
        files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                // Browser/DOM globals
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                BigInt: 'readonly',
                globalThis: 'readonly',
                console: 'readonly',
                HTMLDivElement: 'readonly',
                HTMLImageElement: 'readonly',
                HTMLElement: 'readonly',
                IntersectionObserver: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                fetch: 'readonly',
            },
        },
        plugins: {
            react: eslintPluginReact,       // React plugin
            prettier: eslintPluginPrettier, // Prettier plugin
        },
        rules: {
            'prettier/prettier': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        // TypeScript-specific configuration
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptEslintParser,
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    eslintRecommended.configs.recommended,
    {
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            '.idea/',
        ],
    },
]