"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorUtils_1 = require("./utils/ErrorUtils");
/**
 * Handles the onInstall event for the add-on.
 * Throws structured errors and logs failures.
 */
function onInstall() {
    try {
        onOpen();
    }
    catch (err) {
        const message = err && err.message ? err.message : String(err);
        Logger.log(`onInstall error: ${message}`);
        if ((0, ErrorUtils_1.isValidationError)(err))
            throw err;
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `onInstall failed: ${message}`, "onInstall", "onInstall", {});
    }
    // Defensive: should never be reached, but satisfies TypeScript
    throw new Error("Unreachable code in onInstall");
}
/**
 * Handles the file-scope granted event from the platform.
 * Throws structured errors and logs failures.
 * @param e An event object expected to have a string property 'fileId'.
 * @returns A status message string indicating the result of file-scope access grant.
 */
function onFileScopeGranted(e) {
    try {
        const eventStr = JSON.stringify(e);
        Logger.log(`onFileScopeGranted event: %s`, eventStr);
        // Ensure fileId is always a string, never null or undefined
        const fileId = (e && typeof e.fileId === "string") ? e.fileId : "";
        if (!fileId) {
            Logger.log(`onFileScopeGranted: no fileId present in event.`);
            (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.missingRequiredField, "No fileId present in event.", "onFileScopeGranted", "onFileScopeGranted", { event: e });
        }
        try {
            const docProps = PropertiesService.getDocumentProperties();
            docProps.setProperty("fileScopeGrantedFileId", fileId);
            Logger.log(`onFileScopeGranted: saved fileId to DocumentProperties.`);
        }
        catch (propErr) {
            const message = propErr && propErr.message ? propErr.message : String(propErr);
            Logger.log(`onFileScopeGranted: failed to save document property: ${message}`);
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `Failed to save document property: ${message}`, "onFileScopeGranted", "onFileScopeGranted", { fileId });
        }
        try {
            onOpen();
        }
        catch (openErr) {
            const message = openErr && openErr.message ? openErr.message : String(openErr);
            Logger.log(`onFileScopeGranted: onOpen failed: ${message}`);
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `onOpen failed: ${message}`, "onFileScopeGranted", "onOpen", { fileId });
        }
        try {
            showSidebar();
        }
        catch (sbErr) {
            const message = sbErr && sbErr.message ? sbErr.message : String(sbErr);
            Logger.log(`onFileScopeGranted: showSidebar failed: ${message}`);
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `showSidebar failed: ${message}`, "onFileScopeGranted", "showSidebar", { fileId });
        }
        try {
            const ss = SpreadsheetApp.getActiveSpreadsheet();
            if (ss) {
                const toastMsg = `Add-on access to this file has been granted. Use the sidebar to continue.`;
                ss.toast(toastMsg, "Worksheet Refresher", 5);
            }
        }
        catch (toastErr) {
            const message = toastErr && toastErr.message ? toastErr.message : String(toastErr);
            Logger.log(`onFileScopeGranted: toast failed: ${message}`);
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `Toast failed: ${message}`, "onFileScopeGranted", "toast", { fileId });
        }
        const resultMsg = `File-scoped access granted for fileId=${fileId}`;
        return resultMsg;
    }
    catch (err) {
        const message = err && err.message ? err.message : String(err);
        Logger.log(`onFileScopeGranted error: ${message}`);
        if ((0, ErrorUtils_1.isValidationError)(err))
            throw err;
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `onFileScopeGranted failed: ${message}`, "onFileScopeGranted", "onFileScopeGranted", { event: e });
    }
    // Defensive: should never be reached, but satisfies TypeScript
    throw new Error("Unreachable code in onFileScopeGranted");
}
/**
 * Adds the custom menu to the Google Sheets UI.
 * Throws structured errors and logs failures.
 */
function onOpen() {
    try {
        const ui = SpreadsheetApp.getUi();
        ui.createMenu("ZSUN Worksheet")
            .addItem("Open Sidebar", "showSidebar")
            .addToUi();
    }
    catch (err) {
        const message = err && err.message ? err.message : String(err);
        Logger.log(`onOpen error: ${message}`);
        if ((0, ErrorUtils_1.isValidationError)(err))
            throw err;
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `onOpen failed: ${message}`, "onOpen", "onOpen", {});
    }
    // Defensive: should never be reached, but satisfies TypeScript
    throw new Error("Unreachable code in onOpen");
}
/**
 * Shows the add-on sidebar in the Google Sheets UI.
 * Throws structured errors and logs failures.
 */
function showSidebar() {
    try {
        const html = HtmlService.createHtmlOutputFromFile("src/ui/Sidebar")
            .setTitle("Worksheet Refresher")
            .setWidth(320);
        SpreadsheetApp.getUi().showSidebar(html);
    }
    catch (err) {
        const message = err && err.message ? err.message : String(err);
        Logger.log(`showSidebar error: ${message}`);
        if ((0, ErrorUtils_1.isValidationError)(err))
            throw err;
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `showSidebar failed: ${message}`, "showSidebar", "showSidebar", {});
    }
    // Defensive: should never be reached, but satisfies TypeScript
    throw new Error("Unreachable code in showSidebar");
}
//# sourceMappingURL=main.js.map