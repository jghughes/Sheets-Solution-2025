// Sheets01 / src / services / RidersImporter.js
/**
 * Shows a help modal dialog. Client calls `google.script.run.showHelpDocument()`. See SideBar.html
 */
function showHelpDocument() {
    try {
        const html = HtmlService.createHtmlOutputFromFile("src/ui/Help").setWidth(760).setHeight(640);
        SpreadsheetApp.getUi().showModalDialog(html, "Help");
    } catch (err) {
        throw new Error(`showHelpDocument failed: ${err?.message ?? String(err)}`);
    }
}

/***************************************************************
 * Remote resource target connection strings
 ***************************************************************/

const personalGoogleDriveRidersFilename = "everyone_in_club_ZsunItems_2025_09_22_modern.json"; // Example filename, replace with your own
const publicGoogleDriveRidersFileLink = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";
let azureBlobRidersFileUrl = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";

/***************************************************************
 * Structured error types and helpers (modern ES6 classes)
 ***************************************************************/
class ValidationError extends Error {
    constructor(code = "validation", message = "", context = null) {
        super(message);
        this.name = "ValidationError";
        this.code = code;
        this.context = context;
        if (Error.captureStackTrace) Error.captureStackTrace(this, ValidationError);
    }
}

class ServerError extends Error {
    constructor(code = "server_error", message = "", context = null) {
        super(message);
        this.name = "ServerError";
        this.code = code;
        this.context = context;
        if (Error.captureStackTrace) Error.captureStackTrace(this, ServerError);
    }
}

const throwServerError = (code, message, context) => { throw new ServerError(code, message, context); };

const isValidationError = (err) => !!err && (err instanceof ValidationError || err?.name === "ValidationError");
const isServerError = (err) => !!err && (err instanceof ServerError || err?.name === "ServerError");

/***************************************************************
 * Import wrappers (return the result so google.script.run sees it)
 ***************************************************************/
function importRidersFromMyDrive(filename) {
    return refreshRiderData(
        () => fetchPlainTextFileFromMyDrive(filename, "MyDriveFetch"),
        "Rider data loaded and validated from Google MyDrive.",
        "MyDriveImport",
        "Source"
    );
}

function importRidersFromGoogleDriveLink(link) {
    return refreshRiderData(
        () => fetchPlainTextFileFromSharedLinkToGoogleDrive(link, "GoogleDriveFetch"),
        "Rider data loaded and validated from specified Google Drive.",
        "GoogleDriveImport",
        "Source"
    );
}

function importRidersFromUrl(url) {
    return refreshRiderData(
        () => fetchPlainTextFileFromUrl(url, "HttpFetch"),
        "Rider data loaded and validated from specified URL.",
        "UrlImport",
        "Source"
    );
}

/***************************************************************
 * fetch functions called from button click handlers
 ***************************************************************/
function refreshRiderData(fetchFunction, successMessage, operationName = "RefreshRiderData", sheetName = "Source") {
    // Fail fast for no internet: log server-side then throw ServerError (client failure handler)
    if (!hasInternetConnection()) {
        const netErr = new ServerError("no_internet", "No internet connection detected.", null);
        try { reportError(`${operationName} failed: ${netErr.message}`, operationName, netErr); } catch (e) { /* ignore logging failures */ }
        throw netErr;
    }

    try {
        // Fetch the payload - fetchFunction may throw ValidationError or other errors
        const text = fetchFunction();

        // Process/validate the JSON and write sheet. processDictionaryAndWrite throws ValidationError for bad input.
        const resultMessage = processFileContentsAndWriteSheets(text, operationName);

        try { showToast(successMessage || resultMessage, "Success", 3); } catch (e) { /* ignore toast failures */ }

        // Return structured success for handlers.success on the client
        return { ok: true, message: successMessage || resultMessage || `${operationName} succeeded.` };
    } catch (e) {
        if (isValidationError(e)) {
            // Non-fatal validation: surface to client success handler as structured "ok: false"
            return {
                ok: false,
                reason: e.code || "validation",
                message: e.message || "Validation failed",
                details: e.context || null
            };
        }

        // Fatal: log server-side and rethrow so client-side .withFailureHandler runs
        try { reportError(`${operationName} unexpected error: ${e?.message ?? String(e)}`, operationName, e); } catch (logErr) { /* swallow logging errors */ }
        // If it's already a ServerError, rethrow; otherwise wrap for clarity
        if (!isServerError(e)) {
            throw new ServerError("unexpected_error", e?.message ?? String(e), { original: e });
        }
        throw e;
    }
}

