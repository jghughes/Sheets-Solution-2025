// Requires: Sheets01/globals.js to be loaded before this file. esp in Google Apps Script

// you MUST omit the following import statements in Google Apps Script especially the first one

import {
    isValidRawRiderData,
    makeCustomizedRiderData
} from "./riderUtils.js";

import {
    showToast,
    logToSheet,
    reportError
} from "./appUtils.js";

import { hasValidStringProps, isEmpty } from "./jsUtils.js";

//-------------------------------------------------------------------//
//--------------------Caches for rider data-------------------------//
//-----------------------------------------------------------------//


// Global cache object for raw rider data
var RIDER_CACHE_FROM_REMOTE_SOURCE = null;

// Global cache object for pre-processed rider data 
var RIDER_CACHE_LOCAL = null;

//-------------------------------------------------------------------//
//---------------------------Filenames------------------------------//
//-----------------------------------------------------------------//


const PERSONAL_GOOGLE_DRIVE_RIDERS_FILENAME = "everyone_in_club_ZsunItems_2025_09_22.json"; // Example filename, replace with your own

//-------------------------------------------------------------------//
//---------------------------URLS-----------------------------------//
//-----------------------------------------------------------------//


// Example: Public Google Drive sharing link for a JSON file (replace with your own file's link)
const PUBLIC_GOOGLE_DRIVE_RIDERS_FILE_LINK = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";

var AZURE_BLOB_RIDERS_FILE_URL = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";

//-------------------------------------------------------------------//
//---------------------------Error messages-------------------------//
//-----------------------------------------------------------------//

const ERROR_MESSAGES = {
    INVALID_ID: "Error: Invalid zwiftID",
    INVALID_PROPERTY: "Error: Invalid property name",
    CACHE_EMPTY: "Error: Cache empty",
    RIDER_MISSING: "Error: Rider not found",
    NAME_MISSING: "Error: {name} missing",
    STATS01_MISSING: "Error: {riderStats01} missing",
    STATS02_MISSING: "Error: {riderStats02} missing",
    PROPERTY_MISSING: "Error: Property missing"
};

//-------------------------------------------------------------------//
//--Functions for button clicks in sheet cells to fetch rider data--//
//-----------------------------------------------------------------//

/**
 * Fetches and parses rider data from a JSON file stored in the user's private Google Drive
 * using the file name and DriveApp (requires script authorization and user access).
 *
 * Loads all riders from personal Google Drive and updates the global caches.
 *
 * This function is intended to be called when a user clicks a custom button in Google Sheets.
 * 
 * To set this up in Google Sheets:
 * 1. Insert a drawing or image (Insert > Drawing or Insert > Image).
 * 2. Click the inserted object, then click the three-dot menu and select "Assign script".
 * 3. Enter the function name: onOneDriveRiderRefreshClick
 * 4. When the user clicks the button in the sheet, this function will be executed.
 */
function onPersonalGoogleDriveRefreshRidersClick() {
    refreshRiderData(
        () => fetchJsonFromGoogleDriveFile(PERSONAL_GOOGLE_DRIVE_RIDERS_FILENAME, "PrivateGoogleDriveFetch"),
        "Rider data loaded and validated from private Google Drive.",
        "PrivateGoogleDrive"
    );
}

/**
 * Fetches and parses rider data from a public Google Drive JSON file using its sharing link.
 *
 * Loads all riders from a public Google Drive link and updates the global caches.
 *
 * This function is intended to be called when a user clicks a custom button in Google Sheets.
 * 
 * To set this up in Google Sheets:
 * 1. Insert a drawing or image (Insert > Drawing or Insert > Image).
 * 2. Click the inserted object, then click the three-dot menu and select "Assign script".
 * 3. Enter the function name: onPublicGoogleDriveLinkRefreshRidersClick
 * 4. When the user clicks the button in the sheet, this function will be executed.
 */
function onPublicGoogleDriveLinkRefreshRidersClick() {
    refreshRiderData(
        () => fetchJsonFromPublicGoogleDriveLink(PUBLIC_GOOGLE_DRIVE_RIDERS_FILE_LINK, "PublicGoogleDriveFetch"),
        "Rider data loaded and validated from public Google Drive link.",
        "PublicGoogleDrive"
    );
}

/**
 * Fetches and parses rider data from a JSON file stored in Azure Blob Storage using a public URL.
 *
 * Loads all riders from Azure Blob Storage and updates the global caches.
 *
 * This function is intended to be called when a user clicks a custom button in Google Sheets.
 * 
 * To set this up in Google Sheets:
 * 1. Insert a drawing or image (Insert > Drawing or Insert > Image).
 * 2. Click the inserted object, then click the three-dot menu and select "Assign script".
 * 3. Enter the function name: onAzureBlobStorageRefreshRidersClick
 * 4. When the user clicks the button in the sheet, this function will be executed.
 */
