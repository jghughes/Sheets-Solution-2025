"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importRidersFromUrl = importRidersFromUrl;
exports.onInstall = onInstall;
exports.showSidebar = showSidebar;
exports.showHelpDocument = showHelpDocument;
const ErrorUtils_1 = require("./utils/ErrorUtils");
const RiderStatsDataService_1 = require("./services/RiderStatsDataService");
const RiderStatsItem_1 = require("./models/RiderStatsItem");
const Logger_1 = require("./utils/Logger");
const SheetApi_1 = require("./utils/SheetApi");
const SheetRowUtils_1 = require("./utils/SheetRowUtils");
const storageConfig_1 = require("../storageConfig");
/**
 * Called from SideBar.html via google.script.run
 */
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
        (0, SheetRowUtils_1.writeSheetRowsByZwiftId)(sheetApiInstance, "Dump", riderStatsDisplayItems);
        (0, SheetRowUtils_1.updateSheetRowsByZwiftId)(sheetApiInstance, "Squad", riderStatsDisplayItems);
        return `Downloaded ${riderStatsRecords.length} records from URL. Sheets were refreshed.`;
    }
    catch (importError) {
        const errorMessage = (0, ErrorUtils_1.getErrorMessage)(importError);
        (0, Logger_1.logEvent)({
            message: `importRidersFromUrl error: ${errorMessage}`,
            level: Logger_1.LogLevel.ERROR,
            exception: (0, ErrorUtils_1.toError)(importError)
        });
        (0, ErrorUtils_1.throwAlertMessageError)(ErrorUtils_1.alertMessageErrorCode.userActionRequired, "Unable to import rider data. Please check the source URL and your spreadsheet, then try again.", "importRidersFromUrl", "importRidersFromUrl");
    }
    throw new Error("Unreachable code in importRidersFromUrl");
}
// --- Existing entry points ---
function onInstall() {
    try {
        onOpen();
    }
    catch (installError) {
        const errorMessage = (0, ErrorUtils_1.getErrorMessage)(installError);
        (0, Logger_1.logEvent)({
            message: `onInstall error: ${errorMessage}`,
            level: Logger_1.LogLevel.ERROR,
            exception: (0, ErrorUtils_1.toError)(installError)
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
        const errorMessage = (0, ErrorUtils_1.getErrorMessage)(openError);
        (0, Logger_1.logEvent)({
            message: `onOpen error: ${errorMessage}`,
            level: Logger_1.LogLevel.ERROR,
            exception: (0, ErrorUtils_1.toError)(openError)
        });
        (0, ErrorUtils_1.throwAlertMessageError)(ErrorUtils_1.alertMessageErrorCode.userActionRequired, "Unable to access the Google Sheets UI. Please ensure you have a spreadsheet open and try again.", "onOpen", "onOpen");
    }
    throw new Error("Unreachable code in onOpen");
}
/**
 * Called from SideBar.html via google.script.run
 */
function showSidebar() {
    try {
        const sidebarHtml = HtmlService.createHtmlOutputFromFile("src/ui/Sidebar")
            .setTitle("Worksheet Refresher")
            .setWidth(320);
        SpreadsheetApp.getUi().showSidebar(sidebarHtml);
    }
    catch (sidebarError) {
        const errorMessage = (0, ErrorUtils_1.getErrorMessage)(sidebarError);
        (0, Logger_1.logEvent)({
            message: `showSidebar error: ${errorMessage}`,
            level: Logger_1.LogLevel.ERROR,
            exception: (0, ErrorUtils_1.toError)(sidebarError)
        });
        (0, ErrorUtils_1.throwAlertMessageError)(ErrorUtils_1.alertMessageErrorCode.userActionRequired, "Unable to display the sidebar. Please ensure you have a spreadsheet open and try again.", "showSidebar", "showSidebar");
    }
    throw new Error("Unreachable code in showSidebar");
}
/**
 * Called from SideBar.html via google.script.run
 */
function showHelpDocument() {
    try {
        const helpHtml = HtmlService.createHtmlOutputFromFile("src/ui/Help")
            .setWidth(760)
            .setHeight(640);
        SpreadsheetApp.getUi().showModalDialog(helpHtml, "Help");
    }
    catch (helpError) {
        const errorMessage = (0, ErrorUtils_1.getErrorMessage)(helpError);
        (0, Logger_1.logEvent)({
            message: `showHelpDocument error: ${errorMessage}`,
            level: Logger_1.LogLevel.ERROR,
            exception: (0, ErrorUtils_1.toError)(helpError)
        });
        (0, ErrorUtils_1.throwAlertMessageError)(ErrorUtils_1.alertMessageErrorCode.userActionRequired, "Unable to display the help document. Please ensure you have a spreadsheet open and try again.", "showHelpDocument", "showHelpDocument");
    }
    throw new Error("Unreachable code in showHelpDocument");
}
//# sourceMappingURL=main.js.map