function hasInternetConnection(fetchImpl) {
    // fetchImpl may be a test stub or UrlFetchApp
    const fetcher = fetchImpl || (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null);
    if (!fetcher) return false;
    try {
        const resp = (typeof fetcher.fetch === "function") ? fetcher.fetch("https://www.google.com", { muteHttpExceptions: true }) : fetcher("https://www.google.com");
        if (typeof resp === "object" && typeof resp.getResponseCode === "function") {
            return resp.getResponseCode() < 500;
        }
        return true;
    } catch (e) {
        return false;
    }
}

function fetchPlainTextFileFromMyDrive(filename, opName = "MyDriveFetch", driveAppImpl) {
    const driveApp = driveAppImpl || (typeof DriveApp !== "undefined" ? DriveApp : null);
    if (!driveApp) throw new ServerError(`${opName}_unavailable`, `${opName} unavailable: no DriveApp`);
    try {
        const files = driveApp.getFilesByName(filename);
        if (!files.hasNext()) {
            throw new ValidationError("file_not_found", `File not found: ${filename}`, { filename });
        }
        const file = files.next();
        return file.getBlob().getDataAsString();
    } catch (e) {
        // Preserve ValidationError as-is; wrap other errors as ServerError for clarity
        if (isValidationError(e)) throw e;
        throw new ServerError(`${opName}_failed`, `${opName} failed: ${e?.message ?? String(e)}`, { filename });
    }
}

function fetchPlainTextFileFromSharedLinkToGoogleDrive(sharedLink, opName = "GoogleDriveFetch", driveAppImpl, core) {
    // core.extractDriveIdFromSharedLink is a pure utility (in utils) you should implement and test.
    const driveApp = driveAppImpl || (typeof DriveApp !== "undefined" ? DriveApp : null);
    const util = core || (typeof SheetsDataFetcherCore !== "undefined" ? SheetsDataFetcherCore : null);
    if (!driveApp || !util) throw new ServerError(`${opName}_unavailable`, `${opName} unavailable: missing DriveApp or core util`);

    try {
        // Validate/extract id first and treat malformed links as validation errors (user-correctable)
        const id = util.extractDriveIdFromSharedLink(sharedLink);
        if (!id || typeof id !== "string" || !/[-\w]{10,}/.test(id)) {
            throw new ValidationError("invalid_shared_link", "Invalid Google Drive shared link or missing id", { sharedLink });
        }

        // Attempt to open the file. Distinguish not-found/user errors (ValidationError) from real server/perms errors (ServerError).
        try {
            const file = driveApp.getFileById(id);
            return file.getBlob().getDataAsString();
        } catch (innerErr) {
            const msg = innerErr?.message ?? String(innerErr);
            // Common "not found" / "no item with the given id" messages - treat as user-correctable (ValidationError)
            if (/not found|no item with the given id|file not found|does not exist/i.test(msg)) {
                throw new ValidationError("file_not_found", `File not found for id extracted from link`, { sharedLink, id });
            }
            // Permission issues and other failures are treated as server errors
            throw new ServerError(`${opName}_failed`, `${opName} failed: ${msg}`, { sharedLink, id });
        }
    } catch (e) {
        // Preserve ValidationError so refreshRiderData returns structured ok:false.
        if (isValidationError(e)) throw e;
        // Wrap all other unexpected errors as ServerError
        throw new ServerError(`${opName}_failed`, `${opName} failed: ${e?.message ?? String(e)}`, { sharedLink });
    }
}


