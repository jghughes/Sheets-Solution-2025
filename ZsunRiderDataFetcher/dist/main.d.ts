/**
 * Handles the install event for the add-on.
 * @param e The Google Sheets onOpen event object.
 */
declare function onInstall(): void;
/**
 * Handles the file-scope granted event from the platform.
 * @param e An event object expected to have a string property 'fileId'.
 * @returns A status message string indicating the result of file-scope access grant.
 */
declare function onFileScopeGranted(e: any): string;
/**
 * Adds the custom menu to the Google Sheets UI.
     * @param e The Google Sheets onOpen event object.
     */
declare function onOpen(): void;
/**
 * Shows the add-on sidebar in the Google Sheets UI.
 */
declare function showSidebar(): void;
//# sourceMappingURL=main.d.ts.map