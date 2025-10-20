"use strict";
/**
 * App entry / UI bootstrap:
 * - showSidebar (add-on homepage trigger as declared in appsscript.json)
 * - showHelpDocument (called from client)
 */
function showSidebar() {
    // Ensure the string below matches the Apps Script project file name for your sidebar HTML.
    // If your html file in the project is named "Sidebar", use "Sidebar".
    const html = HtmlService.createHtmlOutputFromFile("src/ui/Sidebar")
        .setTitle("Worksheet Refresher")
        .setWidth(320);
    SpreadsheetApp.getUi().showSidebar(html);
}
//# sourceMappingURL=AppEntry.js.map