function fetchPlainTextFileFromUrl(url, opName = "HttpFetch", fetchImpl) {
    const fetcher = fetchImpl || (typeof UrlFetchApp !== "undefined" ? UrlFetchApp : null);
    if (!fetcher) throw new ServerError(`${opName}_unavailable`, `${opName} unavailable: no fetch implementation`);
    try {
        // Prefer muteHttpExceptions so we can inspect status codes and classify client vs server errors.
        const resp = (typeof fetcher.fetch === "function") ? fetcher.fetch(url, { muteHttpExceptions: true }) : fetcher(url);

        // If injected fetcher returns a bare string, accept it.
        if (typeof resp === "string") return resp;

        // If we have a response object with a status code, classify by code.
        if (resp && typeof resp.getResponseCode === "function") {
            const code = resp.getResponseCode();
            const text = (typeof resp.getContentText === "function") ? resp.getContentText() : "";

            if (code >= 400 && code < 500) {
                // Client errors (404, 400 etc.) are user-correctable -> ValidationError
                throw new ValidationError("http_client_error", `HTTP ${code} fetching ${url}`, { url, statusCode: code, responseSnippet: (text || "").slice(0, 1000) });
            }
            if (code >= 500) {
                // Server errors -> ServerError
                throw new ServerError(`${opName}_failed`, `${opName} failed with HTTP ${code}`, { url, statusCode: code });
            }

            // OK
            if (typeof resp.getContentText === "function") return resp.getContentText();
            // Unexpected shape even though status code ok
            throw new ValidationError("unexpected_fetch_shape", "Unexpected fetch response shape", { url });
        }

        // Fallback: if response has getContentText, return it.
        if (resp && typeof resp.getContentText === "function") return resp.getContentText();

        // Otherwise unexpected response shape -> treat as validation (non-fatal)
        throw new ValidationError("unexpected_fetch_shape", "Unexpected fetch response shape", { url });
    } catch (e) {
        // Preserve ValidationError for refreshRiderData to surface as ok:false.
        if (isValidationError(e)) throw e;
        // Wrap all other errors as ServerError
        throw new ServerError(`${opName}_failed`, `${opName} failed: ${e?.message ?? String(e)}`, { url });
    }
}

/**
 * Expects a top-level object mapping zwiftId -> serialized object (or object).
 * Parse the JSON dictionary into an obj.
 * Step 1. do dictionaryToArray and write into rows and columns in a Sheet named Source, create the sheet if needed. clear the sheet first. Use the JSON field names as column headers.
 * Step 2. do dictionaryToNormalisedArray and write all the properties of Rider Item into rows and columns in a Sheet named Normalised, create the sheet if needed. clear the sheet first. Use the JSON field names as column headers.
 * Step 3. do dictionaryToPrecomputedArray and write all precomputed items into rows and columns in a Sheet named Precomputed, create the sheet if needed. clear the sheet first. Use the JSON field names as column headers.
 * 
 */
