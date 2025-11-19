/**
 * Checks for internet connectivity by attempting to fetch a known URL.
 * Throws an AlertMessageError if no connection is available.
 */
export declare function throwIfNoConnection(urlFetchApp?: GoogleAppsScript.URL_Fetch.UrlFetchApp): void;
/**
 * Fetches a plain text file from a given URL using UrlFetchApp.
 * Handles HTTP errors, timeouts, and unexpected response shapes.
 * If a timeout occurs, logs the error and notifies the user.
 * @param url - The URL to fetch.
 * @param urlFetchApp - The UrlFetchApp implementation.
 * @returns The file contents as a string.
 * @throws AlertMessageError | ServerError
 */
export declare function fetchTextFileFromUrl(url: string, urlFetchApp?: GoogleAppsScript.URL_Fetch.UrlFetchApp): string;
//# sourceMappingURL=HttpUtils.d.ts.map