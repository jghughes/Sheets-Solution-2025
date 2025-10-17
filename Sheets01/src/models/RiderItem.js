// Sheets01\public\Models.js
import { ParseType, parseField, serializeType } from "../utils/ParsersAndSerializers.js";

/**
 * RiderItem constructor that uses parseField helpers to normalize raw JSON fields.
 *
 * @param {Object|null} rawJson - Raw object (parsed JSON) with snake_cased keys.
 */
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

    // marker to identify instances at runtime
    this._isRiderItem = true;
}

/**
 * Create a plain serializable object representation of a RiderItem.
 * Avoids methods like Array.prototype.map for GAS compatibility.
 *
 * @param {RiderItem|Object} r - RiderItem instance or already-normalized object with Rider fields.
 * @returns {Object} Plain object with snake_cased fields (empty object on invalid input).
 */
function serializeRiderItemObject(r) {
    if (!r || (typeof r !== "object") || (!(r instanceof RiderItem) && !r._isRiderItem)) {
        return {};
    }

    var answer = {
        zwift_id: serializeType(r.zwiftId, ParseType.STRING, ""),
        name: serializeType(r.name, ParseType.STRING, ""),
        zwiftracingapp_country_alpha2: serializeType(r.country_alpha2, ParseType.STRING, ""),
        weight_kg: serializeType(r.weightKg, ParseType.FLOAT, 0),
        height_cm: serializeType(r.heightCm, ParseType.FLOAT, 0),
        gender: serializeType(r.gender, ParseType.STRING, ""),
        age_years: serializeType(r.ageYears, ParseType.INT, 0),
        age_group: serializeType(r.ageGroup, ParseType.STRING, ""),
        zwift_ftp: serializeType(r.zwiftFtpWatts, ParseType.FLOAT, 0),
        zwiftpower_zFTP: serializeType(r.zwiftpowerZFtpWatts, ParseType.FLOAT, 0),
        zwiftracingapp_zpFTP_w: serializeType(r.zwiftRacingAppZpFtpWatts, ParseType.FLOAT, 0),
        zsun_one_hour_watts: serializeType(r.zsunOneHourWatts, ParseType.FLOAT, 0),
        zsun_CP: serializeType(r.zsunCP, ParseType.FLOAT, 0),
        zsun_AWC: serializeType(r.zsunAWC, ParseType.FLOAT, 0),
        zwift_zrs: serializeType(r.zwiftZrsScore, ParseType.INT, 0),
        zwift_cat_open: serializeType(r.zwiftCatOpen, ParseType.STRING, ""),
        zwift_cat_female: serializeType(r.zwiftCatFemale, ParseType.STRING, ""),
        zwiftracingapp_velo_rating_30_days: serializeType(r.zwiftRacingAppVeloRating, ParseType.INT, 0),
        zwiftracingapp_cat_num_30_days: serializeType(r.zwiftRacingAppCatNum, ParseType.INT, 0),
        zwiftracingapp_cat_name_30_days: serializeType(r.zwiftRacingAppCatName, ParseType.STRING, ""),
        zwiftracingapp_CP: serializeType(r.zwiftRacingAppCP, ParseType.FLOAT, 0),
        zwiftracingapp_AWC: serializeType(r.zwiftRacingAppAWC, ParseType.FLOAT, 0),
        zsun_one_hour_curve_coefficient: serializeType(r.zsunOneHourCurveCoefficient, ParseType.FLOAT, 0),
        zsun_one_hour_curve_exponent: serializeType(r.zsunOneHourCurveExponent, ParseType.FLOAT, 0),
        zsun_TTT_pull_curve_coefficient: serializeType(r.zsunTTTPullCurveCoefficient, ParseType.FLOAT, 0),
        zsun_TTT_pull_curve_exponent: serializeType(r.zsunTTTPullCurveExponent, ParseType.FLOAT, 0),
        zsun_TTT_pull_curve_fit_r_squared: serializeType(r.zsunTTTPullCurveFitRSquared, ParseType.FLOAT, 0),
        zsun_when_curves_fitted: serializeType(r.zsunWhenCurvesFitted, ParseType.DATE, null)
    };

    return answer;
}

