// Requires: Sheets01/globals.js to be loaded before this file. esp in Google Apps Script

// omit the following import statements in Google Apps Script

import {
    RIDER_CACHE_FROM_REMOTE_SOURCE,
    RIDER_CACHE_LOCAL,
    RIDERS_ONEDRIVE_FILENAME,
    RIDERS_AZURE_BLOB_URL
} from "../globals.js";

import {
    isValidRawRiderData,
    makeCustomizedRiderData
} from "./riderUtils.js";

import {
    showToast,
    logToSheet,
    reportError
} from "./googleSheetNotificationUtils.js";


/**
 * Loads all riders from OneDrive and updates the global cache.
 * Intended to be triggered by a user clicking a button in Google Sheets.
 */
function onOneDriveRiderRefreshClick() {
    refreshRiderData(
        fetchBlobOfRidersFromOneDrive,
        "Rider data loaded and validated.",
        "Rider",
        "OneDrive"
    );
}

/**
 * Loads all riders from Azure Blob Storage and updates the global cache.
 * Intended to be triggered by a user clicking a button in Google Sheets.
 */
function onAzureBlobRiderRefreshClick() {
    refreshRiderData(
        fetchBlobOfRidersFromAzureBlobStorage,
        "Rider data loaded and validated.",
        "Azure Blob",
        "AzureBlob"
    );
}


/**
 * Generalized function to refresh rider data from any source.
 * Handles fetching, validation, preprocessing, caching, user notification, and logging.
 * @param {Function} fetchFunction - Function to fetch raw rider data.
 * @param {string} successMessage - Message to show on success.
 * @param {string} errorPrefix - Prefix for error messages.
 * @param {string} operationName - Name of the operation for logging.
 */
function refreshRiderData(fetchFunction, successMessage, errorPrefix, operationName) {
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
            const errorMsg = `${errorPrefix} data fetch error: ${validation}`;
            reportError(errorMsg, operationName);
        }
    } catch (e) {
        const catchMsg = `${errorPrefix} unexpected error: ${e.message}`;
        reportError(catchMsg, operationName, e);
    }
}

/**
 * Loads and returns all riders as a dictionary from the JSON file in Google Drive.
 * Handles errors gracefully for Google Sheets usage, including JSON parse errors.
 * @returns {Object|null} Dictionary of rider objects, keyed by zwift_id, or null if error.
 */
function fetchBlobOfRidersFromOneDrive() {
    const fileName = RIDERS_ONEDRIVE_FILENAME;
    try {
        const files = DriveApp.getFilesByName(fileName);

        if (!files.hasNext()) {
            showToast(`File not found: ${fileName}`, "Error", "OneDrive");
            return null;
        }

        const file = files.next();
        const content = file.getBlob().getDataAsString();
        let ridersDict;
        try {
            ridersDict = JSON.parse(content);
        } catch (parseError) {
            reportError("OneDrive fetch error: Invalid JSON format.", "OneDrive");
            return null;
        }

        // Check for empty data using isEmpty utility
        if (isEmpty(ridersDict)) {
            reportError("OneDrive fetch error: Data is empty.", "OneDrive");
            return null;
        }

        return ridersDict;
    } catch (e) {
        reportError(`OneDrive fetch error: ${e.message}`, "OneDrive", e);
        return null;
    }
}

/**
 * Loads and returns all riders as a dictionary from a public Azure Blob Storage JSON file.
 * Handles errors gracefully for Google Sheets usage, including JSON parse errors.
 * @returns {Object|null} Dictionary of rider objects, keyed by zwift_id, or null if error.
 */
function fetchBlobOfRidersFromAzureBlobStorage() {
    const blobUrl = RIDERS_AZURE_BLOB_URL;
    try {
        const response = UrlFetchApp.fetch(blobUrl);

        if (response.getResponseCode() !== 200) {
            showToast(
                `Failed to fetch blob from Azure Blob Storage: ${response.getResponseCode()}`,
                "Error",
                "AzureBlob"
            );
            return null;
        }

        const content = response.getContentText();
        let ridersDict;
        try {
            ridersDict = JSON.parse(content);
        } catch (parseError) {
            reportError("Azure Blob fetch error: Invalid JSON format.", "AzureBlob");
            return null;
        }

        // Check for empty data using isEmpty utility
        if (isEmpty(ridersDict)) {
            reportError("Azure Blob fetch error: Data is empty.", "AzureBlob");
            return null;
        }

        return ridersDict;
    } catch (e) {
        reportError(`Azure Blob fetch error: ${e.message}`, "AzureBlob", e);
        return null;
    }
}

export {
    onOneDriveRiderRefreshClick,
    onAzureBlobRiderRefreshClick,
    refreshRiderData,
    fetchBlobOfRidersFromOneDrive,
    fetchBlobOfRidersFromAzureBlobStorage
};