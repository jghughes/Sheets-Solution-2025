// ESLint flat config for Google Apps Script (server-side) and HTML Service (client-side) using TypeScript, Jest, and import checks.

const tsPlugin = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");

module.exports = [
    // Server-side Apps Script code (src/)
    {
        files: ["src/**/*.ts", "src/**/*.js"],
        languageOptions: {
            ecmaVersion: 2015,
            sourceType: "script",
            globals: {
                // Apps Script globals
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
            'semi': ["error", "always"],
            'quotes': ["error", "single"],
            'no-fallthrough': "error",
            // Import checks (warn about unresolved/missing imports)
            'import/no-unresolved': "error",
            'import/named': "error",
            // Prohibit ES2016+ features (not in ES2015)
            'no-restricted-syntax': [
                "error",
                { "selector": "AwaitExpression", "message": "async/await is not ES2015." },
                { "selector": "FunctionDeclaration[async=true]", "message": "async functions are not ES2015." },
                { "selector": "FunctionExpression[async=true]", "message": "async functions are not ES2015." },
                { "selector": "ArrowFunctionExpression[async=true]", "message": "async functions are not ES2015." },
                { "selector": "ChainExpression", "message": "Optional chaining (?.) is not ES2015." },
                { "selector": "LogicalExpression[operator='??']", "message": "Nullish coalescing (??) is not ES2015." },
                { "selector": "NewExpression[callee.name='BigInt']", "message": "BigInt is not ES2015." }
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
            '@typescript-eslint/no-inferrable-types': "off",
            // Import checks (warn about unresolved/missing imports)
            'import/no-unresolved': "error",
            'import/named': "error"
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