/**
 * Serialize a RiderItem to a JSON string.
 *
 * - Accepts a RiderItem instance or an object marked `_isRiderItem`.
 * - On invalid input returns the JSON string for an empty object ("{}").
 *
 * @param {RiderItem|Object} r
 * @returns {string} JSON string representation
 */
export function serializeRiderItem(r) {
    var obj = serializeRiderItemObject(r);
    try {
        return JSON.stringify(obj);
    } catch (e) {
        return "{}";
    }
}

/**
 * Deserialize a single RiderItem from a JSON string or a plain object.
 *
 * - Accepts: JSON string, plain object, or an already-constructed RiderItem.
 * - Returns: RiderItem instance, or null on invalid input.
 *
 * Implementation notes:
 * - Uses new RiderItem(...) to reuse parseField normalization (including date parsing).
 * - Is defensive: catches JSON.parse errors and invalid shapes.
 *
 * @param {string|Object|RiderItem} jsonOrObject
 * @returns {RiderItem|null}
 */
export function deserializeRiderItem(jsonOrObject) {
    if (jsonOrObject == null) return null;

    // Already a RiderItem instance
    if (jsonOrObject instanceof RiderItem) return jsonOrObject;

    var obj = jsonOrObject;

    if (typeof jsonOrObject === "string") {
        var trimmed = jsonOrObject.trim();
        if (trimmed === "") return null;
        try {
            obj = JSON.parse(trimmed);
        } catch (e) {
            return null;
        }
    }

    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;

    try {
        return new RiderItem(obj);
    } catch (e) {
        return null;
    }
}

/**
 * Deserialize an array of RiderItems from a JSON array string or an array of plain objects.
 *
 * - Returns an array of RiderItem instances (empty array allowed).
 * - Skips invalid elements silently.
 * - Returns null if top-level input is invalid (not array/string).
 *
 * @param {string|Array} jsonOrArray
 * @returns {RiderItem[]|null}
 */
export function deserializeRiderItems(jsonOrArray) {
    if (jsonOrArray == null) return null;

    var arr = jsonOrArray;

    if (typeof jsonOrArray === "string") {
        var trimmed = jsonOrArray.trim();
        if (trimmed === "") return null;
        try {
            arr = JSON.parse(trimmed);
        } catch (e) {
            return null;
        }
    }

    if (!Array.isArray(arr)) return null;

    var result = [];
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var rider = deserializeRiderItem(item);
        if (rider) result.push(rider);
    }
    return result;
}

/**
 * Returns the initials of a RiderItem's name in lower case.
 *
 * GAS-friendly implementation avoids filter/map.
 *
 * @param {RiderItem} rider
 * @returns {string}
 */
function makeRiderInitials(rider) {
    if (!rider || typeof rider !== "object" || typeof rider.name !== "string" || rider.name.trim() === "") {
        return "";
    }

    var parts = rider.name.split(/\s+/);
    var initials = "";
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (part && part.length > 0) {
            initials += part.charAt(0).toLowerCase();
        }
    }
    return initials;
}

/**
 * Returns a formatted rider stats string for a given RiderItem, using Zwift cat, FTP w/kg, and ZRS score.
 *
 * @param {RiderItem} rider
 * @returns {string}
 */
function makeRiderStats01(rider) {
    var prettyZwiftCat = "";
    if (rider && rider.gender && typeof rider.gender === "string" && rider.gender.toLowerCase() === "f") {
        prettyZwiftCat = "" + rider.zwiftCatOpen + "/" + rider.zwiftCatFemale;
    } else {
        prettyZwiftCat = rider ? rider.zwiftCatOpen : "";
    }

    var prettyZFtpWkg = "?";
    if (rider && rider.zwiftRacingAppZpFtpWatts != null && rider.weightKg != null && rider.weightKg !== 0) {
        prettyZFtpWkg = (rider.zwiftRacingAppZpFtpWatts / rider.weightKg).toFixed(2);
    }

    return prettyZwiftCat + " (" + prettyZFtpWkg + " - " + (rider ? rider.zwiftZrsScore : "") + ")";
}

/**
 * Returns a formatted rider stats string for a given RiderItem.
 *
 * @param {RiderItem} rider
 * @returns {string}
 */
function makeRiderStats02(rider) {
    if (!rider) return "";
    return "" + rider.zwiftRacingAppCatNum + " (" + rider.zwiftRacingAppVeloRating + " - " + rider.zwiftRacingAppCatName + ")";
}


