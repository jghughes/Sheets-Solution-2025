"use strict";
function showHelpDocument() {
    var _a;
    try {
        const html = HtmlService.createHtmlOutputFromFile("src/ui/Help")
            .setWidth(760)
            .setHeight(640);
        SpreadsheetApp.getUi().showModalDialog(html, "Help");
    }
    catch (err) {
        throw new Error(`showHelpDocument failed: ${(_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : String(err)}`);
    }
}
function importRidersFromMyDrive(filename) {
    return refreshRiderData(() => fetchPlainTextFileFromMyDrive(filename, "MyDriveFetch"), "Rider data loaded and validated from Google MyDrive.", "MyDriveImport", "Source");
}
function importRidersFromGoogleDriveLink(link) {
    return refreshRiderData(() => fetchPlainTextFileFromSharedLinkToGoogleDrive(link, "GoogleDriveFetch"), "Rider data loaded and validated from specified Google Drive.", "GoogleDriveImport", "Source");
}
function importRidersFromUrl(url) {
    return refreshRiderData(() => fetchPlainTextFileFromUrl(url, "HttpFetch"), "Rider data loaded and validated from specified URL.", "UrlImport", "Source");
}
function refreshRiderData(fetchFunction, successMessage = null, operationName = "RefreshRiderData") {
    var _a, _b, _c, _d, _e, _f;
    if (!hasInternetConnection()) {
        const netErr = new ServerError("no_internet", "No internet connection detected.", null);
        try {
            reportError(`${operationName} failed: ${netErr.message}`, operationName, netErr);
        }
        catch (e) {
            // ignore logging failures
        }
        throw netErr;
    }
    try {
        const text = fetchFunction();
        const resultMessage = processFileContentsAndWriteSheets(text, operationName);
        try {
            showToast(successMessage !== null && successMessage !== void 0 ? successMessage : resultMessage, "Success", 3);
        }
        catch (e) {
            // ignore toast failures
        }
        return { ok: true, message: (_a = successMessage !== null && successMessage !== void 0 ? successMessage : resultMessage) !== null && _a !== void 0 ? _a : `${operationName} succeeded.` };
    }
    catch (e) {
        if (isValidationError(e)) {
            return {
                ok: false,
                reason: (_b = e.code) !== null && _b !== void 0 ? _b : "validation",
                message: (_c = e.message) !== null && _c !== void 0 ? _c : "Validation failed",
                details: (_d = e.context) !== null && _d !== void 0 ? _d : null
            };
        }
        try {
            reportError(`${operationName} unexpected error: ${(_e = e === null || e === void 0 ? void 0 : e.message) !== null && _e !== void 0 ? _e : String(e)}`, operationName, e);
        }
        catch (logErr) {
            // swallow logging failures
        }
        if (!isServerError(e)) {
            throw new ServerError("unexpected_error", (_f = e === null || e === void 0 ? void 0 : e.message) !== null && _f !== void 0 ? _f : String(e), { original: e });
        }
        throw e;
    }
}
function processFileContentsAndWriteSheets(jsonText, sourceLabel) {
    var _a;
    if (!jsonText || typeof jsonText !== "string") {
        throw new ValidationError("empty_json", `Empty or invalid JSON text from ${sourceLabel}`);
    }
    let dict;
    try {
        dict = JSON.parse(jsonText);
    }
    catch (e) {
        throw new ValidationError("invalid_json", `Failed to parse JSON: ${(_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : String(e)}`, { snippet: (jsonText !== null && jsonText !== void 0 ? jsonText : "").slice(0, 1000) });
    }
    if (!dict || typeof dict !== "object" || Array.isArray(dict)) {
        throw new ValidationError("invalid_shape", "Expected top-level object (of type dictionary) mapping zwiftId -> object (of any type)");
    }
    const sourceRiders = dictionaryToArray(dict);
    if (!sourceRiders || sourceRiders.length === 0) {
        throw new ValidationError("no_riders", `No valid entries found in JSON from ${sourceLabel}`);
    }
    writeSourceSheet(sourceRiders, "Source");
    const normalizedRiders = dictionaryToNormalisedArray(dict);
    if (!normalizedRiders || normalizedRiders.length === 0) {
        throw new ValidationError("no_normalised_riders", "No normalised rider items could be produced from JSON");
    }
    writeNormalisedSheet(normalizedRiders, "Normalised");
    const precomputedRiders = dictionaryToPrecomputedArray(normalizedRiders);
    writePrecomputedSheet(precomputedRiders, "Precomputed");
    return `Received ${sourceRiders.length} data records and wrote their offspring to three sheets - Source, Normalised, Precomputed`;
}
//# sourceMappingURL=RiderImporter.Core.js.map