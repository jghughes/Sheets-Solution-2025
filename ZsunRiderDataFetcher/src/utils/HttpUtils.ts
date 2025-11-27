import {
    throwAlertMessageError,
    throwServerErrorWithContext,
    isValidationError,
    serverErrorCode,
    alertMessageErrorCode,
    getErrorMessage,
    toError
} from "./ErrorUtils";

/**
 * Checks for internet connectivity by attempting to fetch a known URL.
 * Throws an AlertMessageError if no connection is available.
 */
export function throwIfNoConnection(): void {
    const opName = "InternetCheck";
    if (typeof UrlFetchApp === "undefined") {
        throwAlertMessageError(
            alertMessageErrorCode.userActionRequired,
            "No internet connection. Please check your network and try again.",
            opName,
            "throwIfNoConnection"
        );
    }

    try {
        // urlFetchApp.fetch(url, params) only supports 'muteHttpExceptions' and 'timeout' in params
        const resp = UrlFetchApp.fetch(
            "https://www.google.com",
            { muteHttpExceptions: true, timeout: 10000 } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions & { timeout?: number }
        );
        const code = resp && typeof resp.getResponseCode === "function" ? resp.getResponseCode() : undefined;
        if (typeof code === "number" && code >= 500) {
            throwAlertMessageError(
                alertMessageErrorCode.userActionRequired,
                "No internet connection detected. Please check your network and try again.",
                opName,
                "throwIfNoConnection"
            );
        }
        // If code is not a number, assume connection is OK
    } catch (err) {
        const msg = getErrorMessage(err);
        logEvent({
            message: "Internet connectivity check failed",
            level: LogLevel.ERROR,
            exception: toError(err),
            extraFields: { opName }
        });
        throwAlertMessageError(
            alertMessageErrorCode.userActionRequired,
            `Internet connectivity check failed: ${msg}`,
            opName,
            "throwIfNoConnection"
        );
    }
}

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
export function fetchTextFileFromUrl(
    url: string,
    maxRetries: number = 2,
    timeoutMs: number = 30000
): string {
    const opName = "HttpFetch";

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const resp = UrlFetchApp.fetch(
                url,
                { muteHttpExceptions: true, timeout: timeoutMs } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions & { timeout?: number }
            );

            const code = resp && typeof resp.getResponseCode === "function" ? resp.getResponseCode() : undefined;
            const text = typeof resp.getContentText === "function" ? resp.getContentText() : "";

            if (typeof code === "number") {
                if (code >= 400 && code < 500) {
                    throwAlertMessageError(
                        alertMessageErrorCode.userActionRequired,
                        "File not found. Please check the filename, link, or URL and try again.",
                        opName,
                        "getTextFromUrl",
                        { url, statusCode: code, responseSnippet: (text || "").slice(0, 1000) }
                    );
                }
                if (code >= 500) {
                    throwServerErrorWithContext(
                        serverErrorCode.serviceUnavailable,
                        `${opName} failed with HTTP ${code}`,
                        opName,
                        "getTextFromUrl",
                        { url, statusCode: code }
                    );
                }
                if (typeof resp.getContentText === "function") return resp.getContentText();
                throwAlertMessageError(
                    alertMessageErrorCode.userActionRequired,
                    "Unexpected fetch response shape. Please check the URL and try again.",
                    opName,
                    "getTextFromUrl",
                    { url }
                );
            }

            if (resp && typeof resp.getContentText === "function") return resp.getContentText();

            throwAlertMessageError(
                alertMessageErrorCode.userActionRequired,
                "Unexpected http response shape. Please check the URL and try again.",
                opName,
                "getTextFromUrl",
                { url }
            );
        } catch (err) {
            const msg = getErrorMessage(err);
            const isTimeout = msg.toLowerCase().includes("timeout");
            logEvent({
                message: `Attempt ${attempt} failed in fetchTextFileFromUrl${isTimeout ? " (timeout)" : ""}`,
                level: LogLevel.ERROR,
                exception: toError(err),
                extraFields: { url, opName, attempt }
            });

            if (isTimeout && attempt < maxRetries) continue;
            if (isValidationError(err)) throw err;
            throwServerErrorWithContext(
                serverErrorCode.unexpectedError,
                `${opName} failed: ${msg}`,
                opName,
                "getTextFromUrl",
                { url, attempt }
            );
        }
    }

    throwAlertMessageError(
        alertMessageErrorCode.userActionRequired,
        `Failed to fetch file from URL after ${maxRetries} attempts. Please try again later.`,
        opName,
        "fetchTextFileFromUrl",
        { url }
    );
    return "";
}