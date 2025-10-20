"use strict";
function showHelpDocument() {
    try {
        const html = HtmlService.createHtmlOutputFromFile("src/ui/Help")
            .setWidth(760)
            .setHeight(640);
        SpreadsheetApp.getUi().showModalDialog(html, "Help");
    }
    catch (err) {
        throw new Error(`showHelpDocument failed: ${err?.message ?? String(err)}`);
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
/**
 * refreshRiderData - orchestrates fetch -> validate -> write.
 */
function refreshRiderData(fetchFunction, successMessage = null, operationName = "RefreshRiderData", sheetName = "Source") {
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
            showToast(successMessage ?? resultMessage, "Success", 3);
        }
        catch (e) {
            // ignore toast failures
        }
        return { ok: true, message: successMessage ?? resultMessage ?? `${operationName} succeeded.` };
    }
    catch (e) {
        if (isValidationError(e)) {
            return {
                ok: false,
                reason: e.code ?? "validation",
                message: e.message ?? "Validation failed",
                details: e.context ?? null
            };
        }
        try {
            reportError(`${operationName} unexpected error: ${e?.message ?? String(e)}`, operationName, e);
        }
        catch (logErr) {
            // swallow logging failures
        }
        if (!isServerError(e)) {
            throw new ServerError("unexpected_error", e?.message ?? String(e), { original: e });
        }
        throw e;
    }
}
/**
 * processFileContentsAndWriteSheets - parse JSON dictionary and write three sheets
 */
function processFileContentsAndWriteSheets(jsonText, sourceLabel) {
    if (!jsonText || typeof jsonText !== "string") {
        throw new ValidationError("empty_json", `Empty or invalid JSON text from ${sourceLabel}`);
    }
    let dict;
    try {
        dict = JSON.parse(jsonText);
    }
    catch (e) {
        throw new ValidationError("invalid_json", `Failed to parse JSON: ${e?.message ?? String(e)}`, { snippet: (jsonText ?? "").slice(0, 1000) });
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