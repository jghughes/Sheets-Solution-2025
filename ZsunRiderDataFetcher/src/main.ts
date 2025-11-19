import {
    throwAlertMessageError,
    throwServerErrorWithContext,
    isValidationError,
    serverErrorCode,
    alertMessageErrorCode,
    getErrorMessage,
    toError
} from "./utils/ErrorUtils";
import { fetchRiderStatsItemsFromUrl } from "./services/RiderStatsDataService";
import { RiderStatsItem } from "./models/RiderStatsItem";
import { logEvent, LogLevel } from "./utils/Logger";
import { SheetApi } from "./utils/SheetApi";
import { writeSheetRowsByZwiftId, updateSheetRowsByZwiftId } from "./utils/SheetRowUtils";
import { defaultSourceUrlForRidersOnAzure } from "../storageConfig";

/**
 * Called from SideBar.html via google.script.run
 */
/**
 * Imports rider data from a URL and writes to the "Dump" and "Squad" sheets.
 * Exposed to Google Apps Script sidebar.
 * @returns Status message if successful.
 */
export function importRidersFromUrl(): string {
    try {
        // Instantiate the sheet API using the concrete class
        const sheetApiInstance = new SheetApi(SpreadsheetApp.getActiveSpreadsheet());

        const riderStatsRecords = fetchRiderStatsItemsFromUrl(defaultSourceUrlForRidersOnAzure);

        const riderStatsDisplayItems = RiderStatsItem.toDisplayItemArray(riderStatsRecords);

        writeSheetRowsByZwiftId(sheetApiInstance, "Dump", riderStatsDisplayItems);

        updateSheetRowsByZwiftId(sheetApiInstance, "Squad", riderStatsDisplayItems);

        return `Downloaded ${riderStatsRecords.length} records from URL. Sheets were refreshed.`;

    } catch (importError) {
        const errorMessage = getErrorMessage(importError);
        logEvent({
            message: `importRidersFromUrl error: ${errorMessage}`,
            level: LogLevel.ERROR,
            exception: toError(importError)
        });

        throwAlertMessageError(
            alertMessageErrorCode.userActionRequired,
            "Unable to import rider data. Please check the source URL and your spreadsheet, then try again.",
            "importRidersFromUrl",
            "importRidersFromUrl"
        );
    }
    throw new Error("Unreachable code in importRidersFromUrl");
}

// --- Existing entry points ---
export function onInstall(): void {
    try {
        onOpen();
    } catch (installError) {
        const errorMessage = getErrorMessage(installError);
        logEvent({
            message: `onInstall error: ${errorMessage}`,
            level: LogLevel.ERROR,
            exception: toError(installError)
        });
        if (isValidationError(installError)) throw installError;
        throwServerErrorWithContext(
            serverErrorCode.unexpectedError,
            `onInstall failed: ${errorMessage}`,
            "onInstall",
            "onInstall",
            {}
        );
    }
    throw new Error("Unreachable code in onInstall");
}

function onOpen(): void {
    try {
        const spreadsheetUi = SpreadsheetApp.getUi();
        spreadsheetUi.createMenu("ZSUN Worksheet")
            .addItem("Open Sidebar", "showSidebar")
            .addToUi();
    } catch (openError) {
        const errorMessage = getErrorMessage(openError);
        logEvent({
            message: `onOpen error: ${errorMessage}`,
            level: LogLevel.ERROR,
            exception: toError(openError)
        });

        throwAlertMessageError(
            alertMessageErrorCode.userActionRequired,
            "Unable to access the Google Sheets UI. Please ensure you have a spreadsheet open and try again.",
            "onOpen",
            "onOpen"
        );
    }
    throw new Error("Unreachable code in onOpen");
}
/**
 * Called from SideBar.html via google.script.run
 */
export function showSidebar(): void {
    try {
        const sidebarHtml = HtmlService.createHtmlOutputFromFile("src/ui/Sidebar")
            .setTitle("Worksheet Refresher")
            .setWidth(320);
        SpreadsheetApp.getUi().showSidebar(sidebarHtml);
    } catch (sidebarError) {
        const errorMessage = getErrorMessage(sidebarError);
        logEvent({
            message: `showSidebar error: ${errorMessage}`,
            level: LogLevel.ERROR,
            exception: toError(sidebarError)
        });

        throwAlertMessageError(
            alertMessageErrorCode.userActionRequired,
            "Unable to display the sidebar. Please ensure you have a spreadsheet open and try again.",
            "showSidebar",
            "showSidebar"
        );
    }
    throw new Error("Unreachable code in showSidebar");
}

/**
 * Called from SideBar.html via google.script.run
 */
export function showHelpDocument() {
    try {
        const helpHtml = HtmlService.createHtmlOutputFromFile("src/ui/Help")
            .setWidth(760)
            .setHeight(640);
        SpreadsheetApp.getUi().showModalDialog(helpHtml, "Help");
    } catch (helpError) {
        const errorMessage = getErrorMessage(helpError);
        logEvent({
            message: `showHelpDocument error: ${errorMessage}`,
            level: LogLevel.ERROR,
            exception: toError(helpError)
        });

        throwAlertMessageError(
            alertMessageErrorCode.userActionRequired,
            "Unable to display the help document. Please ensure you have a spreadsheet open and try again.",
            "showHelpDocument",
            "showHelpDocument"
        );
    }
    throw new Error("Unreachable code in showHelpDocument");
}