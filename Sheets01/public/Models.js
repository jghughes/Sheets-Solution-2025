/**
 * Enum for parse types.
 * @readonly
 * @enum {string}
 */
var ParseType = {
    STRING: "string",
    FLOAT: "float",
    INT: "int",
    BOOLEAN: "boolean",
    DATE: "date"
};

/**
 * Looks up a value from rawJson by key (or keys), applies the default, and parses it to the specified type.
 * Handles specific error types gracefully by returning the default value.
 * Supports extension for additional data types via the ParseType enum.
 *
 * @param {Object} rawJson - The raw input object.
 * @param {string|string[]} key - The key or array of alternative keys in the raw JSON. The first present key is used.
 * @param {ParseType} type - The type to parse to. Supported: "string", "float", "int", "date".
 * @param {*} defaultValue - The default value if the key is missing, invalid, or cannot be parsed.
 * @returns {string|number|Date|null} The parsed value, or the default value if parsing fails, or null for unknown types.
 *
 * @example
 * // Basic usage with a single key
 * parseField(obj, "weight", ParseType.FLOAT, 0.0);
 *
 * // Usage with alternative keys
 * parseField(obj, ["weight_kg", "weight"], ParseType.FLOAT, 0.0);
 *
 * // Parsing a date from ISO 8601 string (returns Date object)
 * parseField(obj, "created_at", ParseType.DATE, null); // e.g. "2024-06-01T12:34:56Z"
 *
 * // Parsing a date from a timestamp (milliseconds since epoch, returns Date object)
 * parseField(obj, "created_at", ParseType.DATE, null); // e.g. 1718380800000 or "1718380800000"
 *
 * // Supported date formats for ParseType.DATE:
 * // - ISO 8601 string: "2024-06-01T12:34:56Z", "2024-06-01"
 * // - Numeric timestamp (milliseconds since epoch): 1718380800000 or "1718380800000"
 * // Returns a Date object if valid, otherwise returns defaultValue or null.
 */
function parseField(rawJson, key, type, defaultValue) {
    let valueToParse = defaultValue;

    // Support for alternative keys
    if (Array.isArray(key)) {
        for (let k of key) {
            if (rawJson[k] != null) {
                valueToParse = rawJson[k];
                break;
            }
        }
    } else {
        if (rawJson[key] != null) {
            valueToParse = rawJson[key];
        }
    }

    if (type === ParseType.STRING) {
        if (typeof valueToParse !== "string") {
            return typeof defaultValue === "string" ? defaultValue : "";
        }
        return valueToParse.trim() !== "" ? valueToParse : (typeof defaultValue === "string" ? defaultValue : "");
    }
    if (type === ParseType.FLOAT) {
        if (typeof valueToParse === "object" || typeof valueToParse === "boolean") {
            return typeof defaultValue === "number" ? defaultValue : 0.0;
        }
        let parsedNumber = parseFloat(valueToParse);
        return !isNaN(parsedNumber) ? parsedNumber : (typeof defaultValue === "number" ? defaultValue : 0.0);
    }
    if (type === ParseType.INT) {
        if (typeof valueToParse === "object" || typeof valueToParse === "boolean") {
            return typeof defaultValue === "number" ? defaultValue : 0;
        }
        let parsedNumber = parseInt(valueToParse, 10);
        return !isNaN(parsedNumber) ? parsedNumber : (typeof defaultValue === "number" ? defaultValue : 0);
    }
    if (type === ParseType.DATE) {
        let dateObj = null;
        const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
        if (typeof valueToParse === "number") {
            // Accept as timestamp (milliseconds since epoch)
            dateObj = new Date(valueToParse);
        } else if (typeof valueToParse === "string") {
            // Numeric string: treat as timestamp in ms
            if (/^\d{10,}$/.test(valueToParse)) {
                dateObj = new Date(Number(valueToParse));
            }
            // ISO 8601 format (strict check)
            else if (iso8601Regex.test(valueToParse)) {
                dateObj = new Date(valueToParse);
            } else {
                // Invalid date format, return default
                return defaultValue instanceof Date ? defaultValue : null;
            }
        } else if (valueToParse instanceof Date) {
            dateObj = valueToParse;
        }
        if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
            return dateObj;
        }
        // Parsing failed, return default
        return defaultValue instanceof Date ? defaultValue : null;
    }
    // Unknown type, return null
    return null;
}

