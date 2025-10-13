
// Global cache object for raw rider data
var RIDER_CACHE_FROM_REMOTE_SOURCE = null;

// Global cache object for pre-processed rider data 
var RIDER_CACHE_LOCAL = null;

// Global configuration for remote sources
var RIDERS_ONEDRIVE_FILENAME = "everyone_in_club_ZsunItems_2025_09_22.json";
var RIDERS_AZURE_BLOB_URL = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";

const ERROR_MESSAGES = {
    INVALID_ID: "Error: Invalid zwiftID",
    INVALID_PROPERTY: "Error: Invalid property name",
    CACHE_EMPTY: "Error: Cache empty",
    RIDER_MISSING: "Error: Rider not found",
    NAME_MISSING: "Error: {name} missing",
    STATS_MISSING: "Error: {riderStats01} missing",
    PROPERTY_MISSING: "Error: Property missing"
};

// add these ONLY for ES6 module usage (test running specifically), omit in Google Apps Script
export {
    RIDER_CACHE_FROM_REMOTE_SOURCE,
    RIDER_CACHE_LOCAL,
    RIDERS_ONEDRIVE_FILENAME,
    RIDERS_AZURE_BLOB_URL,
    ERROR_MESSAGES
    };
