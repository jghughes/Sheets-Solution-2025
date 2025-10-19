/**
 * App lifecycle handlers:
 * - onInstall, onOpen, onFileScopeGranted
 *
 * These are top-level lifecycle functions. Leave names unchanged so the
 * manifest triggers continue to work.
 */
 
// Runs when the add-on is installed. Ensure menus are created for the user.
function onInstall(e) {
    try {
        // Best practice: call onOpen so the menu is available immediately after install.
        onOpen(e);
    } catch (err) {
        Logger.log("onInstall error: " + err);
    }
}

/**
 * Called by the platform when a user grants file-scoped access to this add-on.
 * - Records the granted fileId into Document Properties so server-side functions can access it.
 * - Rebuilds menus (via onOpen) and opens the sidebar so the user can continue.
 *
 * Do NOT call DriveApp write APIs here if you want to avoid Drive write/broad access.
 *
 * @param {Object} e event object containing at least {fileId: string} when file-scoped access is granted
 * @returns {string} status message
 */
function onFileScopeGranted(e) {
    try {
        Logger.log("onFileScopeGranted event: %s", JSON.stringify(e));
        var fileId = null;
        if (e && typeof e === "object") {
            // event may contain fileId at top-level
            fileId = e.fileId || e['fileId'] || null;
        }

        if (!fileId) {
            Logger.log("onFileScopeGranted: no fileId present in event.");
            return "File-scoped access granted, but no fileId was supplied by the platform.";
        }

        // Persist fileId to document-scoped properties (available only for this spreadsheet)
        try {
            var docProps = PropertiesService.getDocumentProperties();
            docProps.setProperty("fileScopeGrantedFileId", fileId);
            Logger.log("onFileScopeGranted: saved fileId to DocumentProperties.");
        } catch (propErr) {
            Logger.log("onFileScopeGranted: failed to save document property: " + propErr);
            // Not fatal — continue to surface UI changes
        }

        // Recreate menus for immediate availability after grant
        try {
            onOpen(); // safe: onOpen already guards against unexpected errors
        } catch (openErr) {
            Logger.log("onFileScopeGranted: onOpen failed: " + openErr);
        }

        // Open the sidebar so the user can act on the newly granted access immediately
        try {
            showSidebar();
        } catch (sbErr) {
            Logger.log("onFileScopeGranted: showSidebar failed: " + sbErr);
        }

        // Friendly toast to the user
        try {
            var ss = SpreadsheetApp.getActiveSpreadsheet();
            if (ss) {
                ss.toast("Add-on access to this file has been granted. Use the sidebar to continue.", "Worksheet Refresher", 5);
            }
        } catch (toastErr) {
            Logger.log("onFileScopeGranted: toast failed: " + toastErr);
        }

        return "File-scoped access granted for fileId=" + fileId;
    } catch (err) {
        Logger.log("onFileScopeGranted error: " + err);
        throw new Error("onFileScopeGranted failed: " + (err && err.message ? err.message : err));
    }
}

/**
 * Runs when a spreadsheet is opened. Adds a menu to let users open the sidebar.
 * @param {Object} e event object (unused)
 */
function onOpen(e) {
    try {
        const ui = SpreadsheetApp.getUi();
        ui.createMenu("ZSUN Worksheet")
            .addItem("Open Sidebar", "showSidebar")
            .addToUi();
    } catch (err) {
        // Avoid failing silently when called as an install-time trigger in some contexts
        Logger.log("onOpen error: " + err);
    }
}