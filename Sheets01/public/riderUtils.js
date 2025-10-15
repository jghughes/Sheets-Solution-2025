// riderUtils.js
// Utility functions for rider-related operations - all pure functions, testable in isolation.

// omit the following import statements in Google Apps Script
import { mapRiderProperties } from "./mappers.js";


/**
 * Checks if every value in raw data is a minimally valid object
 * with "zwift_id" and "name" properties.
 * @param {Object} ridersRawData - The raw riders data dictionary.
 * @returns {true|string} true if valid, otherwise a description of the first problem found.
 */
function isValidRawRiderData(ridersRawData) {
    // Validation: Ensure input is a non-null object and not an array
    if (!ridersRawData || typeof ridersRawData !== "object" || Array.isArray(ridersRawData)) {
        return "Cache is not an object.";
    }

    // Use isEmpty to check if the object is empty
    if (isEmpty(ridersRawData)) {
        return "Raw rider data is empty.";
    }

    const riderKeys = Object.keys(ridersRawData);

    for (const key of riderKeys) {
        const rider = ridersRawData[key];

        // Validation: Ensure rider is a non-null object and not an array
        if (typeof rider !== "object" || rider === null || Array.isArray(rider)) {
            return `Value for key '${key}' is not an object.`;
        }
        // Validation: Use hasValidStringProps to check "zwift_id" and "name"
        if (!hasValidStringProps(rider, ["zwift_id", "name"])) {
            return `Value for key '${key}' is missing or has invalid 'zwift_id' or 'name'.`;
        }
    }

    return true;
}

/**
 * Creates a concise dictionary of preprocessed rider data.
 * After validation, can be stored in RIDER_CACHE_LOCAL for fast lookups.
 * Handles errors gracefully for Google Sheets usage.
 * @param {Object} ridersRawData - The raw riders data dictionary.
 * @returns {Object} { success, data, skipped } or { success, error }
 */
function makeCustomizedRiderData(ridersRawData) {
    // Validation: Ensure input is a non-null, non-array object
    if (
        !ridersRawData ||
            typeof ridersRawData !== "object" ||
            Array.isArray(ridersRawData)
    ) {
        return { success: false, error: "Input data is not a valid object." };
    }

    // Use isEmpty to check that input object is not empty
    if (isEmpty(ridersRawData)) {
        return { success: false, error: "Input data is empty." };
    }

    const riderIds = Object.keys(ridersRawData);
    const customizedRiders = {};
    const skippedRiderIds = [];

    for (const riderId of riderIds) {
        const rider = ridersRawData[riderId];

        // Validation: Ensure rider has valid "zwift_id" and "name" string properties
        if (!hasValidStringProps(rider, ["zwift_id", "name"])) {
            skippedRiderIds.push(riderId);
            continue;
        }

        const zwiftId = rider.zwift_id.trim();
        const name = rider.name.trim();

        const customizedRider = {
            zwift_id: zwiftId,
            name: name
        };

        try {
            customizedRider.riderStats01 = makeRiderStats01(zwiftId, ridersRawData);
        } catch (e) {
            customizedRider.riderStats01 = "{riderStats01} error";
        }
        try {
            customizedRider.riderStats02 = makeRiderStats02(zwiftId, ridersRawData);
        } catch (e) {
            customizedRider.riderStats02 = "{riderStats02} error";
        }

        customizedRiders[zwiftId] = customizedRider;
    }

    return { success: true, data: customizedRiders, skipped: skippedRiderIds };
}

/**
 * Returns a formatted stats string for a given zwiftId from the data.
 * If the rider is not found, returns the zwiftId.
 * If any required property is missing, inserts "?" for that value.
 *
 * @param {string} zwiftId - The Zwift ID to look up.
 * @param {Object} ridersRawData - The raw riders data dictionary.
 * @returns {string} The formatted stats string for Zwift categories or the zwiftId if not found.
 */
