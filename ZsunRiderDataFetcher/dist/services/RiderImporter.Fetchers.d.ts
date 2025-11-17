/**
 * Default filename for personal Google Drive riders data.
 */
export declare const personalGoogleDriveRidersFilename = "everyone_in_club_RiderStatsItems_2025_09_22_modern.json";
/**
 * Public Google Drive file link for riders data.
 */
export declare const publicGoogleDriveRidersFileLink = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";
/**
 * Azure Blob Storage URL template for riders data.
 */
export declare const azureBlobRidersFileUrl = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";
/**
 * Type for fetch implementation, supporting both object and function forms.
 */
export type FetchImpl = {
    fetch: (url: string, options?: any) => any;
} | ((url: string, options?: any) => any) | null;
/**
 * Type for DriveApp implementation, supporting file retrieval by name or ID.
 */
export type DriveAppType = {
    getFilesByName: (filename: string) => any;
    getFileById: (id: string) => any;
} | null;
/**
 * Checks for internet connectivity by attempting to fetch a known URL.
 * @param fetchImpl - Optional fetch implementation (defaults to UrlFetchApp if available).
 * @returns True if internet connection is available, false otherwise.
 */
export declare function hasInternetConnection(fetchImpl?: FetchImpl, opName?: string): boolean;
/**
 * Fetches a plain text file from the user's Google Drive by filename.
 * Throws a validation error if the file is not found, or a server error if DriveApp is unavailable.
 * @param filename - The name of the file to fetch.
 * @param opName - Optional operation name for error context.
 * @param driveAppImpl - Optional DriveApp implementation (defaults to DriveApp if available).
 * @returns The file contents as a string.
 * @throws ValidationError | ServerError
 */
export declare function fetchPlainTextFileFromMyDrive(filename: string, opName?: string, driveAppImpl?: DriveAppType): string;
/**
 * Fetches a plain text file from a shared Google Drive link.
 * Extracts the file ID from the link and retrieves the file.
 * Throws a validation error if the link or file is invalid, or a server error for unexpected issues.
 * @param sharedLink - The shared Google Drive link.
 * @param opName - Optional operation name for error context.
 * @param driveAppImpl - Optional DriveApp implementation (defaults to DriveApp if available).
 * @returns The file contents as a string.
 * @throws ValidationError | ServerError
 */
export declare function fetchPlainTextFileFromSharedLinkToGoogleDrive(sharedLink: string, opName?: string, driveAppImpl?: DriveAppType): string;
/**
 * Fetches a plain text file from a given URL using the provided fetch implementation.
 * Handles HTTP errors and unexpected response shapes.
 * Throws a validation error for client errors or malformed responses, and a server error for server-side issues.
 * @param url - The URL to fetch.
 * @param opName - Optional operation name for error context.
 * @param fetchImpl - Optional fetch implementation (defaults to UrlFetchApp if available).
 * @returns The file contents as a string.
 * @throws ValidationError | ServerError
 */
export declare function fetchPlainTextFileFromUrl(url: string, opName?: string, fetchImpl?: FetchImpl): string;
//# sourceMappingURL=RiderImporter.Fetchers.d.ts.map