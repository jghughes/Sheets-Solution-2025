// omit the following import statements in Google Apps Script

import { hasValidStringProps, isEmpty } from "./jsUtils.js";
import { ERROR_MESSAGES} from "../globals.js";



function getRiderNameFromCache(zwiftId, cache) {
    return getRiderPropertyFromCacheStrict(
        zwiftId, "name", cache, ERROR_MESSAGES.NAME_MISSING
    );
}

function getRiderStats01FromCache(zwiftId, cache) {
    return getRiderPropertyFromCacheStrict(
        zwiftId, "riderStats01", cache, ERROR_MESSAGES.STATS01_MISSING
    );
}

/**
 * Retrieves a specific property from a rider object in the cache with strict validation.
 * Returns a custom error message if the property is missing or invalid.
 *
 * @param {string} zwiftId - The unique identifier for the rider.
 * @param {string} property - The property name to retrieve from the rider object.
 * @param {Object} cache - The cache object containing rider data, keyed by zwiftId.
 * @param {string} missingMsg - The custom error message to return if the property is missing or invalid.
 * @returns {string|*} The value of the requested property, or an error message if not found or invalid.
 */
function getRiderPropertyFromCacheStrict(zwiftId, property, cache, missingMsg) {
    if (typeof zwiftId !== "string" || zwiftId.trim() === "") return ERROR_MESSAGES.INVALID_ID;
    const key = zwiftId.trim();
    if (isEmpty(cache) || typeof cache !== "object") return ERROR_MESSAGES.CACHE_EMPTY;
    const rider = cache[key];
    if (isEmpty(rider) || typeof rider !== "object") return ERROR_MESSAGES.RIDER_MISSING;
    if (!hasValidStringProps(rider, [property])) return missingMsg;
    return (rider && rider[property]) ? rider[property] : missingMsg;
}

/**
 * Retrieves a specific property from a rider object in the cache with general validation.
 * Returns a standard error message if the property is missing or empty.
 *
 * @param {string} zwiftId - The unique identifier for the rider.
 * @param {string} propertyName - The property name to retrieve from the rider object.
 * @param {Object} cache - The cache object containing rider data, keyed by zwiftId.
 * @returns {string|*} The value of the requested property, or a standard error message if not found or empty.
 */
function getRiderPropertyFromCache(zwiftId, propertyName, cache) {
    if (typeof zwiftId !== "string" || zwiftId.trim() === "") return ERROR_MESSAGES.INVALID_ID;
    if (typeof propertyName !== "string" || propertyName.trim() === "") return ERROR_MESSAGES.INVALID_PROPERTY;
    const key = zwiftId.trim();
    const prop = propertyName.trim();
    if (isEmpty(cache) || typeof cache !== "object") return ERROR_MESSAGES.CACHE_EMPTY;
    const rider = cache[key];
    if (isEmpty(rider) || typeof rider !== "object") return ERROR_MESSAGES.RIDER_MISSING;
    if (rider[prop] === undefined || rider[prop] === null || isEmpty(rider[prop])) return ERROR_MESSAGES.PROPERTY_MISSING;
    return rider[prop];
}

// At the end of riderCacheAccess.js
export {
    getRiderNameFromCache,
    getRiderStats01FromCache,
    getRiderPropertyFromCache
};