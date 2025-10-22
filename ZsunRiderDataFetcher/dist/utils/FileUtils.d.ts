/**
 * Type for fetch implementation, supporting both object and function forms.
 */
export type FetchAppType = {
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
export declare function throwIfNoConnection(): void;
/**
 * Fetches a plain text file from the user's Google Drive by filename.
 * Throws a validation error if the file is not found, or a server error if DriveApp is unavailable.
 * @param filename - The name of the file to fetch.
 * @param opName - Optional operation name for error context.
 * @param driveAppImpl - Optional DriveApp implementation (defaults to DriveApp if available).
 * @returns The file contents as a string.
 * @throws ValidationError | ServerError
 */
export declare function readFileFromMyDrive(filename: string, opName?: string, driveAppImpl?: DriveAppType): string;
/**
 * Fetches a plain text file from a shared Google Drive link.
 * Extracts the file ID from the link and retrieves the file.
 * Throws a validation error if the link or file is invalid, or a server error for unexpected issues.
 * @param fileId - The shared Google Drive link.
 * @param opName - Optional operation name for error context.
 * @param driveAppImpl - Optional DriveApp implementation (defaults to DriveApp if available).
 * @returns The file contents as a string.
 * @throws ValidationError | ServerError
 */
export declare function readFileFromGoogleDrive(fileId: string, opName?: string, driveAppImpl?: DriveAppType): string;
/**
 * Fetches a plain text file from a given URL using the provided fetch implementation.
 * Handles HTTP errors and unexpected response shapes.
 * Throws a validation error for client errors or malformed responses, and a server error for server-side issues.
 * @param url - The URL to fetch.
 * @param opName - Optional operation name for error context.
 * @param fetchAppImpl - Optional fetch implementation (defaults to UrlFetchApp if available).
 * @returns The file contents as a string.
 * @throws ValidationError | ServerError
 */
export declare function readFileFromUrl(url: string, opName?: string, fetchAppImpl?: FetchAppType): string;
//# sourceMappingURL=FileUtils.d.ts.map