function processFileContentsAndWriteSheets(jsonText, sourceLabel) {
    if (!jsonText || typeof jsonText !== "string") {
        throw new ValidationError("empty_json", `Empty or invalid JSON text from ${sourceLabel}`);
    }
    let dict;
    try {
        dict = JSON.parse(jsonText);
    } catch (e) {
        throw new ValidationError("invalid_json", `Failed to parse JSON: ${e?.message ?? String(e)}`, { snippet: (jsonText || "").slice(0, 1000) });
    }
    if (!dict || typeof dict !== "object" || Array.isArray(dict)) {
        throw new ValidationError("invalid_shape", "Expected top-level object (of type dictionary) mapping zwiftId -> object (of any type)");
    }

    // Step 1: Source sheet - preserve raw JSON fields but provide camelCase equivalents
    const sourceRiders = dictionaryToArray(dict);
    if (!sourceRiders || sourceRiders.length === 0) {
        throw new ValidationError("no_riders", `No valid entries found in JSON from ${sourceLabel}`);
    }
    writeSourceSheet(sourceRiders, "Source");

    // Step 2: Normalised sheet - normalised RiderItem instances (or objects with expected camelCase props)
    const normalizedRiders = dictionaryToNormalisedArray(dict);
    if (!normalizedRiders || normalizedRiders.length === 0) {
        throw new ValidationError("no_normalised_riders", "No normalised rider items could be produced from JSON");
    }
    writeNormalisedSheet(normalizedRiders, "Normalised");

    // Step 3: Precomputed sheet - normalized plus computed fields
    const precomputedRiders = dictionaryToPrecomputedArray(normalizedRiders);
    writePrecomputedSheet(precomputedRiders, "Precomputed");

    return `Received ${sourceRiders.length} data records and wrote their offspring to three sheets - Source, Normalised, Precomputed`;
}

/**
 * Convert dictionary (zwiftId -> raw) into array of normalized rider objects suitable for writeRidersToSheet.
 * Uses deserializeRiderItem or RiderItem ctor for normalization.
 */
function dictionaryToNormalisedArray(dict) {
    const out = [];
    for (const [key, value] of Object.entries(dict)) {
        let raw = value;

        // If the value is a serialized JSON string, try parse it
        if (typeof raw === "string") {
            const t = raw.trim();
            if (t === "") continue;
            try {
                raw = JSON.parse(t);
            } catch (e) {
                // skip invalid entry
                continue;
            }
        }

        if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;

        // Prefer the existing deserializer / ctor for normalization
        let riderInstance = null;
        if (typeof deserializeRiderItem === "function") {
            riderInstance = deserializeRiderItem(raw);
        } else if (typeof RiderItem === "function") {
            try {
                riderInstance = new RiderItem(raw);
            } catch (e) {
                riderInstance = null;
            }
        } else {
            // No normalization available -> attempt best-effort mapping
            riderInstance = bestEffortNormalize(raw, key);
        }

        if (!riderInstance) continue;

        out.push(riderInstance);
    }
    return out;
}

/**
 * Best-effort normalizer: convert snake_case JSON fields to camelCase properties used by writeRidersToSheet.
 * Adds zwiftId from either the raw object or the dictionary key.
 */
function bestEffortNormalize(raw, key) {
    if (!raw || typeof raw !== "object") return null;
    const o = {};
    // copy and convert snake_case to camelCase
    for (const [k, val] of Object.entries(raw)) {
        const camel = snakeToCamel(k);
        o[camel] = val;
        // also keep original key for completeness
        o[k] = val;
    }
    // Ensure zwiftId exists
    o.zwiftId = o.zwiftId || o.zwift_id || key;
    return o;
}

/**
 * Convert top-level dictionary into an array representing the raw/source records.
 * Keeps raw keys but also provides camelCase equivalents so downstream sheets can use consistent property names.
 */
function dictionaryToArray(dict) {
    const out = [];
    for (const [key, value] of Object.entries(dict)) {
        let raw = value;

        // If the value is a serialized JSON string, try parse it
        if (typeof raw === "string") {
            const t = raw.trim();
            if (t === "") continue;
            try {
                raw = JSON.parse(t);
            } catch (e) {
                // skip invalid entry
                continue;
            }
        }

        if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;

        // Build object that contains both original raw keys and camelCase copies
        const entry = {};
        for (const [k, v] of Object.entries(raw)) {
            entry[k] = v;
            try {
                const camel = snakeToCamel(k);
                if (!Object.prototype.hasOwnProperty.call(entry, camel)) {
                    entry[camel] = v;
                }
            } catch (e) {
                // ignore conversion errors and continue
            }
        }

        // Ensure zwiftId available
        entry.zwiftId = entry.zwiftId || entry.zwift_id || key;

        out.push(entry);
    }
    return out;
}

