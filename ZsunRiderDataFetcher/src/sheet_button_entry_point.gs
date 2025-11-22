function entry_pointButton_onClick() {
    var message = globalThis.importRidersFromUrl();
    SpreadsheetApp.getActiveSpreadsheet().toast(message, "Import Complete", 5);
}