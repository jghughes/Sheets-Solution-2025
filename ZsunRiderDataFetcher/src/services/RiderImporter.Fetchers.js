// Sheets01 / src / services / RidersImporter.Fetchers.js
// Network / Drive fetch helpers and connection strings
// Modernized for Apps Script V8 (ES6+) style

const personalGoogleDriveRidersFilename = "everyone_in_club_ZsunItems_2025_09_22_modern.json";
const publicGoogleDriveRidersFileLink = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";
const azureBlobRidersFileUrl = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";

/**
 * hasInternetConnection - minimal, dependency-injectable check
 */
const hasInternetConnection = (fetchImpl = (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null)) => {
    const fetcher = fetchImpl;
    if (!fetcher) return false;

    try {
        const resp = (typeof fetcher.fetch === "function")
            ? fetcher.fetch("https://www.google.com", { muteHttpExceptions: true })
            : fetcher("https://www.google.com");

        const code = resp?.getResponseCode?.();
        if (typeof code === "number") return code < 500;
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * fetchPlainTextFileFromMyDrive - lookup by filename
 */
const fetchPlainTextFileFromMyDrive = (
    filename,
    opName = "MyDriveFetch",
    driveAppImpl = (typeof DriveApp !== "undefined" ? DriveApp : null)
) => {
    const driveApp = driveAppImpl;
    if (!driveApp) throw new ServerError(`${opName}_unavailable`, `${opName} unavailable: no DriveApp`);

    try {
        const files = driveApp.getFilesByName(filename);
        if (!files.hasNext()) {
            throw new ValidationError("file_not_found", `File not found: ${filename}`, { filename });
        }
        const file = files.next();
        return file.getBlob().getDataAsString();
    } catch (e) {
        if (isValidationError(e)) throw e;
        const msg = e && e.message ? e.message : String(e);
        throw new ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { filename });
    }
};

/**
 * fetchPlainTextFileFromSharedLinkToGoogleDrive - extract id then fetch
 * Depends on SheetsDataFetcherCore.extractDriveIdFromSharedLink if available.
 */
const fetchPlainTextFileFromSharedLinkToGoogleDrive = (
    sharedLink,
    opName = "GoogleDriveFetch",
    driveAppImpl = (typeof DriveApp !== "undefined" ? DriveApp : null),
    coreUtil = (typeof SheetsDataFetcherCore !== "undefined" ? SheetsDataFetcherCore : null)
) => {
    const driveApp = driveAppImpl;
    const util = coreUtil;
    if (!driveApp || !util) throw new ServerError(`${opName}_unavailable`, `${opName} unavailable: missing DriveApp or core util`);

    try {
        const id = util.extractDriveIdFromSharedLink(sharedLink);
        if (!id || typeof id !== "string" || !/[-\w]{10,}/.test(id)) {
            throw new ValidationError("invalid_shared_link", "Invalid Google Drive shared link or missing id", { sharedLink });
        }

        try {
            const file = driveApp.getFileById(id);
            return file.getBlob().getDataAsString();
        } catch (innerErr) {
            const msg = innerErr && innerErr.message ? innerErr.message : String(innerErr);
            if (/not found|no item with the given id|file not found|does not exist/i.test(msg)) {
                throw new ValidationError("file_not_found", "File not found for id extracted from link", { sharedLink, id });
            }
            throw new ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { sharedLink, id });
        }
    } catch (e) {
        if (isValidationError(e)) throw e;
        const msg = e && e.message ? e.message : String(e);
        throw new ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { sharedLink });
    }
};

/**
 * fetchPlainTextFileFromUrl - HTTP(S) fetch with classification of 4xx vs 5xx
 */
const fetchPlainTextFileFromUrl = (
    url,
    opName = "HttpFetch",
    fetchImpl = (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null)
) => {
    const fetcher = fetchImpl;
    if (!fetcher) throw new ServerError(`${opName}_unavailable`, `${opName} unavailable: no fetch implementation`);

    try {
        const resp = (typeof fetcher.fetch === "function")
            ? fetcher.fetch(url, { muteHttpExceptions: true })
            : fetcher(url);

        if (typeof resp === "string") return resp;

        const code = resp?.getResponseCode?.();
        const text = (typeof resp?.getContentText === "function") ? resp.getContentText() : "";

        if (typeof code === "number") {
            if (code >= 400 && code < 500) {
                throw new ValidationError("http_client_error", `HTTP ${code} fetching ${url}`, {
                    url,
                    statusCode: code,
                    responseSnippet: (text || "").slice(0, 1000),
                });
            }
            if (code >= 500) {
                throw new ServerError(`${opName}_failed`, `${opName} failed with HTTP ${code}`, { url, statusCode: code });
            }
            if (typeof resp.getContentText === "function") return resp.getContentText();
            throw new ValidationError("unexpected_fetch_shape", "Unexpected fetch response shape", { url });
        }

        if (resp && typeof resp.getContentText === "function") return resp.getContentText();

        throw new ValidationError("unexpected_fetch_shape", "Unexpected fetch response shape", { url });
    } catch (e) {
        if (isValidationError(e)) throw e;
        const msg = e && e.message ? e.message : String(e);
        throw new ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { url });
    }
};