/**
 * Create precomputed / derived fields for each normalized rider object.
 */
function dictionaryToPrecomputedArray(normalizedRiders) {
    if (!normalizedRiders || !Array.isArray(normalizedRiders)) return [];
    const out = [];
    for (let i = 0; i < normalizedRiders.length; i++) {
        const r = normalizedRiders[i] || {};
        const zwiftId = r.zwiftId || r.zwift_id || "";

        // compute the four precomputed values (safe-guarded)
        let zFtpWkg = "?";
        let initials = "?";
        let stats01 = "?";
        let stats02 = "?";
        try {
            zFtpWkg = makeZFtpWkg(r) || "?";
            initials = makeRiderInitials(r) || "?";
            stats01 = makeRiderStats01(r) || "?";
            stats02 = makeRiderStats02(r) || "?";
        } catch (e) {
            // keep defaults on error
        }

        out.push({
            zwiftId,
            zFtpWkg,
            initials,
            stats01,
            stats02
        });
    }
    return out;
}
/**
 * Utility: snake_case -> camelCase
 */
function snakeToCamel(s) {
    if (!s || typeof s !== "string") return s;
    return s.replace(/_([a-zA-Z0-9])/g, (_m, g1) => g1.toUpperCase());
}

/**
 * Writes Source records into the Source sheet.
 * Builds header from union of keys across all records (zwiftId forced first).
 */
function writeSourceSheet(records, nameOfSheet = "Source") {
    const sheetName = nameOfSheet;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);
    } else {
        sheet.clear();
    }

    if (!records || records.length === 0) {
        sheet.appendRow(["Zwift ID"]);
        return;
    }

    // Collect union of keys across all records
    const keySet = new Set();
    for (const r of records) {
        for (const k of Object.keys(r || {})) {
            keySet.add(k);
        }
    }

    // Ensure zwiftId is first, deterministic order for remaining keys
    const keys = [...keySet].filter(k => k !== "zwiftId");
    keys.sort();
    keys.unshift("zwiftId");

    // Header row uses the key names
    sheet.appendRow(keys);

    // Data rows
    const data = records.map(r => {
        return keys.map(k => {
            let v = (r && r[k] !== undefined) ? r[k] : "";
            if (v instanceof Date) v = v.toISOString();
            return v;
        });
    });

    if (data.length > 0) {
        sheet.getRange(2, 1, data.length, keys.length).setValues(data);
    }
}

/**
 * Writes Normalised records into the Normalised sheet.
 * Uses fixed column mapping expected for RiderItem / normalized objects.
 */
function writeNormalisedSheet(riders, nameOfSheet = "Normalised") {
    const sheetName = nameOfSheet;
    const columns = [
        ["Zwift ID", "zwiftId"],
        ["Name", "name"],
        ["Country", "country_alpha2"],
        ["Wgt kg", "weightKg"],
        ["Ht cm", "heightCm"],
        ["Gender", "gender"],
        ["Age yrs", "ageYears"],
        ["Age grp", "ageGroup"],
        ["zFTP W", "zwiftFtpWatts"],
        ["zPwr zFTP", "zwiftpowerZFtpWatts"],
        ["ZR zFTP W", "zwiftRacingAppZpFtpWatts"],
        ["1h W", "zsunOneHourWatts"],
        ["CP W", "zsunCP"],
        ["AWC kJ", "zsunAWC"],
        ["ZRS", "zwiftZrsScore"],
        ["Zwift Cat", "zwiftCatOpen"],
        ["Zwift Cat F", "zwiftCatFemale"],
        ["ZR Velo", "zwiftRacingAppVeloRating"],
        ["ZR Cat#", "zwiftRacingAppCatNum"],
        ["ZR Cat", "zwiftRacingAppCatName"],
        ["ZR CP W", "zwiftRacingAppCP"],
        ["ZR AWC kJ", "zwiftRacingAppAWC"],
        ["1h coeff", "zsunOneHourCurveCoefficient"],
        ["1h exp", "zsunOneHourCurveExponent"],
        ["TTT coeff", "zsunTTTPullCurveCoefficient"],
        ["TTT exp", "zsunTTTPullCurveExponent"],
        ["TTT R2", "zsunTTTPullCurveFitRSquared"],
        ["Curves fitted", "zsunWhenCurvesFitted"]
    ];

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);
    } else {
        sheet.clear();
    }

    // Header
    const header = columns.map(([title]) => title);
    sheet.appendRow(header);

    // Rows
    const data = (riders && riders.length > 0) ? riders.map(r => {
        return columns.map(([, propName]) => {
            let v = (typeof r === "object" && r[propName] !== undefined) ? r[propName] : "";
            if (v instanceof Date) v = v.toISOString();
            return v;
        });
    }) : [];

    if (data.length > 0) {
        sheet.getRange(2, 1, data.length, columns.length).setValues(data);
    }
}

