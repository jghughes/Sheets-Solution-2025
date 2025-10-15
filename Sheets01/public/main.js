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
//-------------------------------------------------------------------//
//-------------Functions for use as formulae in sheet cells---------//
//-----------------------------------------------------------------//

/**
 * Returns the name of the rider for the given Zwift ID.
 * Usage in Google Sheets: =riderGetName("1234")
 */
function riderGetName(zwiftId) {
    //...
}

/**
 * Returns stats for the rider for the given Zwift ID.
 * Usage in Google Sheets: =riderGetStats01("1234")
 */
function riderGetStats01(zwiftId) {
    //...
}

/**
 * Returns stats for the rider for the given Zwift ID.
 * Usage in Google Sheets: =riderGetStats01("1234")
 */
function riderGetStats02(zwiftId) {
    //...
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