function makeRiderStats01(zwiftId, ridersRawData) {
    if (typeof zwiftId !== "string" || zwiftId.trim() === "") {
        return "Invalid zwiftID";
    }
    const key = zwiftId.trim();

    if (!ridersRawData || typeof ridersRawData !== "object") {
        return "Cache empty";
    }

    const rider = ridersRawData[key];
    if (!rider || typeof rider !== "object") {
        return key;
    }

    const props = mapRiderProperties(rider);

    const nameParts = props.name.trim().split(/\s+/);
    const tag =
        nameParts[0]
            ? (nameParts[0][0] || "?").toLowerCase() +
            (nameParts[1] ? (nameParts[1][0] || "?").toLowerCase() : "?")
            : "??";

    let prettyZFtpWkg = "?";
    const zFtpWattsAsNumberOrNaN = parseFloat(props.zraZpFtpW);
    const weightAsNumberOrNan = parseFloat(props.weightKg);
    if (
        props.zraZpFtpW != null &&
            props.weightKg != null &&
            !isNaN(zFtpWattsAsNumberOrNaN) &&
            !isNaN(weightAsNumberOrNan) &&
            weightAsNumberOrNan !== 0
    ) {
        prettyZFtpWkg = (zFtpWattsAsNumberOrNaN / weightAsNumberOrNan).toFixed(2);
    }

    return `${props.zwiftCat} (${prettyZFtpWkg} - ${props.zwiftZrs}) ${tag}`;
}



/**
 * Returns a formatted stats string for a given zwiftId from the data.
 * If the rider is not found, returns the zwiftId.
 * If any required property is missing, inserts "?" for that value.
 *
 * @param {string} zwiftId - The Zwift ID to look up.
 * @param {Object} ridersRawData - The raw riders data dictionary.
 * @returns {string} The formatted stats string for ZwiftRacing App categories or the zwiftId if not found.
 */
function makeRiderStats02(zwiftId, ridersRawData) {
    if (typeof zwiftId !== "string" || zwiftId.trim() === "") {
        return "Invalid zwiftID";
    }
    const key = zwiftId.trim();

    if (!ridersRawData || typeof ridersRawData !== "object") {
        return "Cache empty";
    }

    const rider = ridersRawData[key];
    if (!rider || typeof rider !== "object") {
        return key;
    }

    const props = mapRiderProperties(rider);

    const nameParts = props.name.trim().split(/\s+/);
    const tag =
        nameParts[0]
            ? (nameParts[0][0] || "?").toLowerCase() +
            (nameParts[1] ? (nameParts[1][0] || "?").toLowerCase() : "?")
            : "??";

    return `${props.zraCatNum} ${props.zraScore} ${props.zraCatName} - ${tag}`;
}

/**
 * Checks if an object has all required properties, and they are non-empty strings (not arrays).
 * @param {Object} objectToCheck - The object to check.
 * @param {string[]} requiredProperties - Array of required property names.
 * @returns {boolean} True if all properties exist and are valid, false otherwise.
 */
function hasValidStringProps(objectToCheck, requiredProperties) {
    if (typeof objectToCheck !== "object" || objectToCheck === null || Array.isArray(objectToCheck)) {
        return false;
    }
    return requiredProperties.every(propertyName =>
        Object.prototype.hasOwnProperty.call(objectToCheck, propertyName) &&
        typeof objectToCheck[propertyName] === "string" &&
        !Array.isArray(objectToCheck[propertyName]) &&
        !isEmpty(objectToCheck[propertyName])
    );
}
/**
 * Checks if a value is empty (null, undefined, empty string, or array/object with no items).
 * @param {*} value
 * @returns {boolean}
 */
function isEmpty(value) {
    if (value == null) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0) return true;
    return false;
}


export {
    hasValidStringProps,
    isValidRawRiderData,
    makeCustomizedRiderData,
    makeRiderStats01
};