function onAzureBlobStorageRefreshRidersClick() {
    refreshRiderData(
        () => fetchJsonFromUrl(AZURE_BLOB_RIDERS_FILE_URL, "AzureBlobFetch"),
        "Rider data loaded and validated from Azure Blob Storage.",
        "AzureBlobStorage"
    );
}

/**
 * Generalized function to refresh rider data from any source.
 * Handles fetching, validation, preprocessing, caching, user notification, and logging.
 * @param {Function} fetchFunction - Function to fetch raw rider data.
 * @param {string} successMessage - Message to show on success.
 * @param {string} operationName - Name of the operation for logging.
 */
function refreshRiderData(fetchFunction, successMessage, operationName) {
    try {
        const ridersRawData = fetchFunction();
        if (!ridersRawData || isEmpty(ridersRawData)) {
            showToast("No data returned from fetch function.", "Error", operationName);
            logToSheet(operationName, "Failure", "No data returned from fetch function.");
            return;
        }
        const validation = isValidRawRiderData(ridersRawData);

        if (validation === true) {
            const result = makeCustomizedRiderData(ridersRawData);
            if (!result.success) {
                reportError(result.error, operationName);
                return;
            }
            const preprocessedRidersData = result.data;

            if (!preprocessedRidersData || isEmpty(preprocessedRidersData)) {
                reportError("Preprocessed rider data is empty.", operationName);
                return;
            }
            RIDER_CACHE_FROM_REMOTE_SOURCE = ridersRawData;
            RIDER_CACHE_LOCAL = preprocessedRidersData;
            showToast(successMessage, "Success", operationName);
            logToSheet(operationName, "Success", successMessage);
        } else {
            const errorMsg = `${operationName} data fetch error: ${validation}`;
            reportError(errorMsg, operationName);
        }
    } catch (e) {
        const catchMsg = `${operationName} unexpected error: ${e.message}`;
        reportError(catchMsg, operationName, e);
    }
}
/**
 * Fetches and parses data from an arbitrary JSON file stored in the user's private Google Drive
 * using the file name and DriveApp (requires script authorization and user access).
 *
 * Google Drive does not use unique file paths; instead, each file has a unique ID,
 * but multiple files can share the same name, even within the same folder.
 * The method DriveApp.getFilesByName(fileName) searches the entire Drive for files
 * with the specified name and returns an iterator over all matches. If multiple files
 * are found, only the first one is used, and a warning is shown. This means file name
 * alone is not guaranteed to uniquely identify a file in Google Drive.
 *
 * DriveApp always operates in the context of the user running the script. When this
 * function is executed (e.g., via a Google Sheets custom button), it searches the
 * entire Google Drive of the current user (including "My Drive" and any shared drives
 * the user has access to). No explicit account or container selection is needed—
 * Google Apps Script automatically uses the user's session and authorization.
 *
 * - Checks for internet connectivity before attempting to access Drive.
 * - Searches for a file named as specified by RIDERS_GOOGLEDRIVE_FILENAME.
 * - If multiple files are found, uses the first and issues a warning.
 * - Reads the file content as a string and parses it as JSON.
 * - Validates that the parsed data is not empty.
 * - Handles and reports errors for missing files, invalid JSON, empty data, or connectivity issues.
 *
 * This function is generic and can fetch any file and parse its JSON content.
 *
 * @param {string} fileName - The name of the file to fetch from Google Drive.
 * @param {string} [operationName="GoogleDrive"] - Optional operation name for logging.
 * @returns {Object|null} Parsed JSON object from the file, or null if an error occurs.
 */
function fetchJsonFromGoogleDriveFile(fileName, operationName = "PrivateGoogleDriveFetch") {
    const operation = operationName;
    if (!hasInternetConnection()) {
        showToast("No internet connection detected.", "Error", operation);
        return null;
    }

    try {
        const files = DriveApp.getFilesByName(fileName);

        if (!files.hasNext()) {
            showToast(`File not found: ${fileName}`, "Error", operation);
            return null;
        }

        const file = files.next();
        if (files.hasNext()) {
            showToast(`Warning: Multiple files named ${fileName} found. Using the first one.`, "Warning", operation);
        }

        const content = file.getBlob().getDataAsString();
        let parsedData;
        try {
            parsedData = JSON.parse(content);
        } catch (parseError) {
            reportError("GoogleDrive fetch error: Invalid JSON format.", operation);
            return null;
        }

        if (isEmpty(parsedData)) {
            reportError("GoogleDrive fetch error: Data is empty.", operation);
            return null;
        }

        return parsedData;
    } catch (e) {
        reportError(`GoogleDrive fetch error: ${e.message}`, operation, e);
        return null;
    }
}

