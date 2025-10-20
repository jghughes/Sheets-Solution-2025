"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderItem = exports.deserializeRiderItems = exports.deserializeRiderItem = exports.serializeRiderItem = void 0;
// Sheets01\src\models\RiderItem.js
const ParsersAndSerializers_js_1 = require("../utils/ParsersAndSerializers.js");
/**
 * RiderItem class that uses parseField helpers to normalize raw JSON fields.
 *
 * @param {Object|null} rawJson - Raw object (parsed JSON) with snake_cased keys.
 */
class RiderItem {
    constructor(rawJson = {}) {
        this.zwiftId = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwift_id"], ParsersAndSerializers_js_1.ParseType.STRING, "");
        this.name = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["name"], ParsersAndSerializers_js_1.ParseType.STRING, "");
        this.country_alpha2 = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwiftracingapp_country_alpha2"], ParsersAndSerializers_js_1.ParseType.STRING, "");
        this.weightKg = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["weight_kg"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.heightCm = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["height_cm"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.gender = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["gender"], ParsersAndSerializers_js_1.ParseType.STRING, "");
        this.ageYears = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["age_years"], ParsersAndSerializers_js_1.ParseType.INT, 0);
        this.ageGroup = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["age_group"], ParsersAndSerializers_js_1.ParseType.STRING, "");
        this.zwiftFtpWatts = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwift_ftp"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zwiftpowerZFtpWatts = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwiftpower_zFTP"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zwiftRacingAppZpFtpWatts = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwiftracingapp_zpFTP_w"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zsunOneHourWatts = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zsun_one_hour_watts"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zsunCP = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zsun_CP"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zsunAWC = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zsun_AWC"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zwiftZrsScore = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwift_zrs"], ParsersAndSerializers_js_1.ParseType.INT, 0);
        this.zwiftCatOpen = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwift_cat_open"], ParsersAndSerializers_js_1.ParseType.STRING, "");
        this.zwiftCatFemale = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwift_cat_female"], ParsersAndSerializers_js_1.ParseType.STRING, "");
        this.zwiftRacingAppVeloRating = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwiftracingapp_velo_rating_30_days"], ParsersAndSerializers_js_1.ParseType.INT, 0);
        this.zwiftRacingAppCatNum = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwiftracingapp_cat_num_30_days"], ParsersAndSerializers_js_1.ParseType.INT, 0);
        this.zwiftRacingAppCatName = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwiftracingapp_cat_name_30_days"], ParsersAndSerializers_js_1.ParseType.STRING, "");
        this.zwiftRacingAppCP = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwiftracingapp_CP"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zwiftRacingAppAWC = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zwiftracingapp_AWC"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zsunOneHourCurveCoefficient = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zsun_one_hour_curve_coefficient"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zsunOneHourCurveExponent = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zsun_one_hour_curve_exponent"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zsunTTTPullCurveCoefficient = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zsun_TTT_pull_curve_coefficient"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zsunTTTPullCurveExponent = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zsun_TTT_pull_curve_exponent"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zsunTTTPullCurveFitRSquared = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zsun_TTT_pull_curve_fit_r_squared"], ParsersAndSerializers_js_1.ParseType.FLOAT, 0.0);
        this.zsunWhenCurvesFitted = (0, ParsersAndSerializers_js_1.parseField)(rawJson, ["zsun_when_curves_fitted"], ParsersAndSerializers_js_1.ParseType.DATE, null);
        // marker to identify instances at runtime
        this._isRiderItem = true;
    }
}
exports.RiderItem = RiderItem;
/**
 * Create a plain serializable object representation of a RiderItem.
 *
 * @param {RiderItem|Object} r - RiderItem instance or already-normalized object with Rider fields.
 * @returns {Object} Plain object with snake_cased fields (empty object on invalid input).
 */
