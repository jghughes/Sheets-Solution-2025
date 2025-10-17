// javascript Sheets01\src\services\DataFetcher.js
// Thin GAS adapters for fetching external resources.
// Designed to be callable in GAS and testable by injecting stubs.

function hasInternetConnection(fetchImpl) {
    // fetchImpl may be a test stub or UrlFetchApp
    const fetcher = fetchImpl || (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null);
    if (!fetcher) return false;
    try {
        const resp = fetcher.fetch ? fetcher.fetch("https://www.google.com", { muteHttpExceptions: true }) : fetcher("https://www.google.com");
        if (typeof resp === "object" && typeof resp.getResponseCode === "function") {
            return resp.getResponseCode() < 500;
        }
        return true;
    } catch (e) {
        return false;
    }
}

function fetchPlainTextFileFromUrl(url, opName, fetchImpl) {
    const fetcher = fetchImpl || (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null);
    if (!fetcher) throw new Error(`${opName || "HttpFetch"} unavailable: no fetch implementation`);
    try {
        const resp = fetcher.fetch ? fetcher.fetch(url) : fetcher(url);
        if (typeof resp === "string") return resp;
        if (resp && typeof resp.getContentText === "function") return resp.getContentText();
        throw new Error("Unexpected fetch response shape");
    } catch (e) {
        throw new Error(`${opName || "HttpFetch"} failed: ${e.message}`);
    }
}

function fetchPlainTextFileFromSharedLinkToGoogleDrive(sharedLink, opName, driveAppImpl, core) {
    // core.extractDriveIdFromSharedLink is a pure utility (in utils) you should implement and test.
    const driveApp = driveAppImpl || (typeof DriveApp !== "undefined" ? DriveApp : null);
    const util = core || (typeof SheetsDataFetcherCore !== "undefined" ? SheetsDataFetcherCore : null);
    if (!driveApp || !util) throw new Error(`${opName || "GoogleDriveFetch"} unavailable: missing DriveApp or core util`);
    try {
        const id = util.extractDriveIdFromSharedLink(sharedLink);
        const file = driveApp.getFileById(id);
        return file.getBlob().getDataAsString();
    } catch (e) {
        throw new Error(`${opName || "GoogleDriveFetch"} failed: ${e.message}`);
    }
}

function fetchPlainTextFileFromMyDrive(filename, opName, driveAppImpl) {
    const driveApp = driveAppImpl || (typeof DriveApp !== "undefined" ? DriveApp : null);
    if (!driveApp) throw new Error(`${opName || "MyDriveFetch"} unavailable: no DriveApp`);
    try {
        const files = driveApp.getFilesByName(filename);
        if (!files.hasNext()) throw new Error("File not found: " + filename);
        const file = files.next();
        return file.getBlob().getDataAsString();
    } catch (e) {
        throw new Error(`${opName || "MyDriveFetch"} failed: ${e.message}`);
    }
}

// Expose API for Node tests and GAS
(function () {
    const API = {
        hasInternetConnection,
        fetchPlainTextFileFromUrl,
        fetchPlainTextFileFromSharedLinkToGoogleDrive,
        fetchPlainTextFileFromMyDrive
    };
    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = API;
        return;
    }
    var __root = (typeof globalThis !== "undefined") ? globalThis : (typeof this !== "undefined" ? this : {});
    __root.SheetsDataFetcher = __root.SheetsDataFetcher || {};
    Object.assign(__root.SheetsDataFetcher, API);
})();