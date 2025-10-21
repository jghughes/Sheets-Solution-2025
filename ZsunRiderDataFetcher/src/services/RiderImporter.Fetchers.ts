import {
    ValidationError,
    ServerError,
    throwServerError,
    isValidationError,
    isServerError
} from "./RiderImporter.Errors";
import RemoteHelpers = require("../utils/RemoteHelpers");

export const personalGoogleDriveRidersFilename = "everyone_in_club_ZsunItems_2025_09_22_modern.json";
export const publicGoogleDriveRidersFileLink = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";
export const azureBlobRidersFileUrl = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";

type FetchImpl = { fetch: (url: string, options?: any) => any } | ((url: string, options?: any) => any) | null;
type DriveAppType = {
    getFilesByName: (filename: string) => any;
    getFileById: (id: string) => any;
} | null;

export function hasInternetConnection(fetchImpl: FetchImpl = (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null)): boolean {
    const fetcher = fetchImpl;
    if (!fetcher) return false;

    try {
        const resp = (typeof (fetcher as any).fetch === "function")
            ? (fetcher as any).fetch("https://www.google.com", { muteHttpExceptions: true })
            : (fetcher as any)("https://www.google.com");

        const code = resp?.getResponseCode?.();
        if (typeof code === "number") return code < 500;
        return true;
    } catch (err) {
        return false;
    }
}

export function fetchPlainTextFileFromMyDrive(
    filename: string,
    opName: string = "MyDriveFetch",
    driveAppImpl: DriveAppType = (typeof DriveApp !== "undefined" ? DriveApp : null)
): string {
    const driveApp = driveAppImpl;
    if (!driveApp) throw new ServerError(`${opName}_unavailable`, `${opName} unavailable: no DriveApp`, { filename });

    try {
        const files = driveApp.getFilesByName(filename);
        if (!files.hasNext()) {
            throw new ValidationError("file_not_found", `File not found: ${filename}`, { filename });
        }
        const file = files.next();
        return file.getBlob().getDataAsString();
    } catch (err) {
        if (isValidationError(err)) throw err;
        const msg = err && err.message ? err.message : String(err);
        throw new ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { filename });
    }
}

export function fetchPlainTextFileFromSharedLinkToGoogleDrive(
    sharedLink: string,
    opName: string = "GoogleDriveFetch",
    driveAppImpl: DriveAppType = (typeof DriveApp !== "undefined" ? DriveApp : null)
): string {
    const driveApp = driveAppImpl;

    try {
        const id = RemoteHelpers.extractGoogleDriveFileIdFromString(sharedLink);
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
    } catch (err) {
        if (isValidationError(err)) throw err;
        const msg = err && err.message ? err.message : String(err);
        throw new ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { sharedLink });
    }
}

export function fetchPlainTextFileFromUrl(
    url: string,
    opName: string = "HttpFetch",
    fetchImpl: FetchImpl = (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null)
): string {
    const fetcher = fetchImpl;

    try {
        const resp = (typeof (fetcher as any).fetch === "function")
            ? (fetcher as any).fetch(url, { muteHttpExceptions: true })
            : (fetcher as any)(url);

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
    } catch (err) {
        if (isValidationError(err)) throw err;
        const msg = err && err.message ? err.message : String(err);
        throw new ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { url });
    }
}

