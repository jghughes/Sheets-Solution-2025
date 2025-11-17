"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importRidersFromUrl = importRidersFromUrl;
const ErrorUtils_1 = require("./utils/ErrorUtils");
const UserFeedbackUtils_1 = require("./utils/UserFeedbackUtils");
const RiderStatsDataService_1 = require("./services/RiderStatsDataService");
const RiderStatsItem_1 = require("./models/RiderStatsItem");
const Logger_1 = require("./utils/Logger");
const SheetApi_1 = require("./utils/SheetApi");
const SheetUtils_1 = require("./utils/SheetUtils");
const storageConfig_1 = require("../storageConfig");
/**
 * Imports rider data from a URL and writes to the "Dump" and "Squad" sheets.
 * Exposed to Google Apps Script sidebar.
 * @returns Status message if successful.
 */
function importRidersFromUrl() {
    try {
        // Instantiate the sheet API using the concrete class
        const sheetApiInstance = new SheetApi_1.SheetApi(SpreadsheetApp.getActiveSpreadsheet());
        const riderStatsRecords = (0, RiderStatsDataService_1.fetchRiderStatsItemsFromUrl)(storageConfig_1.defaultSourceUrlForRidersOnAzure);
        const riderStatsDisplayItems = RiderStatsItem_1.RiderStatsItem.toDisplayItemArray(riderStatsRecords);
        (0, SheetUtils_1.writeAllRecordsToSheet)(sheetApiInstance, "Dump", riderStatsDisplayItems);
        (0, SheetUtils_1.writeItemisedRecordsToSheet)(sheetApiInstance, "Squad", riderStatsDisplayItems);
        return `Downloaded ${riderStatsRecords.length} records from URL. Sheets were refreshed.`;
    }
    catch (importError) {
        const errorMessage = importError && importError.message ? importError.message : String(importError);
        (0, Logger_1.logEvent)({
            message: `importRidersFromUrl error: ${errorMessage}`,
            level: Logger_1.LogLevel.ERROR,
            exception: importError
        });
        (0, ErrorUtils_1.throwAlertMessageError)(ErrorUtils_1.alertMessageErrorCode.userActionRequired, "Unable to import rider data. Please check the source URL and your spreadsheet, then try again.", "importRidersFromUrl", "importRidersFromUrl");
        (0, UserFeedbackUtils_1.printAlertOrError)(importError);
        return "";
    }
    throw new Error("Unreachable code in importRidersFromUrl");
}
// --- Existing entry points ---
function onInstall() {
    try {
        onOpen();
    }
    catch (installError) {
        const errorMessage = installError && installError.message ? installError.message : String(installError);
        (0, Logger_1.logEvent)({
            message: `onInstall error: ${errorMessage}`,
            level: Logger_1.LogLevel.ERROR,
            exception: installError
        });
        if ((0, ErrorUtils_1.isValidationError)(installError))
            throw installError;
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `onInstall failed: ${errorMessage}`, "onInstall", "onInstall", {});
    }
    throw new Error("Unreachable code in onInstall");
}
function onOpen() {
    try {
        const spreadsheetUi = SpreadsheetApp.getUi();
        spreadsheetUi.createMenu("ZSUN Worksheet")
            .addItem("Open Sidebar", "showSidebar")
            .addToUi();
    }
    catch (openError) {
        const errorMessage = openError && openError.message ? openError.message : String(openError);
        (0, Logger_1.logEvent)({
            message: `onOpen error: ${errorMessage}`,
            level: Logger_1.LogLevel.ERROR,
            exception: openError
        });
        (0, ErrorUtils_1.throwAlertMessageError)(ErrorUtils_1.alertMessageErrorCode.userActionRequired, "Unable to access the Google Sheets UI. Please ensure you have a spreadsheet open and try again.", "onOpen", "onOpen");
        (0, UserFeedbackUtils_1.printAlertOrError)(openError);
        return;
    }
    throw new Error("Unreachable code in onOpen");
}
function showSidebar() {
    try {
        const sidebarHtml = HtmlService.createHtmlOutputFromFile("src/ui/Sidebar")
            .setTitle("Worksheet Refresher")
            .setWidth(320);
        SpreadsheetApp.getUi().showSidebar(sidebarHtml);
    }
    catch (sidebarError) {
        const errorMessage = sidebarError && sidebarError.message ? sidebarError.message : String(sidebarError);
        (0, Logger_1.logEvent)({
            message: `showSidebar error: ${errorMessage}`,
            level: Logger_1.LogLevel.ERROR,
            exception: sidebarError
        });
        (0, ErrorUtils_1.throwAlertMessageError)(ErrorUtils_1.alertMessageErrorCode.userActionRequired, "Unable to display the sidebar. Please ensure you have a spreadsheet open and try again.", "showSidebar", "showSidebar");
        (0, UserFeedbackUtils_1.printAlertOrError)(sidebarError);
        return;
    }
    throw new Error("Unreachable code in showSidebar");
}
function showHelpDocument() {
    try {
        const helpHtml = HtmlService.createHtmlOutputFromFile("src/ui/Help")
            .setWidth(760)
            .setHeight(640);
        SpreadsheetApp.getUi().showModalDialog(helpHtml, "Help");
    }
    catch (helpError) {
        const errorMessage = helpError && helpError.message ? helpError.message : String(helpError);
        (0, Logger_1.logEvent)({
            message: `showHelpDocument error: ${errorMessage}`,
            level: Logger_1.LogLevel.ERROR,
            exception: helpError
        });
        (0, ErrorUtils_1.throwAlertMessageError)(ErrorUtils_1.alertMessageErrorCode.userActionRequired, "Unable to display the help document. Please ensure you have a spreadsheet open and try again.", "showHelpDocument", "showHelpDocument");
        (0, UserFeedbackUtils_1.printAlertOrError)(helpError);
        return;
    }
    throw new Error("Unreachable code in showHelpDocument");
}
//# sourceMappingURL=main.js.map