function RiderItem(rawJson) {
    if (!rawJson) rawJson = {};

    this.zwiftId = parseField(rawJson, ["zwift_id"], ParseType.STRING, "");
    this.name = parseField(rawJson, ["name"], ParseType.STRING, "");
    this.country_alpha2 = parseField(rawJson, ["zwiftracingapp_country_alpha2"], ParseType.STRING, "");
    this.weightKg = parseField(rawJson, ["weight_kg"], ParseType.FLOAT, 0.0);
    this.heightCm = parseField(rawJson, ["height_cm"], ParseType.FLOAT, 0.0);
    this.gender = parseField(rawJson, ["gender"], ParseType.STRING, "");
    this.ageYears = parseField(rawJson, ["age_years"], ParseType.INT, 0);
    this.ageGroup = parseField(rawJson, ["age_group"], ParseType.STRING, "");
    this.zwiftFtpWatts = parseField(rawJson, ["zwift_ftp"], ParseType.FLOAT, 0.0);
    this.zwiftpowerZFtpWatts = parseField(rawJson, ["zwiftpower_zFTP"], ParseType.FLOAT, 0.0);
    this.zwiftRacingAppZpFtpWatts = parseField(rawJson, ["zwiftracingapp_zpFTP_w"], ParseType.FLOAT, 0.0);
    this.zsunOneHourWatts = parseField(rawJson, ["zsun_one_hour_watts"], ParseType.FLOAT, 0.0);
    this.zsunCP = parseField(rawJson, ["zsun_CP"], ParseType.FLOAT, 0.0);
    this.zsunAWC = parseField(rawJson, ["zsun_AWC"], ParseType.FLOAT, 0.0);
    this.zwiftZrsScore = parseField(rawJson, ["zwift_zrs"], ParseType.INT, 0);
    this.zwiftCatOpen = parseField(rawJson, ["zwift_cat_open"], ParseType.STRING, "");
    this.zwiftCatFemale = parseField(rawJson, ["zwift_cat_female"], ParseType.STRING, "");
    this.zwiftRacingAppVeloRating = parseField(rawJson, ["zwiftracingapp_velo_rating_30_days"], ParseType.INT, 0);
    this.zwiftRacingAppCatNum = parseField(rawJson, ["zwiftracingapp_cat_num_30_days"], ParseType.INT, 0);
    this.zwiftRacingAppCatName = parseField(rawJson, ["zwiftracingapp_cat_name_30_days"], ParseType.STRING, "");
    this.zwiftRacingAppCP = parseField(rawJson, ["zwiftracingapp_CP"], ParseType.FLOAT, 0.0);
    this.zwiftRacingAppAWC = parseField(rawJson, ["zwiftracingapp_AWC"], ParseType.FLOAT, 0.0);
    this.zsunOneHourCurveCoefficient = parseField(rawJson, ["zsun_one_hour_curve_coefficient"], ParseType.FLOAT, 0.0);
    this.zsunOneHourCurveExponent = parseField(rawJson, ["zsun_one_hour_curve_exponent"], ParseType.FLOAT, 0.0);
    this.zsunTTTPullCurveCoefficient = parseField(rawJson, ["zsun_TTT_pull_curve_coefficient"], ParseType.FLOAT, 0.0);
    this.zsunTTTPullCurveExponent = parseField(rawJson, ["zsun_TTT_pull_curve_exponent"], ParseType.FLOAT, 0.0);
    this.zsunTTTPullCurveFitRSquared = parseField(rawJson, ["zsun_TTT_pull_curve_fit_r_squared"], ParseType.FLOAT, 0.0);
    this.zsunWhenCurvesFitted = parseField(rawJson, ["zsun_when_curves_fitted"], ParseType.DATE, null);
}

/**
 * Returns the initials of a RiderItem's name in lower case.
 * @param {RiderItem} rider - The RiderItem object.
 * @returns {string} The initials in lower case.
 */
function makeRiderInitials(rider) {
    if (!rider || typeof rider !== "object" || typeof rider.name !== "string" || rider.name.trim() === "") {
        return "";
    }
    return rider.name
        .split(/\s+/)
        .filter(function (part) { return part.length > 0; })
        .map(function (part) { return part.charAt(0).toLowerCase(); })
        .join("");
}

/**
* Returns a formatted rider stats string for a given RiderItem, using Zwift cat, FTP w/kg, and ZRS score.
* @param {RiderItem} rider - The rider object.
* @returns {string} The formatted stats string.
*/
function makeRiderStats01(rider) {
// ReSharper disable once AssignedValueIsNeverUsed
    let prettyZwiftCat = "";
    if (rider.gender && rider.gender.toLowerCase() === "f") {
        prettyZwiftCat = `${rider.zwiftCatOpen}/${rider.zwiftCatFemale}`;
    } else {
        prettyZwiftCat = rider.zwiftCatOpen;
    }

    let prettyZFtpWkg = "?";
    if (
        rider.zwiftRacingAppZpFtpWatts != null &&
            rider.weightKg != null &&
            rider.weightKg !== 0
    ) {
        prettyZFtpWkg = (rider.zwiftRacingAppZpFtpWatts / rider.weightKg).toFixed(2);
    }

    return `${prettyZwiftCat} (${prettyZFtpWkg} - ${rider.zwiftZrsScore})`;
}

/**
* Returns a formatted rider stats string for a given RiderItem.
* @param {RiderItem} rider - The rider object.
* @returns {string} The formatted stats string.
*/
function makeRiderStats02(rider) {
    return `${rider.zwiftRacingAppCatNum} (${rider.zwiftRacingAppScore} - ${rider.zwiftRacingAppCatName})`;
}