const serializeRiderItemObject = (r) => {
    if (!r || typeof r !== "object")
        return {};
    // Accept either RiderItem instance or an object flagged as RiderItem
    if (!(r instanceof RiderItem) && !r._isRiderItem)
        return {};
    return {
        zwift_id: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftId, ParsersAndSerializers_js_1.ParseType.STRING, ""),
        name: (0, ParsersAndSerializers_js_1.serializeType)(r.name, ParsersAndSerializers_js_1.ParseType.STRING, ""),
        zwiftracingapp_country_alpha2: (0, ParsersAndSerializers_js_1.serializeType)(r.country_alpha2, ParsersAndSerializers_js_1.ParseType.STRING, ""),
        weight_kg: (0, ParsersAndSerializers_js_1.serializeType)(r.weightKg, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        height_cm: (0, ParsersAndSerializers_js_1.serializeType)(r.heightCm, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        gender: (0, ParsersAndSerializers_js_1.serializeType)(r.gender, ParsersAndSerializers_js_1.ParseType.STRING, ""),
        age_years: (0, ParsersAndSerializers_js_1.serializeType)(r.ageYears, ParsersAndSerializers_js_1.ParseType.INT, 0),
        age_group: (0, ParsersAndSerializers_js_1.serializeType)(r.ageGroup, ParsersAndSerializers_js_1.ParseType.STRING, ""),
        zwift_ftp: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftFtpWatts, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zwiftpower_zFTP: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftpowerZFtpWatts, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zwiftracingapp_zpFTP_w: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftRacingAppZpFtpWatts, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zsun_one_hour_watts: (0, ParsersAndSerializers_js_1.serializeType)(r.zsunOneHourWatts, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zsun_CP: (0, ParsersAndSerializers_js_1.serializeType)(r.zsunCP, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zsun_AWC: (0, ParsersAndSerializers_js_1.serializeType)(r.zsunAWC, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zwift_zrs: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftZrsScore, ParsersAndSerializers_js_1.ParseType.INT, 0),
        zwift_cat_open: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftCatOpen, ParsersAndSerializers_js_1.ParseType.STRING, ""),
        zwift_cat_female: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftCatFemale, ParsersAndSerializers_js_1.ParseType.STRING, ""),
        zwiftracingapp_velo_rating_30_days: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftRacingAppVeloRating, ParsersAndSerializers_js_1.ParseType.INT, 0),
        zwiftracingapp_cat_num_30_days: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftRacingAppCatNum, ParsersAndSerializers_js_1.ParseType.INT, 0),
        zwiftracingapp_cat_name_30_days: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftRacingAppCatName, ParsersAndSerializers_js_1.ParseType.STRING, ""),
        zwiftracingapp_CP: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftRacingAppCP, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zwiftracingapp_AWC: (0, ParsersAndSerializers_js_1.serializeType)(r.zwiftRacingAppAWC, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zsun_one_hour_curve_coefficient: (0, ParsersAndSerializers_js_1.serializeType)(r.zsunOneHourCurveCoefficient, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zsun_one_hour_curve_exponent: (0, ParsersAndSerializers_js_1.serializeType)(r.zsunOneHourCurveExponent, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zsun_TTT_pull_curve_coefficient: (0, ParsersAndSerializers_js_1.serializeType)(r.zsunTTTPullCurveCoefficient, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zsun_TTT_pull_curve_exponent: (0, ParsersAndSerializers_js_1.serializeType)(r.zsunTTTPullCurveExponent, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zsun_TTT_pull_curve_fit_r_squared: (0, ParsersAndSerializers_js_1.serializeType)(r.zsunTTTPullCurveFitRSquared, ParsersAndSerializers_js_1.ParseType.FLOAT, 0),
        zsun_when_curves_fitted: (0, ParsersAndSerializers_js_1.serializeType)(r.zsunWhenCurvesFitted, ParsersAndSerializers_js_1.ParseType.DATE, null)
    };
};
/**
 * Serialize a RiderItem to a JSON string.
 *
 * - Accepts a RiderItem instance or an object marked `_isRiderItem`.
 * - On invalid input returns the JSON string for an empty object ("{}").
 *
 * @param {RiderItem|Object} r
 * @returns {string} JSON string representation
 */
const serializeRiderItem = (r) => {
    const obj = serializeRiderItemObject(r);
    try {
        return JSON.stringify(obj);
    }
    catch (e) {
        return "{}";
    }
};
exports.serializeRiderItem = serializeRiderItem;
/**
 * Deserialize a single RiderItem from a JSON string or a plain object.
 *
 * - Accepts: JSON string, plain object, or an already-constructed RiderItem.
 * - Returns: RiderItem instance, or null on invalid input.
 *
 * @param {string|Object|RiderItem} jsonOrObject
 * @returns {RiderItem|null}
 */
const deserializeRiderItem = (jsonOrObject) => {
    if (jsonOrObject == null)
        return null;
    // Already a RiderItem instance
    if (jsonOrObject instanceof RiderItem)
        return jsonOrObject;
    let obj = jsonOrObject;
    if (typeof jsonOrObject === "string") {
        const trimmed = jsonOrObject.trim();
        if (trimmed === "")
            return null;
        try {
            obj = JSON.parse(trimmed);
        }
        catch (e) {
            return null;
        }
    }
    if (!obj || typeof obj !== "object" || Array.isArray(obj))
        return null;
    try {
        return new RiderItem(obj);
    }
    catch (e) {
        return null;
    }
};
exports.deserializeRiderItem = deserializeRiderItem;
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
const deserializeRiderItems = (jsonOrArray) => {
    if (jsonOrArray == null)
        return null;
    let arr = jsonOrArray;
    if (typeof jsonOrArray === "string") {
        const trimmed = jsonOrArray.trim();
        if (trimmed === "")
            return null;
        try {
            arr = JSON.parse(trimmed);
        }
        catch (e) {
            return null;
        }
    }
    if (!Array.isArray(arr))
        return null;
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rider = (0, exports.deserializeRiderItem)(arr[i]);
        if (rider)
            result.push(rider);
    }
    return result;
};
exports.deserializeRiderItems = deserializeRiderItems;
/**
 * Returns the initials of a RiderItem's name in lower case.
 */
const makeRiderInitials = (rider) => {
    if (!rider || typeof rider.name !== "string" || rider.name.trim() === "")
        return "";
    return rider.name
        .trim()
        .split(/\s+/)
        .reduce((acc, part) => acc + (part ? part.charAt(0).toLowerCase() : ""), "");
};
/**
 * Returns a formatted rider stats string for a given RiderItem, using Zwift cat, FTP w/kg, and ZRS score.
 */
const makeRiderStats01 = (rider) => {
    let prettyZwiftCat = "";
    if (rider && typeof rider.gender === "string" && rider.gender.toLowerCase() === "f") {
        prettyZwiftCat = `${rider.zwiftCatOpen}/${rider.zwiftCatFemale}`;
    }
    else {
        prettyZwiftCat = rider ? `${rider.zwiftCatOpen}` : "";
    }
    let prettyZFtpWkg = "?";
    if (rider && rider.zwiftRacingAppZpFtpWatts != null && rider.weightKg != null && Number(rider.weightKg) !== 0) {
        prettyZFtpWkg = (Number(rider.zwiftRacingAppZpFtpWatts) / Number(rider.weightKg)).toFixed(2);
    }
    return `${prettyZwiftCat} (${prettyZFtpWkg} - ${rider ? String(rider.zwiftZrsScore ?? "") : ""})`;
};
/**
 * Returns a formatted rider stats string for a given RiderItem.
 */
const makeRiderStats02 = (rider) => {
    if (!rider)
        return "";
    return `${String(rider.zwiftRacingAppCatNum ?? "")} (${String(rider.zwiftRacingAppVeloRating ?? "")} - ${String(rider.zwiftRacingAppCatName ?? "")})`;
};
//# sourceMappingURL=RiderItem.js.map