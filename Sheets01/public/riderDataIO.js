
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
        var ridersRawData = fetchFunction();
        if (!ridersRawData) {
            showToast("No data returned from fetch function.", "Error", operationName);
            logToSheet(operationName, "Failure", "No data returned from fetch function.");
            return;
        }
        var validation = isValidRawRiderData(ridersRawData);

        if (validation === true) {
            var result = makeCustomizedRiderData(ridersRawData);
            if (!result.success) {
                reportError(result.error, operationName);
                return;
            }
            var preprocessedRidersData = result.data;

            if (!preprocessedRidersData) {
                reportError("Preprocessed rider data is empty.", operationName);
                return;
            }
            RIDER_CACHE_FROM_REMOTE_SOURCE = ridersRawData;
            RIDER_CACHE_LOCAL = preprocessedRidersData;
            showToast(successMessage, "Success", operationName);
            logToSheet(operationName, "Success", successMessage);
        } else {
            var errorMsg = `${errorPrefix} data fetch error: ${validation}`;
            reportError(errorMsg, operationName);
        }
    } catch (e) {
        var catchMsg = `${errorPrefix} unexpected error: ${e.message}`;
        reportError(catchMsg, operationName, e);
    }
}

/**
 * Loads all riders from OneDrive and updates the global cache.
 * Intended to be triggered by a user action in Google Sheets.
 */
function refreshRiderDataFromOneDrive() {
    refreshRiderData(
        fetchBlobOfRidersFromOneDrive,
        "Rider data loaded and validated.",
        "Rider",
        "OneDrive"
    );
}

/**
 * Loads all riders from Azure Blob Storage and updates the global cache.
 * Intended to be triggered by a user action in Google Sheets.
 */
function refreshRiderDataFromAzureBlobStorage() {
    refreshRiderData(
        fetchBlobOfRidersFromAzureBlobStorage,
        "Rider data loaded and validated from Azure Blob Storage.",
        "Azure Blob",
        "AzureBlob"
    );
}

/**
 * Loads and returns all riders as a dictionary from the JSON file in Google Drive.
 * Handles errors gracefully for Google Sheets usage, including JSON parse errors.
 * @returns {Object|null} Dictionary of rider objects, keyed by zwift_id, or null if error.
 */
function fetchBlobOfRidersFromOneDrive() {
    var fileName = RIDERS_ONEDRIVE_FILENAME;
    try {
        var files = DriveApp.getFilesByName(fileName);

        if (!files.hasNext()) {
            showToast(`File not found: ${fileName}`, "Error", "OneDrive");
            return null;
        }

        var file = files.next();
        var content = file.getBlob().getDataAsString();
        var ridersDict;

        try {
            ridersDict = JSON.parse(content);
        } catch (parseError) {
            reportError("OneDrive fetch error: Invalid JSON format.", "OneDrive");
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
    var blobUrl = RIDERS_AZURE_BLOB_URL;
    try {
        var response = UrlFetchApp.fetch(blobUrl);

        if (response.getResponseCode() !== 200) {
            showToast(
                `Failed to fetch blob from Azure Blob Storage: ${response.getResponseCode()}`,
                "Error",
                "AzureBlob"
            );
            return null;
        }

        var content = response.getContentText();
        var ridersDict;

        try {
            ridersDict = JSON.parse(content);
        } catch (parseError) {
            reportError("Azure Blob fetch error: Invalid JSON format.", "AzureBlob");
            return null;
        }

        return ridersDict;
    } catch (e) {
        reportError(`Azure Blob fetch error: ${e.message}`, "AzureBlob", e);
        return null;
    }
}
