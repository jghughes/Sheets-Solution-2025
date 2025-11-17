    module.exports = [
    {
        files: ["**/*.js", "**/*.ts"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                Browser: "readonly",
                CacheService: "readonly",
                CalendarApp: "readonly",
                ContentService: "readonly",
                DocumentApp: "readonly",
                DocumentProperties: "readonly",
                DriveApp: "readonly",
                FormApp: "readonly",
                GmailApp: "readonly",
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
                SlidesApp: "readonly",
                SpreadsheetApp: "readonly",
                UrlFetchApp: "readonly",
                UserProperties: "readonly",
                Utilities: "readonly"
            }
        },
        plugins: {
            '@typescript-eslint': require("@typescript-eslint/eslint-plugin"),
            'import': require("eslint-plugin-import")
        },
        rules: {
            // General best practices
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

            // TypeScript-specific rules
            '@typescript-eslint/no-unused-vars': ["warn"],
            '@typescript-eslint/no-explicit-any': "warn",
            '@typescript-eslint/explicit-function-return-type': "off",
            '@typescript-eslint/no-inferrable-types': "off"
        },
    },
];