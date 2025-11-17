"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showHelpDocument = showHelpDocument;
exports.importRidersFromMyDrive = importRidersFromMyDrive;
exports.importRidersFromGoogleDriveLink = importRidersFromGoogleDriveLink;
exports.importRidersFromUrl = importRidersFromUrl;
exports.refreshRiderData = refreshRiderData;
exports.processFileContentsAndWriteSheets = processFileContentsAndWriteSheets;
const RiderImporter_Fetchers_1 = require("./RiderImporter.Fetchers");
const ErrorUtils_1 = require("../utils/ErrorUtils");
const JghSerialisation_1 = require("../utils/JghSerialisation");
const RiderStatsDto_1 = require("../models/RiderStatsDto");
const SheetServices = require("./SheetServices");
var showToast = SheetServices.showToast;
var reportError = SheetServices.reportError;
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
function importRidersFromMyDrive(filename, driveAppImpl) {
    return refreshRiderData(() => (0, RiderImporter_Fetchers_1.fetchPlainTextFileFromMyDrive)(filename, "MyDriveFetch", driveAppImpl), "Rider data loaded and validated from Google MyDrive.", "MyDriveImport", "Source");
}
function importRidersFromGoogleDriveLink(link, driveAppImpl) {
    return refreshRiderData(() => (0, RiderImporter_Fetchers_1.fetchPlainTextFileFromSharedLinkToGoogleDrive)(link, "GoogleDriveFetch", driveAppImpl), "Rider data loaded and validated from specified Google Drive.", "GoogleDriveImport", "Source");
}
function importRidersFromUrl(url, fetchImpl) {
    return refreshRiderData(() => (0, RiderImporter_Fetchers_1.fetchPlainTextFileFromUrl)(url, "HttpFetch", fetchImpl), "Rider data loaded and validated from specified URL.", "UrlImport", "Source");
}
function refreshRiderData(fetchFunction, successMessage = null, operationName = "RefreshRiderData") {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
    try {
        if (!(0, RiderImporter_Fetchers_1.hasInternetConnection)()) {
            const netErr = new ErrorUtils_1.ServerError("no_internet", "No internet connection detected.", null);
            try {
                reportError(`${operationName} failed: ${netErr.message}`, operationName, netErr);
            }
            catch (logErr) {
                // ignore logging failures
            }
            return {
                ok: false,
                reason: netErr.code,
                message: netErr.message,
                details: null
            };
        }
        let text;
        try {
            text = fetchFunction();
        }
        catch (fetchErr) {
            // If fetchFunction throws a known error, handle and report it
            if ((0, ErrorUtils_1.isValidationError)(fetchErr)) {
                try {
                    reportError(`${operationName} validation error: ${fetchErr.message}`, operationName, fetchErr);
                }
                catch (logErr) { }
                return {
                    ok: false,
                    reason: (_a = fetchErr.code) !== null && _a !== void 0 ? _a : "validation",
                    message: (_b = fetchErr.message) !== null && _b !== void 0 ? _b : "Validation failed",
                    details: (_c = fetchErr.context) !== null && _c !== void 0 ? _c : null
                };
            }
            if (!(0, ErrorUtils_1.isServerError)(fetchErr)) {
                const wrapped = new ErrorUtils_1.ServerError("unexpected_error", (_d = fetchErr === null || fetchErr === void 0 ? void 0 : fetchErr.message) !== null && _d !== void 0 ? _d : String(fetchErr), { original: fetchErr });
                try {
                    reportError(`${operationName} error: ${wrapped.message}`, operationName, wrapped);
                }
                catch (logErr) { }
                return {
                    ok: false,
                    reason: (_e = wrapped.code) !== null && _e !== void 0 ? _e : "server_error",
                    message: (_f = wrapped.message) !== null && _f !== void 0 ? _f : "An unexpected error occurred.",
                    details: (_g = wrapped.context) !== null && _g !== void 0 ? _g : null
                };
            }
            try {
                reportError(`${operationName} error: ${fetchErr.message}`, operationName, fetchErr);
            }
            catch (logErr) { }
            return {
                ok: false,
                reason: (_h = fetchErr.code) !== null && _h !== void 0 ? _h : "server_error",
                message: (_j = fetchErr.message) !== null && _j !== void 0 ? _j : "An unexpected error occurred.",
                details: (_k = fetchErr.context) !== null && _k !== void 0 ? _k : null
            };
        }
        let resultMessage;
        try {
            resultMessage = processFileContentsAndWriteSheets(text, operationName);
        }
        catch (processErr) {
            if ((0, ErrorUtils_1.isValidationError)(processErr)) {
                try {
                    reportError(`${operationName} validation error: ${processErr.message}`, operationName, processErr);
                }
                catch (logErr) { }
                return {
                    ok: false,
                    reason: (_l = processErr.code) !== null && _l !== void 0 ? _l : "validation",
                    message: (_m = processErr.message) !== null && _m !== void 0 ? _m : "Validation failed",
                    details: (_o = processErr.context) !== null && _o !== void 0 ? _o : null
                };
            }
            if (!(0, ErrorUtils_1.isServerError)(processErr)) {
                const wrapped = new ErrorUtils_1.ServerError("unexpected_error", (_p = processErr === null || processErr === void 0 ? void 0 : processErr.message) !== null && _p !== void 0 ? _p : String(processErr), { original: processErr });
                try {
                    reportError(`${operationName} error: ${wrapped.message}`, operationName, wrapped);
                }
                catch (logErr) { }
                return {
                    ok: false,
                    reason: (_q = wrapped.code) !== null && _q !== void 0 ? _q : "server_error",
                    message: (_r = wrapped.message) !== null && _r !== void 0 ? _r : "An unexpected error occurred.",
                    details: (_s = wrapped.context) !== null && _s !== void 0 ? _s : null
                };
            }
            try {
                reportError(`${operationName} error: ${processErr.message}`, operationName, processErr);
            }
            catch (logErr) { }
            return {
                ok: false,
                reason: (_t = processErr.code) !== null && _t !== void 0 ? _t : "server_error",
                message: (_u = processErr.message) !== null && _u !== void 0 ? _u : "An unexpected error occurred.",
                details: (_v = processErr.context) !== null && _v !== void 0 ? _v : null
            };
        }
        try {
            showToast(successMessage !== null && successMessage !== void 0 ? successMessage : resultMessage, "Success", 3);
        }
        catch (logErr) {
            // ignore toast failures
        }
        return {
            ok: true,
            message: (_w = successMessage !== null && successMessage !== void 0 ? successMessage : resultMessage) !== null && _w !== void 0 ? _w : `${operationName} succeeded.`
        };
    }
    catch (e) {
        // Final catch-all for any truly unexpected errors
        let errorToReport = e;
        if (!(0, ErrorUtils_1.isValidationError)(e) && !(0, ErrorUtils_1.isServerError)(e)) {
            errorToReport = new ErrorUtils_1.ServerError("unexpected_error", (_x = e === null || e === void 0 ? void 0 : e.message) !== null && _x !== void 0 ? _x : String(e), { original: e });
        }
        try {
            reportError(`${operationName} error: ${(_y = errorToReport === null || errorToReport === void 0 ? void 0 : errorToReport.message) !== null && _y !== void 0 ? _y : String(errorToReport)}`, operationName, errorToReport);
        }
        catch (logErr) { }
        if ((0, ErrorUtils_1.isValidationError)(errorToReport)) {
            return {
                ok: false,
                reason: (_z = errorToReport.code) !== null && _z !== void 0 ? _z : "validation",
                message: (_0 = errorToReport.message) !== null && _0 !== void 0 ? _0 : "Validation failed",
                details: (_1 = errorToReport.context) !== null && _1 !== void 0 ? _1 : null
            };
        }
        return {
            ok: false,
            reason: (_2 = errorToReport.code) !== null && _2 !== void 0 ? _2 : "server_error",
            message: (_3 = errorToReport.message) !== null && _3 !== void 0 ? _3 : "An unexpected error occurred.",
            details: (_4 = errorToReport.context) !== null && _4 !== void 0 ? _4 : null
        };
    }
}
function processFileContentsAndWriteSheets(jsonText, sourceLabel) {
    // Deserialize JSON to dictionary
    const dict = JghSerialisation_1.JsonSerializer.deserialize(jsonText, RiderStatsDto_1.RiderStatsDto);
    // Validate dictionary
    if (!dict || Object.keys(dict).length === 0) {
        throw new ErrorUtils_1.ValidationError("no_riders", `No valid entries found in JSON from ${sourceLabel}`);
    }
    // Downstream processing (uncomment if needed)
    // const sourceRiders = dictionaryToArray(dict);
    // if (!sourceRiders || sourceRiders.length === 0) {
    //     throw new ValidationError("no_riders", `No valid entries found in JSON from ${sourceLabel}`);
    // }
    // writeSourceSheet(sourceRiders, "Source");
    // const normalizedRiders = dictionaryToNormalisedArray(dict);
    // if (!normalizedRiders || normalizedRiders.length === 0) {
    //     throw new ValidationError("no_normalised_riders", "No normalised rider items could be produced from JSON");
    // }
    // writeNormalisedSheet(normalizedRiders, "Normalised");
    // const precomputedRiders = dictionaryToPrecomputedArray(normalizedRiders);
    // writePrecomputedSheet(precomputedRiders, "Precomputed");
    return dict;
}
//# sourceMappingURL=RiderImporter.Core.js.map