/**
 * Fetches and parses JSON data from a public Google Drive file using its sharing link.
 *
 * This is a generic utility for retrieving any public JSON file from Google Drive.
 * - Extracts the file ID from the provided sharing link.
 * - Constructs a direct download URL and fetches the file content.
 * - Handles and reports errors for connectivity, permissions, missing files, invalid JSON, or empty data.
 * - Logs errors and results using logToSheet.
 *
 * @param {string} publicLink - The public Google Drive sharing link.
 * @param {string} [operationName="PublicGoogleDriveFetch"] - Optional operation name for logging.
 * @returns {Object|null} The parsed JSON object from the file, or null if an error occurs.
 */
function fetchJsonFromPublicGoogleDriveLink(publicLink, operationName = "PublicGoogleDriveFetch") {
    const operation = operationName;
    if (!hasInternetConnection()) {
        const msg = "No internet connection detected.";
        showToast(msg, "Error", operation);
        logToSheet(operation, "Failure", msg);
        return null;
    }

    // Extract file ID from the sharing link
    const match = publicLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match || !match[1]) {
        const msg = "Invalid Google Drive sharing link: Unable to extract file ID.";
        reportError(msg, operation);
        logToSheet(operation, "Failure", msg);
        return null;
    }
    const fileId = match[1];

    // Construct the direct download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    try {
        const response = UrlFetchApp.fetch(downloadUrl, { muteHttpExceptions: true });
        const code = response.getResponseCode();

        if (code === 403) {
            const msg = "Access denied: The file is not shared publicly or you do not have permission.";
            showToast(msg, "Error", operation);
            logToSheet(operation, "Failure", msg);
            return null;
        }
        if (code === 404) {
            const msg = "File not found: The link is invalid or the file does not exist.";
            showToast(msg, "Error", operation);
            logToSheet(operation, "Failure", msg);
            return null;
        }
        if (code !== 200) {
            const msg = `Failed to fetch public file from Google Drive: HTTP ${code}`;
            showToast(msg, "Error", operation);
            logToSheet(operation, "Failure", msg);
            return null;
        }

        const content = response.getContentText();
        let parsedData;
        try {
            parsedData = JSON.parse(content);
        } catch (parseError) {
            const msg = "PublicGoogleDrive fetch error: Invalid JSON format.";
            reportError(msg, operation, parseError);
            logToSheet(operation, "Failure", msg);
            return null;
        }

        if (isEmpty(parsedData)) {
            const msg = "PublicGoogleDrive fetch error: Data is empty.";
            reportError(msg, operation);
            logToSheet(operation, "Failure", msg);
            return null;
        }

        logToSheet(operation, "Success", "JSON data loaded and validated from public link.");
        return parsedData;
    } catch (e) {
        const msg = `PublicGoogleDrive fetch error: ${e.message}`;
        reportError(msg, operation, e);
        logToSheet(operation, "Failure", msg);
        return null;
    }
}

/**
 * Fetches and parses JSON data from any public URL.
 * Handles errors gracefully for Google Sheets usage, including JSON parse errors.
 * @param {string} url - The URL to fetch JSON from.
 * @param {string} [operationName="GenericJsonFetch"] - Optional operation name for logging.
 * @returns {Object|null} Parsed JSON object, or null if error.
 */
function fetchJsonFromUrl(url, operationName = "PublicGenericJsonFetch") {
    if (!hasInternetConnection()) {
        showToast("No internet connection detected.", "Error", operationName);
        return null;
    }

    try {
        const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
        const code = response.getResponseCode();

        if (code === 403) {
            showToast("Access denied: You do not have permission to access this file.", "Error", operationName);
            return null;
        }
        if (code === 404) {
            showToast("File not found: The URL is invalid or the file does not exist.", "Error", operationName);
            return null;
        }
        if (code !== 200) {
            showToast(`Failed to fetch file: HTTP ${code}`, "Error", operationName);
            return null;
        }

        const content = response.getContentText();
        let parsedData;
        try {
            parsedData = JSON.parse(content);
        } catch (parseError) {
            reportError("Fetch error: Invalid JSON format.", operationName);
            return null;
        }

        if (isEmpty(parsedData)) {
            reportError("Fetch error: Data is empty.", operationName);
            return null;
        }

        return parsedData;
    } catch (e) {
        reportError(`Fetch error: ${e.message}`, operationName, e);
        return null;
    }
}

/**
 * Checks for internet connectivity by attempting to fetch a lightweight, reliable URL.
 * @returns {boolean} True if internet is available, false otherwise.
 */
