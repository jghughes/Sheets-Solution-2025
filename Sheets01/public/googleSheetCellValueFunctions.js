

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