declare function showHelpDocument(): void;
declare function importRidersFromMyDrive(filename: any): {
    ok: boolean;
    message: string;
    reason?: never;
    details?: never;
} | {
    ok: boolean;
    reason: any;
    message: any;
    details: any;
};
declare function importRidersFromGoogleDriveLink(link: any): {
    ok: boolean;
    message: string;
    reason?: never;
    details?: never;
} | {
    ok: boolean;
    reason: any;
    message: any;
    details: any;
};
declare function importRidersFromUrl(url: any): {
    ok: boolean;
    message: string;
    reason?: never;
    details?: never;
} | {
    ok: boolean;
    reason: any;
    message: any;
    details: any;
};
/**
 * refreshRiderData - orchestrates fetch -> validate -> write.
 */
declare function refreshRiderData(fetchFunction: any, successMessage?: null, operationName?: string, sheetName?: string): {
    ok: boolean;
    message: string;
    reason?: never;
    details?: never;
} | {
    ok: boolean;
    reason: any;
    message: any;
    details: any;
};
/**
 * processFileContentsAndWriteSheets - parse JSON dictionary and write three sheets
 */
declare function processFileContentsAndWriteSheets(jsonText: any, sourceLabel: any): string;
//# sourceMappingURL=RiderImporter.Core.d.ts.map