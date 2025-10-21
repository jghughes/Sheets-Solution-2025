"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RiderImporter_Errors_1 = require("./RiderImporter.Errors");
const personalGoogleDriveRidersFilename = "everyone_in_club_ZsunItems_2025_09_22_modern.json";
const publicGoogleDriveRidersFileLink = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";
const azureBlobRidersFileUrl = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";
const hasInternetConnection = (fetchImpl = (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null)) => {
    var _a;
    const fetcher = fetchImpl;
    if (!fetcher)
        return false;
    try {
        const resp = (typeof fetcher.fetch === "function")
            ? fetcher.fetch("https://www.google.com", { muteHttpExceptions: true })
            : fetcher("https://www.google.com");
        const code = (_a = resp === null || resp === void 0 ? void 0 : resp.getResponseCode) === null || _a === void 0 ? void 0 : _a.call(resp);
        if (typeof code === "number")
            return code < 500;
        return true;
    }
    catch (e) {
        return false;
    }
};
const fetchPlainTextFileFromMyDrive = (filename, opName = "MyDriveFetch", driveAppImpl = (typeof DriveApp !== "undefined" ? DriveApp : null)) => {
    const driveApp = driveAppImpl;
    if (!driveApp)
        throw new RiderImporter_Errors_1.ServerError(`${opName}_unavailable`, `${opName} unavailable: no DriveApp`);
    try {
        const files = driveApp.getFilesByName(filename);
        if (!files.hasNext()) {
            throw new RiderImporter_Errors_1.ValidationError("file_not_found", `File not found: ${filename}`, { filename });
        }
        const file = files.next();
        return file.getBlob().getDataAsString();
    }
    catch (e) {
        if ((0, RiderImporter_Errors_1.isValidationError)(e))
            throw e;
        const msg = e && e.message ? e.message : String(e);
        throw new RiderImporter_Errors_1.ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { filename });
    }
};
const fetchPlainTextFileFromSharedLinkToGoogleDrive = (sharedLink, opName = "GoogleDriveFetch", driveAppImpl = (typeof DriveApp !== "undefined" ? DriveApp : null)) => {
    const driveApp = driveAppImpl;
    try {
        const id = extractDriveIdFromSharedLink(sharedLink);
        if (!id || typeof id !== "string" || !/[-\w]{10,}/.test(id)) {
            throw new RiderImporter_Errors_1.ValidationError("invalid_shared_link", "Invalid Google Drive shared link or missing id", { sharedLink });
        }
        try {
            const file = driveApp.getFileById(id);
            return file.getBlob().getDataAsString();
        }
        catch (innerErr) {
            const msg = innerErr && innerErr.message ? innerErr.message : String(innerErr);
            if (/not found|no item with the given id|file not found|does not exist/i.test(msg)) {
                throw new RiderImporter_Errors_1.ValidationError("file_not_found", "File not found for id extracted from link", { sharedLink, id });
            }
            throw new RiderImporter_Errors_1.ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { sharedLink, id });
        }
    }
    catch (e) {
        if ((0, RiderImporter_Errors_1.isValidationError)(e))
            throw e;
        const msg = e && e.message ? e.message : String(e);
        throw new RiderImporter_Errors_1.ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { sharedLink });
    }
};
const fetchPlainTextFileFromUrl = (url, opName = "HttpFetch", fetchImpl = (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null)) => {
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
                throw new RiderImporter_Errors_1.ValidationError("http_client_error", `HTTP ${code} fetching ${url}`, {
                    url,
                    statusCode: code,
                    responseSnippet: (text || "").slice(0, 1000),
                });
            }
            if (code >= 500) {
                throw new RiderImporter_Errors_1.ServerError(`${opName}_failed`, `${opName} failed with HTTP ${code}`, { url, statusCode: code });
            }
            if (typeof resp.getContentText === "function")
                return resp.getContentText();
            throw new RiderImporter_Errors_1.ValidationError("unexpected_fetch_shape", "Unexpected fetch response shape", { url });
        }
        if (resp && typeof resp.getContentText === "function")
            return resp.getContentText();
        throw new RiderImporter_Errors_1.ValidationError("unexpected_fetch_shape", "Unexpected fetch response shape", { url });
    }
    catch (e) {
        if ((0, RiderImporter_Errors_1.isValidationError)(e))
            throw e;
        const msg = e && e.message ? e.message : String(e);
        throw new RiderImporter_Errors_1.ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { url });
    }
};
function extractDriveIdFromSharedLink(sharedLink) {
    // Regular expression to extract the file ID from a Google Drive shared link
    const regex = /[-\w]{25,}/;
    const match = sharedLink.match(regex);
    return match ? match[0] : ""; // Return the file ID or null if not found
}
//# sourceMappingURL=RiderImporter.Fetchers.js.map