function hasInternetConnection() {
    try {
        const response = UrlFetchApp.fetch("https://www.google.com/generate_204", { muteHttpExceptions: true });
        const code = response.getResponseCode();
        return code === 204 || code === 200;
    } catch (e) {
        return false;
    }
}

//-------------------------------------------------------------------//
//-------------Functions for use as formulae in sheet cells---------//
//-----------------------------------------------------------------//

/**
 * Returns the name of the rider for the given Zwift ID.
 * Usage in Google Sheets: =riderGetName("1234")
 */
function riderGetName(zwiftId) {
    return getRiderNameFromCache(zwiftId, RIDER_CACHE_LOCAL);
}

/**
 * Returns stats for the rider for the given Zwift ID.
 * Usage in Google Sheets: =riderGetStats01("1234")
 */
function riderGetStats01(zwiftId) {
    return getRiderStats01FromCache(zwiftId, RIDER_CACHE_LOCAL);
}

/**
 * Returns a specific property for the rider.
 * Usage in Google Sheets: =riderGetProperty("1234", "propertyName")
 */
function riderGetProperty(zwiftId, propertyName) {
    return getRiderPropertyFromCache(zwiftId, propertyName, RIDER_CACHE_FROM_REMOTE_SOURCE);
}  

function getRiderNameFromCache(zwiftId, cache) {
    return getRiderPropertyFromCacheStrict(
        zwiftId, "name", cache, ERROR_MESSAGES.NAME_MISSING
    );
}

function getRiderStats01FromCache(zwiftId, cache) {
    return getRiderPropertyFromCacheStrict(
        zwiftId, "riderStats01", cache, ERROR_MESSAGES.STATS01_MISSING
    );
}

//-------------------------------------------------------------------//
//-------------Functions for accessing the caches---------//
//-----------------------------------------------------------------//

/**
 * Retrieves a specific property from a rider object in the cache with strict validation.
 * Returns a custom error message if the property is missing or invalid.
 *
 * @param {string} zwiftId - The unique identifier for the rider.
 * @param {string} property - The property name to retrieve from the rider object.
 * @param {Object} cache - The cache object containing rider data, keyed by zwiftId.
 * @param {string} missingMsg - The custom error message to return if the property is missing or invalid.
 * @returns {string|*} The value of the requested property, or an error message if not found or invalid.
 */
function getRiderPropertyFromCacheStrict(zwiftId, property, cache, missingMsg) {
    if (typeof zwiftId !== "string" || zwiftId.trim() === "") return ERROR_MESSAGES.INVALID_ID;
    const key = zwiftId.trim();
    if (isEmpty(cache) || typeof cache !== "object") return ERROR_MESSAGES.CACHE_EMPTY;
    const rider = cache[key];
    if (isEmpty(rider) || typeof rider !== "object") return ERROR_MESSAGES.RIDER_MISSING;
    if (!hasValidStringProps(rider, [property])) return missingMsg;
    return (rider && rider[property]) ? rider[property] : missingMsg;
}

/**
 * Retrieves a specific property from a rider object in the cache with general validation.
 * Returns a standard error message if the property is missing or empty.
 *
 * @param {string} zwiftId - The unique identifier for the rider.
 * @param {string} propertyName - The property name to retrieve from the rider object.
 * @param {Object} cache - The cache object containing rider data, keyed by zwiftId.
 * @returns {string|*} The value of the requested property, or a standard error message if not found or empty.
 */
function getRiderPropertyFromCache(zwiftId, propertyName, cache) {
    if (typeof zwiftId !== "string" || zwiftId.trim() === "") return ERROR_MESSAGES.INVALID_ID;
    if (typeof propertyName !== "string" || propertyName.trim() === "") return ERROR_MESSAGES.INVALID_PROPERTY;
    const key = zwiftId.trim();
    const prop = propertyName.trim();
    if (isEmpty(cache) || typeof cache !== "object") return ERROR_MESSAGES.CACHE_EMPTY;
    const rider = cache[key];
    if (isEmpty(rider) || typeof rider !== "object") return ERROR_MESSAGES.RIDER_MISSING;
    if (rider[prop] === undefined || rider[prop] === null || isEmpty(rider[prop])) return ERROR_MESSAGES.PROPERTY_MISSING;
    return rider[prop];
}


export {
    onPersonalGoogleDriveRefreshRidersClick,
    onPublicGoogleDriveLinkRefreshRidersClick,
    onAzureBlobStorageRefreshRidersClick,
    refreshRiderData,
    fetchJsonFromGoogleDriveFile,
    fetchJsonFromPublicGoogleDriveLink,
    fetchJsonFromUrl,
    hasInternetConnection
};