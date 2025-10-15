
// you MUST omit the following import statements in Google Apps Script especially the first one


import {
    showToast,
    logToSheet,
    reportError
} from "./appUtils.js";




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