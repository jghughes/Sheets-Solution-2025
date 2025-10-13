

//-------------------------------------------------------------------//
//-------------Functions for use as formulae in sheet cells---------//
//-----------------------------------------------------------------//

function riderName(zwiftId) {
    return getRiderNameFromCache(zwiftId, RIDER_CACHE_LOCAL);
}

function riderStats01(zwiftId) {
    return getRiderStats01FromCache(zwiftId, RIDER_CACHE_LOCAL);
}

function riderProperty(zwiftId, propertyName) {
    return getRiderPropertyFromCache(zwiftId, propertyName, RIDER_CACHE_FROM_REMOTE_SOURCE);
}