/**
 * Writes Precomputed records into the Precomputed sheet.
 * Each record contains only zwiftId and precomputed fields.
 */
function writePrecomputedSheet(records, nameOfSheet = "Precomputed") {
    const sheetName = nameOfSheet;
    const columns = [
        ["Zwift ID", "zwiftId"],
        ["Initials", "initials"],
        ["Stats01", "stats01"],
        ["Stats02", "stats02"]
    ];

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);
    } else {
        sheet.clear();
    }

    // Header
    const header = columns.map(([title]) => title);
    sheet.appendRow(header);

    // Rows
    const data = (records && records.length > 0) ? records.map(r => {
        return columns.map(([, propName]) => {
            let v = (typeof r === "object" && r[propName] !== undefined) ? r[propName] : "";
            if (v instanceof Date) v = v.toISOString();
            return v;
        });
    }) : [];

    if (data.length > 0) {
        sheet.getRange(2, 1, data.length, columns.length).setValues(data);
    }
}


/* Precompute helpers - GAS-friendly implementations */

function makeZFtpWkg(obj) {
    if (obj && obj.zwiftRacingAppZpFtpWatts != null && obj.weightKg != null && Number(obj.weightKg) !== 0) {
        const n = Number(obj.zwiftRacingAppZpFtpWatts) / Number(obj.weightKg);
        return n.toFixed(2);
    }
    return "?";
}

function makeRiderInitials(rider) {
    if (!rider || !rider.name || typeof rider.name !== "string") return "";
    const parts = rider.name.trim().split(/\s+/);
    let initials = "";
    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (p && p.length > 0) initials += p.charAt(0).toLowerCase();
    }
    return initials;
}

function makeRiderStats01(rider) {
    let prettyZwiftCat = "";
    if (rider && rider.gender && String(rider.gender).toLowerCase() === "f") {
        prettyZwiftCat = String(rider.zwiftCatOpen ?? "") + "/" + String(rider.zwiftCatFemale ?? "");
    } else {
        prettyZwiftCat = rider ? String(rider.zwiftCatOpen ?? "") : "";
    }

    let prettyZFtpWkg = "?";
    if (rider && rider.zwiftRacingAppZpFtpWatts != null && rider.weightKg != null && Number(rider.weightKg) !== 0) {
        const n = Number(rider.zwiftRacingAppZpFtpWatts) / Number(rider.weightKg);
        prettyZFtpWkg = n.toFixed(2);
    }

    return `${prettyZwiftCat} (${prettyZFtpWkg} - ${rider ? String(rider.zwiftZrsScore ?? "") : ""})`;
}

function makeRiderStats02(rider) {
    if (!rider) return "";
    return `${String(rider.zwiftRacingAppCatNum ?? "")} (${String(rider.zwiftRacingAppVeloRating ?? "")} - ${String(rider.zwiftRacingAppCatName ?? "")})`;
}