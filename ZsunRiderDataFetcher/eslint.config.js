// ESLint flat config for a Google Apps Script project using TypeScript, Jest, and HTML Service.
// This config distinguishes between server-side Apps Script code and client-side HTML UI code.
// Folder structure follows Google best practices: server-side code in src/, client-side in src/ui/.

const tsPlugin = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");

module.exports = [
    // Server-side Apps Script code (src/)
    {
        files: ["src/**/*.ts", "src/**/*.js"],
        languageOptions: {
            ecmaVersion: 2019, // Changed from 2020 to 2019 for strict GAS compatibility
            sourceType: "script",
            globals: {
                // Comprehensive list of Apps Script globals (readonly)
                // Reference: https://developers.google.com/apps-script/guides/services/available
                Browser: "readonly",
                CacheService: "readonly",
                CalendarApp: "readonly",
                CardService: "readonly",
                Charts: "readonly",
                Classroom: "readonly",
                ContactsApp: "readonly",
                ContentService: "readonly",
                DataStudioApp: "readonly",
                DocumentApp: "readonly",
                Drive: "readonly",
                DriveApp: "readonly",
                FormApp: "readonly",
                GmailApp: "readonly",
                GroupsApp: "readonly",
                HtmlService: "readonly",
                Jdbc: "readonly",
                LanguageApp: "readonly",
                Logger: "readonly",
                MailApp: "readonly",
                Maps: "readonly",
                OAuth2: "readonly",
                PropertiesService: "readonly",
                ScriptApp: "readonly",
                ScriptProperties: "readonly",
                Session: "readonly",
                SitesApp: "readonly",
                SlidesApp: "readonly",
                SpreadsheetApp: "readonly",
                UrlFetchApp: "readonly",
                UserProperties: "readonly",
                Utilities: "readonly",
                XmlService: "readonly"
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'import': importPlugin
        },
        rules: {
            'no-unused-vars': "warn",
            'no-undef': "error",
            'no-console': "off",
            'eqeqeq': "error",
            'curly': "error",
            'semi': ["error", "always"],
            'quotes': ["error", "single"],
            'no-var': "error",
            'prefer-const': "error",
            'no-fallthrough': "error",
            '@typescript-eslint/no-unused-vars': ["warn"],
            '@typescript-eslint/no-explicit-any': "warn",
            '@typescript-eslint/explicit-function-return-type': "off",
            '@typescript-eslint/no-inferrable-types': "off",
            // Prohibit unsupported features in Apps Script
            'no-restricted-syntax': [
                "error",
                // Async/await and Promises
                { "selector": "AwaitExpression", "message": "Do not use async/await in Apps Script code." },
                { "selector": "FunctionDeclaration[async=true]", "message": "Do not use async functions in Apps Script code." },
                { "selector": "FunctionExpression[async=true]", "message": "Do not use async functions in Apps Script code." },
                { "selector": "ArrowFunctionExpression[async=true]", "message": "Do not use async functions in Apps Script code." },
                { "selector": "NewExpression[callee.name='Promise']", "message": "Do not use Promise in Apps Script code." },
                // Generators
                { "selector": "FunctionDeclaration[generator=true]", "message": "Do not use generator functions in Apps Script code." },
                { "selector": "FunctionExpression[generator=true]", "message": "Do not use generator functions in Apps Script code." },
                { "selector": "YieldExpression", "message": "Do not use yield in Apps Script code." },
                // Decorators
                { "selector": "Decorator", "message": "Do not use decorators in Apps Script code." },
                // Nullish coalescing and optional chaining
                { "selector": "LogicalExpression[operator='??']", "message": "Do not use nullish coalescing (??) in Apps Script code." },
                { "selector": "ChainExpression", "message": "Do not use optional chaining (?.) in Apps Script code." },
                { "selector": "OptionalMemberExpression", "message": "Do not use optional chaining (?.) in Apps Script code." },
                { "selector": "OptionalCallExpression", "message": "Do not use optional chaining (?.) in Apps Script code." },
                // Default parameter values and destructuring in parameters
                { "selector": "AssignmentPattern", "message": "Do not use default parameter values in Apps Script code." },
                { "selector": "ObjectPattern", "message": "Do not use parameter destructuring in Apps Script code." },
                { "selector": "ArrayPattern", "message": "Do not use parameter destructuring in Apps Script code." }
            ],
            'no-restricted-globals': [
                "error",
                "Map", "Set", "WeakMap", "WeakSet", "Proxy", "Symbol", "Reflect", "BigInt"
            ],
            'no-restricted-properties': [
                "error",
                { "object": "Array", "property": "flatMap", "message": "Array.prototype.flatMap is not supported in Apps Script." },
                { "object": "Object", "property": "fromEntries", "message": "Object.fromEntries is not supported in Apps Script." }
            ]
        }
    },
    // Client-side HTML Service code (src/ui/)
    {
        files: ["src/ui/**/*.ts", "src/ui/**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly"
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'import': importPlugin
        },
        rules: {
            'no-unused-vars': "warn",
            'no-undef': "error",
            'no-console': "off",
            'eqeqeq': "error",
            'curly': "error",
            'semi': ["error", "always"],
            'quotes': ["error", "single"],
            'no-var': "error",
            'prefer-const': "error",
            'no-fallthrough': "error",
            '@typescript-eslint/no-unused-vars': ["warn"],
            '@typescript-eslint/no-explicit-any': "warn",
            '@typescript-eslint/explicit-function-return-type': "off",
            '@typescript-eslint/no-inferrable-types': "off"
        }
    },
    // Test files (Jest)
    {
        files: ["**/*.test.ts", "**/*.test.js", "**/*.spec.ts", "**/*.spec.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                jest: "readonly",
                describe: "readonly",
                it: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly"
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'import': importPlugin
        },
        rules: {
            'no-console': "off"
        }
    }
];