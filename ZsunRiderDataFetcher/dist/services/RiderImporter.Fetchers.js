"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.azureBlobRidersFileUrl = exports.publicGoogleDriveRidersFileLink = exports.personalGoogleDriveRidersFilename = void 0;
exports.hasInternetConnection = hasInternetConnection;
exports.fetchPlainTextFileFromMyDrive = fetchPlainTextFileFromMyDrive;
exports.fetchPlainTextFileFromSharedLinkToGoogleDrive = fetchPlainTextFileFromSharedLinkToGoogleDrive;
exports.fetchPlainTextFileFromUrl = fetchPlainTextFileFromUrl;
const ErrorUtils_1 = require("../utils/ErrorUtils");
const RemoteHelpers = require("../utils/RemoteHelpers");
/**
 * Default filename for personal Google Drive riders data.
 */
exports.personalGoogleDriveRidersFilename = "everyone_in_club_RiderStatsItems_2025_09_22_modern.json";
/**
 * Public Google Drive file link for riders data.
 */
exports.publicGoogleDriveRidersFileLink = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";
/**
 * Azure Blob Storage URL template for riders data.
 */
exports.azureBlobRidersFileUrl = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";
/**
 * Checks for internet connectivity by attempting to fetch a known URL.
 * @param fetchImpl - Optional fetch implementation (defaults to UrlFetchApp if available).
 * @returns True if internet connection is available, false otherwise.
 */
function hasInternetConnection(fetchImpl = (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null), opName = "InternetCheck") {
    var _a;
    const fetcher = fetchImpl;
    if (!fetcher) {
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.noInternet, "No fetch implementation available for internet connectivity check.", opName, "hasInternetConnection");
    }
    try {
        const resp = (typeof fetcher.fetch === "function")
            ? fetcher.fetch("https://www.google.com", { muteHttpExceptions: true })
            : fetcher("https://www.google.com");
        const code = (_a = resp === null || resp === void 0 ? void 0 : resp.getResponseCode) === null || _a === void 0 ? void 0 : _a.call(resp);
        if (typeof code === "number")
            return code < 500;
        return true;
    }
    catch (err) {
        const msg = err && err.message ? err.message : String(err);
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.noInternet, `Internet connectivity check failed: ${msg}`, opName, "hasInternetConnection");
    }
    // Dummy return to satisfy TypeScript
    return false;
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
function fetchPlainTextFileFromMyDrive(filename, opName = "MyDriveFetch", driveAppImpl = (typeof DriveApp !== "undefined" ? DriveApp : null)) {
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
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `${opName} failed: ${msg}`, opName, "fetchPlainTextFileFromMyDrive", { filename });
    }
    // Dummy return to satisfy TypeScript
    return "";
}
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
function fetchPlainTextFileFromSharedLinkToGoogleDrive(sharedLink, opName = "GoogleDriveFetch", driveAppImpl = (typeof DriveApp !== "undefined" ? DriveApp : null)) {
    const driveApp = driveAppImpl;
    try {
        const id = RemoteHelpers.extractGoogleDriveFileIdFromString(sharedLink);
        if (!id || typeof id !== "string" || !/[-\w]{10,}/.test(id)) {
            (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.invalidFileFormat, "The provided Google Drive link or ID is invalid. Please check and try again.", opName, "fetchPlainTextFileFromSharedLinkToGoogleDrive", { sharedLink });
        }
        try {
            const file = driveApp.getFileById(id);
            return file.getBlob().getDataAsString();
        }
        catch (innerErr) {
            const msg = innerErr && innerErr.message ? innerErr.message : String(innerErr);
            if (/not found|no item with the given id|file not found|does not exist/i.test(msg)) {
                (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.fileNotFound, "File not found. Please check the filename, link, or URL and try again.", opName, "fetchPlainTextFileFromSharedLinkToGoogleDrive", { sharedLink, id });
            }
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `${opName} failed: ${msg}`, opName, "fetchPlainTextFileFromSharedLinkToGoogleDrive", { sharedLink, id });
        }
    }
    catch (err) {
        if ((0, ErrorUtils_1.isValidationError)(err))
            throw err;
        const msg = err && err.message ? err.message : String(err);
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `${opName} failed: ${msg}`, opName, "fetchPlainTextFileFromSharedLinkToGoogleDrive", { sharedLink });
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
 * @param fetchImpl - Optional fetch implementation (defaults to UrlFetchApp if available).
 * @returns The file contents as a string.
 * @throws ValidationError | ServerError
 */
function fetchPlainTextFileFromUrl(url, opName = "HttpFetch", fetchImpl = (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null)) {
    var _a;
    const fetcher = fetchImpl;
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
                (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.fileNotFound, "File not found. Please check the filename, link, or URL and try again.", opName, "fetchPlainTextFileFromUrl", {
                    url,
                    statusCode: code,
                    responseSnippet: (text || "").slice(0, 1000),
                });
            }
            if (code >= 500) {
                (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.serviceUnavailable, `${opName} failed with HTTP ${code}`, opName, "fetchPlainTextFileFromUrl", { url, statusCode: code });
            }
            if (typeof resp.getContentText === "function")
                return resp.getContentText();
            (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.malformedJson, "Unexpected fetch response shape", opName, "fetchPlainTextFileFromUrl", { url });
        }
        if (resp && typeof resp.getContentText === "function")
            return resp.getContentText();
        (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.malformedJson, "Unexpected fetch response shape", opName, "fetchPlainTextFileFromUrl", { url });
    }
    catch (err) {
        if ((0, ErrorUtils_1.isValidationError)(err))
            throw err;
        const msg = err && err.message ? err.message : String(err);
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `${opName} failed: ${msg}`, opName, "fetchPlainTextFileFromUrl", { url });
    }
    // Dummy return to satisfy TypeScript
    return "";
}
//# sourceMappingURL=RiderImporter.Fetchers.js.map