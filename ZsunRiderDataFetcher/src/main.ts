import {
    throwAlertMessageError,
    throwServerErrorWithContext,
    isValidationError,
    serverErrorCode,
    alertMessageErrorCode,
} from "./utils/ErrorUtils";
import { printAlertOrError } from "./utils/UserFeedbackUtils";
import { fetchRiderStatsItemsFromUrl } from "./services/RiderStatsDataService";
import { RiderStatsItem } from "./models/RiderStatsItem";
import { logEvent, LogLevel } from "./utils/Logger";
import { SheetApi } from "./utils/SheetApi";
import { writeSheetRowsByZwiftId, updateSheetRowsByZwiftId } from "./utils/SheetRowUtils";
import { defaultSourceUrlForRidersOnAzure } from "../storageConfig";

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
        const errorMessage = importError && importError.message ? importError.message : String(importError);
        logEvent({
            message: `importRidersFromUrl error: ${errorMessage}`,
            level: LogLevel.ERROR,
            exception: importError
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
function onInstall(): void {
    try {
        onOpen();
    } catch (installError) {
        const errorMessage = installError && installError.message ? installError.message : String(installError);
        logEvent({
            message: `onInstall error: ${errorMessage}`,
            level: LogLevel.ERROR,
            exception: installError
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
        const errorMessage = openError && openError.message ? openError.message : String(openError);
        logEvent({
            message: `onOpen error: ${errorMessage}`,
            level: LogLevel.ERROR,
            exception: openError
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

function showSidebar(): void {
    try {
        const sidebarHtml = HtmlService.createHtmlOutputFromFile("src/ui/Sidebar")
            .setTitle("Worksheet Refresher")
            .setWidth(320);
        SpreadsheetApp.getUi().showSidebar(sidebarHtml);
    } catch (sidebarError) {
        const errorMessage = sidebarError && sidebarError.message ? sidebarError.message : String(sidebarError);
        logEvent({
            message: `showSidebar error: ${errorMessage}`,
            level: LogLevel.ERROR,
            exception: sidebarError
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

function showHelpDocument() {
    try {
        const helpHtml = HtmlService.createHtmlOutputFromFile("src/ui/Help")
            .setWidth(760)
            .setHeight(640);
        SpreadsheetApp.getUi().showModalDialog(helpHtml, "Help");
    } catch (helpError) {
        const errorMessage = helpError && helpError.message ? helpError.message : String(helpError);
        logEvent({
            message: `showHelpDocument error: ${errorMessage}`,
            level: LogLevel.ERROR,
            exception: helpError
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