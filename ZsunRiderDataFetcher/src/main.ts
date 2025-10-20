/**
 * Handles the install event for the add-on.
 * @param e The Google Sheets onOpen event object.
 */
function onInstall(): void {
    try {
        onOpen();
    } catch (err) {
        Logger.log(`onInstall error: ${err}`);
    }
}

/**
 * Handles the file-scope granted event from the platform.
 * @param e An event object expected to have a string property 'fileId'.
 * @returns A status message string indicating the result of file-scope access grant.
 */
function onFileScopeGranted(e: any): string {
    try {
        const eventStr = JSON.stringify(e);
        Logger.log(`onFileScopeGranted event: %s`, eventStr);

        // Ensure fileId is always a string, never null or undefined
        const fileId = (e && typeof e.fileId === "string") ? e.fileId : "";

        if (!fileId) {
            Logger.log(`onFileScopeGranted: no fileId present in event.`);
            return "File-scoped access granted, but no fileId was supplied by the platform.";
        }

        try {
            const docProps = PropertiesService.getDocumentProperties();
            docProps.setProperty("fileScopeGrantedFileId", fileId);
            Logger.log(`onFileScopeGranted: saved fileId to DocumentProperties.`);
        } catch (propErr) {
            Logger.log(`onFileScopeGranted: failed to save document property: ${propErr}`);
        }

        try {
                onOpen();
        } catch (openErr) {
            Logger.log(`onFileScopeGranted: onOpen failed: ${openErr}`);
        }

        try {
            showSidebar();
        } catch (sbErr) {
            Logger.log(`onFileScopeGranted: showSidebar failed: ${sbErr}`);
        }

        try {
            const ss = SpreadsheetApp.getActiveSpreadsheet();
            if (ss) {
                const toastMsg = `Add-on access to this file has been granted. Use the sidebar to continue.`;
                ss.toast(toastMsg, "Worksheet Refresher", 5);
            }
        } catch (toastErr) {
            Logger.log(`onFileScopeGranted: toast failed: ${toastErr}`);
        }

        const resultMsg = `File-scoped access granted for fileId=${fileId}`;
        return resultMsg;
    } catch (err) {
        Logger.log(`onFileScopeGranted error: ${err}`);
        const errorMsg = err && err.message ? err.message : err;
        throw new Error(`onFileScopeGranted failed: ${errorMsg}`);
    }
}

/**
 * Adds the custom menu to the Google Sheets UI.
     * @param e The Google Sheets onOpen event object.
     */
    function onOpen(): void {
    try {
        const ui = SpreadsheetApp.getUi();
        ui.createMenu("ZSUN Worksheet")
            .addItem("Open Sidebar", "showSidebar")
            .addToUi();
    } catch (err) {
        Logger.log(`onOpen error: ${err}`);
    }
}

/**
 * Shows the add-on sidebar in the Google Sheets UI.
 */
function showSidebar(): void {
    const html = HtmlService.createHtmlOutputFromFile("src/ui/Sidebar")
        .setTitle("Worksheet Refresher")
        .setWidth(320);
    SpreadsheetApp.getUi().showSidebar(html);
}