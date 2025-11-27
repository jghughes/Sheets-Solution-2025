•	Open the integrated terminal in Visual Studio.
•	Manually run:
•	npm run build to build
•	npm run deploy to build and deploy

Before deploying, ensure that the correct scriptId is in .clasp.json. The following are the script IDs for the various Google Apps Script projects associated with Google Sheets for different users:

"scriptId": "1nMvy2msHS7LJFfeMCc5eDpK7KNtBcjeiBIdN7pR93gz2DuQdwbp3bEke" - for Apps Script entitled " Rider Stats Downloader" bound to Google sheet entitled "ZSUNR Americas WTRL TTT" sheet for Richard Mann

  "scriptId": "1M6NiifAvtqivCBYmZwTONEWbtbGZTrs6lAU5GhQKxrdVLaaUV5SCbk8F", - for Apps Script entitled "Mafuta project" bound to Google Sheet entitled "Sample - ZSUNR EMEA WTRL TTT" for Mafuta (Paul Botha)

  "scriptId": "1wrVrPanX_6xQ9bckCLe2DJrNC5PSz9CUmGUM9M5rTv-3wpEQh6CjTuUY", - for Apps Script entitled "ZSUN Rider Data Downloader" bound to Google sheet entitled "ZSUN Rider Data Downloader" for JGH as a test platform

  Note: These script IDs are the identifiers for specific Google Apps Script projects associated with Google Sheets for different users. Copy one of them into .clasp.json prior to deploying the sheets project via the developer power shell when entering "npm run deploy". The actual deployment script is in package.json, as follows:

    "scripts": {
    "clean": "tsc --build --clean",
    "esbuild": "esbuild src/main.ts --bundle --outfile=dist/main.js --format=iife --target=es2019 --platform=browser",
    "copy-gs": "cpx \"src/sheet_button_entry_point.gs\" dist",
    "build": "npm run clean && npm run esbuild && npm run copy-gs && npm run copy-html && npm run copy-manifest",
    "copy-html": "cpx \"src/**/*.html\" dist",
    "copy-manifest": "cpx \"appsscript.json\" dist",
    "push": "npx clasp push",
    "deploy": "npm run build && npm run push",
    "test": "jest",
    "lint": "eslint ."
  },

  When you update the sheets project, you must deploy it via "npm run deploy" from the developer powershell command line and you must deploy it to each Google Apps Script project one by one.
