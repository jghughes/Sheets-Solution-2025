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
 * @param maxRetries - Maximum number of retry attempts (default: 2).
 * @param timeoutMs - Timeout in milliseconds for each request (default: 30000).
 * @returns The file contents as a string.
 * @throws AlertMessageError | ServerError
 */
export declare function fetchTextFileFromUrl(url: string, maxRetries?: number, timeoutMs?: number): string;
//# sourceMappingURL=HttpUtils.d.ts.map