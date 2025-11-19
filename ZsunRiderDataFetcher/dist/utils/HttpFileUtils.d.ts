/**
 * Checks for internet connectivity by attempting to fetch a known URL.
 * Throws an AlertMessageError if no connection is available.
 */
export declare function throwIfNoConnection(): void;
/**
 * Fetches a plain text file from a given URL using UrlFetchApp.
 * Handles HTTP errors, timeouts, and unexpected response shapes.
 * If a timeout occurs, logs the error and notifies the user.
 * @param url - The URL to fetch.
 * @returns The file contents as a string.
 * @throws AlertMessageError | ServerError
 */
export declare function fetchTextFileFromUrl(url: string, fetchImpl?: (url: string, params: object) => any): string;
//# sourceMappingURL=HttpFileUtils.d.ts.map