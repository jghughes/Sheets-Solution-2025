"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwIfNoConnection = throwIfNoConnection;
exports.readFileFromMyDrive = readFileFromMyDrive;
exports.readFileFromGoogleDrive = readFileFromGoogleDrive;
exports.readFileFromUrl = readFileFromUrl;
const ErrorUtils_1 = require("./ErrorUtils");
/**
 * Checks for internet connectivity by attempting to fetch a known URL.
 * @param fetchImpl - Optional fetch implementation (defaults to UrlFetchApp if available).
 * @returns True if internet connection is available, false otherwise.
 */
function throwIfNoConnection() {
    var _a;
    // Use UrlFetchApp directly, assuming it's available in the environment
    const fetcher = (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null);
    const opName = "InternetCheck";
    if (!fetcher) {
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.noInternet, "No fetch implementation available for internet connectivity check.", opName, "throwIfNoConnection");
    }
    try {
        const resp = fetcher.fetch("https://www.google.com", { muteHttpExceptions: true });
        const code = (_a = resp === null || resp === void 0 ? void 0 : resp.getResponseCode) === null || _a === void 0 ? void 0 : _a.call(resp);
        if (typeof code === "number" && code >= 500) {
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.noInternet, "No internet connection detected.", opName, "throwIfNoConnection");
        }
        // If code is not a number, assume connection is OK
    }
    catch (err) {
        const msg = err && err.message ? err.message : String(err);
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.noInternet, `Internet connectivity check failed: ${msg}`, opName, "throwIfNoConnection");
    }
}
/**
 * Fetches a plain text file from the user's Google Drive by filename.
 * Throws a validation error if the file is not found, or a server error if DriveApp is unavailable.
 * @param filename - The name of the file to fetch.
 * @param opName - Optional operation name for error context.
 * @param driveAppImpl - Optional DriveApp implementation (defaults to DriveApp if available).
 * @returns The file contents as a string.
 * @throws ValidationError | ServerError
 */
function readFileFromMyDrive(filename, opName = "MyDriveGetBlob", driveAppImpl = (typeof DriveApp !== "undefined" ? DriveApp : null)) {
    const driveApp = driveAppImpl;
    if (!driveApp) {
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.noInternet, `${opName} unavailable: no DriveApp`, opName, "fetchPlainTextFileFromMyDrive", { filename });
    }
    try {
        const files = driveApp.getFilesByName(filename);
        if (!files.hasNext()) {
            (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.fileNotFound, "File not found. Please check the filename, link, or URL and try again.", opName, "fetchPlainTextFileFromMyDrive", { filename });
        }
        const file = files.next();
        return file.getBlob().getDataAsString();
    }
    catch (err) {
        if ((0, ErrorUtils_1.isValidationError)(err))
            throw err;
        const msg = err && err.message ? err.message : String(err);
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `${opName} failed: ${msg}`, opName, "getTextFromMyDrive", { filename });
    }
    // Dummy return to satisfy TypeScript
    return "";
}
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
function readFileFromGoogleDrive(fileId, opName = "GoogleDriveGetBlob", driveAppImpl = (typeof DriveApp !== "undefined" ? DriveApp : null)) {
    const driveApp = driveAppImpl;
    try {
        if (!fileId || typeof fileId !== "string" || !/[-\w]{10,}/.test(fileId)) {
            (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.invalidFileFormat, "The provided Google Drive fileID is invalid. Please check and try again.", opName, "GoogleDriveGetBlob", { fileId });
        }
        try {
            const file = driveApp.getFileById(fileId);
            return file.getBlob().getDataAsString();
        }
        catch (innerErr) {
            const msg = innerErr && innerErr.message ? innerErr.message : String(innerErr);
            if (/not found|no item with the given id|file not found|does not exist/i.test(msg)) {
                (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.fileNotFound, "File not found. Please check the fileID and try again.", opName, "readFileFromGoogleDrive", { fileId });
            }
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `${opName} failed: ${msg}`, opName, "readFileFromGoogleDrive", { fileId });
        }
    }
    catch (err) {
        if ((0, ErrorUtils_1.isValidationError)(err))
            throw err;
        const msg = err && err.message ? err.message : String(err);
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `${opName} failed: ${msg}`, opName, "fetchPlainTextFileFromSharedLinkToGoogleDrive", { fileId });
    }
    // Dummy return to satisfy TypeScript
    return "";
}
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
function readFileFromUrl(url, opName = "HttpFetch", fetchAppImpl = (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null)) {
    var _a;
    const fetcher = fetchAppImpl;
    try {
        const resp = (typeof fetcher.fetch === "function")
            ? fetcher.fetch(url, { muteHttpExceptions: true })
            : fetcher(url);
        if (typeof resp === "string")
            return resp;
        const code = (_a = resp === null || resp === void 0 ? void 0 : resp.getResponseCode) === null || _a === void 0 ? void 0 : _a.call(resp);
        const text = (typeof (resp === null || resp === void 0 ? void 0 : resp.getContentText) === "function") ? resp.getContentText() : "";
        if (typeof code === "number") {
            if (code >= 400 && code < 500) {
                (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.fileNotFound, "File not found. Please check the filename, link, or URL and try again.", opName, "getTextFromUrl", {
                    url,
                    statusCode: code,
                    responseSnippet: (text || "").slice(0, 1000),
                });
            }
            if (code >= 500) {
                (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.serviceUnavailable, `${opName} failed with HTTP ${code}`, opName, "getTextFromUrl", { url, statusCode: code });
            }
            if (typeof resp.getContentText === "function")
                return resp.getContentText();
            (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.malformedJson, "Unexpected fetch response shape", opName, "getTextFromUrl", { url });
        }
        if (resp && typeof resp.getContentText === "function")
            return resp.getContentText();
        (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.malformedJson, "Unexpected http response shape", opName, "getTextFromUrl", { url });
    }
    catch (err) {
        if ((0, ErrorUtils_1.isValidationError)(err))
            throw err;
        const msg = err && err.message ? err.message : String(err);
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `${opName} failed: ${msg}`, opName, "getTextFromUrl", { url });
    }
    // Dummy return to satisfy TypeScript
    return "";
}
//# sourceMappingURL=FileUtils.js.map