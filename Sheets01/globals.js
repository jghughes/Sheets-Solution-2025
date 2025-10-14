
// Global cache object for raw rider data
var RIDER_CACHE_FROM_REMOTE_SOURCE = null;

// Global cache object for pre-processed rider data 
var RIDER_CACHE_LOCAL = null;


const PERSONAL_GOOGLE_DRIVE_RIDERS_FILENAME = "everyone_in_club_ZsunItems_2025_09_22.json"; // Example filename, replace with your own

// Example: Public Google Drive sharing link for a JSON file (replace with your own file's link)
const PUBLIC_GOOGLE_DRIVE_RIDERS_FILE_LINK = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";

var AZURE_BLOB_RIDERS_FILE_URL = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";

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

// add these ONLY for ES6 module usage (test running specifically), omit in Google Apps Script
export {
    RIDER_CACHE_FROM_REMOTE_SOURCE,
    RIDER_CACHE_LOCAL,
    PERSONAL_GOOGLE_DRIVE_RIDERS_FILENAME as RIDERS_GOOGLE_DRIVE_FILENAME,
    PUBLIC_GOOGLE_DRIVE_RIDERS_FILE_LINK as PUBLIC_RIDERS_GOOGLE_DRIVE_LINK,
    AZURE_BLOB_RIDERS_FILE_URL as RIDERS_AZURE_BLOB_URL,
    ERROR_MESSAGES
    };
