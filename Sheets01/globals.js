// Sheets01/public/globals.js

// Global cache object for raw rider data
var RIDER_CACHE_FROM_REMOTE_SOURCE = null;

// Global cache object for pre-processed rider data 
var RIDER_CACHE_LOCAL = null;

// Global configuration for remote sources
var RIDERS_ONEDRIVE_FILENAME = "everyone_in_club_ZsunItems_2025_09_22.json";
var RIDERS_AZURE_BLOB_URL = "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";