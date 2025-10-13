// riderUtils.js
// Utility functions for rider-related operations - these are all pure 
// functions that can be tested in isolation.


/**
 * Checks if every value in raw data is minimally valid as a dictionary
 * with each item having "zwift_id" and "name" properties.
 * @param {Object} ridersRawData - The raw riders data dictionary.
 * @return {true|string} true if valid, otherwise a description of the first problem found.
 */
function isValidRawRiderData(ridersRawData) {
    if (
        !ridersRawData ||
        typeof ridersRawData !== "object"
    ) {
        return "Cache is not an object.";
    }

    var keys = Object.keys(ridersRawData);
    if (keys.length === 0) {
        return "Raw rider data is empty.";
    }

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = ridersRawData[key];

        if (
            typeof value !== "object" ||
            value === null
        ) {
            return `Value for key '${key}' is not an object.`;
        }
        if (!value.hasOwnProperty("zwift_id")) {
            return `Value for key '${key}' is missing property 'zwift_id'.`;
        }
        if (!value.hasOwnProperty("name")) {
            return `Value for key '${key}' is missing property 'name'.`;
        }
    }

    return true;
}

/**
 * Make a simple concise dictionary of preprocessed data
 * that after validation with isValidCleanRiderData
 * can be stored in RIDER_CACHE_LOCAL. to allow
 * fast lookups of rider names and other properties and
 * custom stats. in a future feature, this file can be
 * abbreviated to only include the subset of zwiftIds
 * we care about to achieve faster lookups.
 * Handles errors gracefully for Google Sheets usage.
 * @param {Object} ridersRawData - The raw riders data dictionary.
 * @returns {Object|null} Dictionary of rider objects, keyed by zwift_id, or null if error.
 */
function makeCustomizedRiderData(ridersRawData) {
    if (!ridersRawData || typeof ridersRawData !== "object") {
        return { success: false, error: "Input data is not an object." };
    }

    const keys = Object.keys(ridersRawData);
    if (keys.length === 0) {
        return { success: false, error: "Input data is empty." };
    }

    const customizedRiderDictionaryObject = {};
    const skipped = [];

    for (let i = 0; i < keys.length; i++) {
        const value = ridersRawData[keys[i]];
        if (
            typeof value !== "object" || value === null ||
                !value.hasOwnProperty("zwift_id") ||
                !value.hasOwnProperty("name")
        ) {
            skipped.push(keys[i]);
            continue;
        }

        const zwiftId = typeof value["zwift_id"] === "string" ? value["zwift_id"].trim() : "";
        if (!zwiftId) {
            skipped.push(keys[i]);
            continue;
        }

        const name = (typeof value["name"] === "string" && value["name"].trim() !== "")
            ? value["name"].trim()
            : "{name} missing";

        const cleanRiderObject = {
            zwift_id: zwiftId,
            name: name
        };

        try {
            cleanRiderObject.riderStats01 = makeRiderStats01(zwiftId, ridersRawData);
        } catch (e) {
            cleanRiderObject.riderStats01 = "{riderStats01} error";
        }

        customizedRiderDictionaryObject[zwiftId] = cleanRiderObject;
    }

    return { success: true, data: customizedRiderDictionaryObject, skipped };
}

/**
 * Returns a formatted stats string for a given zwiftId from the global cache.
 * If the rider is not found, returns the zwiftId.
 * If any required property is missing, inserts "?" for that value.
 *
 * @param {string} zwiftId - The Zwift ID to look up.
 * @param {Object} ridersRawData - The raw riders data dictionary.
 * @return {string} The formatted stats string or the zwiftId if not found.
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

    // De-structure with defaults
    const {
        name = "",
        zwift_cat = "?",
        zwiftracingapp_zpFTP_w,
        weight_kg,
        zwift_zrs = "?"
    } = rider;

    const nameParts = name.trim().split(/\s+/);
    const prettyRiderName =
        nameParts[0]
            ? (nameParts[0][0] || "?").toLowerCase() +
            (nameParts[1] ? (nameParts[1][0] || "?").toLowerCase() : "?")
            : "??";

    // pretty_zFTP_wkg: check both values are present and valid
    let prettyZFtpWkg = "?";
    const zftp = parseFloat(zwiftracingapp_zpFTP_w);
    const weight = parseFloat(weight_kg);
    if (
        zwiftracingapp_zpFTP_w != null &&
            weight_kg != null &&
            !isNaN(zftp) &&
            !isNaN(weight) &&
            weight !== 0
    ) {
        prettyZFtpWkg = (zftp / weight).toFixed(2);
    }

    return `${zwift_cat} (${prettyZFtpWkg} - ${zwift_zrs})  ${prettyRiderName}`;
}


// At the end of riderUtils.js
export {
    isValidRawRiderData,
    makeCustomizedRiderData,
    makeRiderStats01
    };