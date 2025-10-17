// you MUST omit the following import statements in Google Apps Script
// and also omit the export statements at the bottom of the document

import { makeRiderStats01, makeRiderStats02 } from "./Models.js"; 
import { RepositoryOfRiders, } from "./riderRepository.js";
import {
    fetchPlainTextFileFromMyDrive,
    fetchPlainTextFileFromSharedLinkToGoogleDrive,
    fetchPlainTextFileFromUrl,
    hasInternetConnection
} from "../DataFetcher.js";
import {
    showToast,
    logToSheet,
    reportError
} from "../appScriptServices.js";

/***************************************************************
 * Remote resource target connection strings
 ***************************************************************/

const personalGoogleDriveRidersFilename = "everyone_in_club_ZsunItems_2025_09_22_modern.json"; // Example filename, replace with your own
const publicGoogleDriveRidersFileLink = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";
var azureBlobRidersFileUrl = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";

/***************************************************************
 * data repository instance
 ***************************************************************/

let riderRepository = new RepositoryOfRiders(); // Global repository instance

/***************************************************************
 * Code behind: Auto-launch sidebar on sheet open
 ***************************************************************/


function onOpen() {
    SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutputFromFile("Sidebar"));
}


/***************************************************************
 * Code behind: button clicks handled in Sidebar.html
 ***************************************************************/

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
function fetchFromMyDrive(filename = "everyone_in_club_ZsunItems_2025_09_22_modern.json") {
    refreshRiderData(
        () => fetchPlainTextFileFromMyDrive(filename, "MyDriveFetch"),
        "Rider data loaded and validated from Google MyDrive.",
        "MyDrive",
        "MasterList"
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
 * 3. Enter the function name: fetchFromGoogleDriveLink
 * 4. When the user clicks the button in the sheet, this function will be executed.
 */
function fetchFromGoogleDriveLink(link) {
    refreshRiderData(
        () => fetchPlainTextFileFromSharedLinkToGoogleDrive(link, "GoogleDriveFetch"),
        "Rider data loaded and validated from shared Google Drive.",
        "SharedGoogleDrive",
        "MasterList"
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
 * 3. Enter the function name: fetchFromUrl
 * 4. When the user clicks the button in the sheet, this function will be executed.
 */
function fetchFromUrl(url) {
    refreshRiderData(
        () => fetchPlainTextFileFromUrl(url, "HttpFetch"),
        "Rider data loaded and validated from URL.",
        "Http address", "MasterList"
    );
}

/**
 * Generalized function to refresh rider data from any source.
 * Handles fetching, validation, preprocessing, caching, user notification, and logging.
 * @param {Function} fetchFunction - Function to fetch raw rider data.
 * @param {string} successMessage - Message to show on success.
 * @param {string} operationName - Name of the operation for logging.
 */
function refreshRiderData(fetchFunction, successMessage, operationName, sheetName) {

    try {
        if (!hasInternetConnection()) {
            throw new Error("No internet connection detected.");
        }

        // Ensure the global repository exists
        if (!riderRepository) {
            riderRepository = new RepositoryOfRiders();
        }

        showToast("Loading rider data..");
        const ridersRawData = fetchFunction();
        riderRepository.loadFromJson(ridersRawData);
        writeRidersToSheet(riderRepository.getAllSortedByName(), sheetName);
        showToast(successMessage);
        logToSheet(`${operationName} succeeded. Loaded ${riderRepository.count()} riders into repository and ${sheetName} sheet.`);
        return true;
    } catch (e) {
        const catchMsg = `${operationName} unexpected error: ${e.message}`;
        reportError(catchMsg, operationName, e);
        return false;
    }

}


/**
 * Writes all riders from the repository to the master list sheet in Google Sheets.
 *
 * This function is intended to be triggered by a custom button in Google Sheets.
 * It retrieves all riders, sorts them by name, and writes them to the sheet using `writeRidersToSheet`.
 * If the repository is not initialized or an error occurs, it reports the error and returns false.
 *
 * Typical usage:
 * 1. Insert a drawing or image in Google Sheets.
 * 2. Assign the script name: onWriteRidersToMasterListClick
 * 3. Clicking the button will execute this function.
 *
 * @returns {boolean} True if the operation succeeds, false otherwise.
 */
function onWriteRidersToMasterListClick() {
    if (!riderRepository) {
        return false;
    }

    try {
        const riders = riderRepository.getAllSortedByName();
        writeRidersToSheet(riders);
        return true;
    } catch (e) {
        const catchMsg = `Unexpected error: ${e.message}`;
        reportError(catchMsg, "onWriteRidersToMasterListClick", e);
        return false;
    }
}

/***************************************************************
 * Code behind: Sheet cell formulae
 ***************************************************************/

/**
 * Returns the name of the rider for the given Zwift ID.
 * Usage in Google Sheets: =riderGetName("1234")
 */
// ReSharper disable once UnusedLocals
function riderGetName(zwiftId) {
    if (!riderRepository) {
        return "";
    }
    const rider = riderRepository.getById(zwiftId);
    return rider && rider.name ? rider.name : "";
}

/**
 * Returns stats for the rider for the given Zwift ID.
 * Usage in Google Sheets: =riderGetStats01("1234")
 */
// ReSharper disable once UnusedLocals
function riderGetStats01(zwiftId) {
    if (!riderRepository) {
        return "";
    }
    const rider = riderRepository.getById(zwiftId);
    return rider ? makeRiderStats01(rider) : "";
}

/**
 * Returns stats for the rider for the given Zwift ID.
 * Usage in Google Sheets: =riderGetStats01("1234")
 */
// ReSharper disable once UnusedLocals
function riderGetStats02(zwiftId) {
    if (!riderRepository) {
        return "";
    }
    const rider = riderRepository.getById(zwiftId);
    return rider ? makeRiderStats02(rider) : "";
}

