"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderItem = void 0;
exports.serializeRiderItem = serializeRiderItem;
exports.deserializeRiderItem = deserializeRiderItem;
exports.deserializeRiderItems = deserializeRiderItems;
const ParsersAndSerializers_1 = require("../utils/ParsersAndSerializers");
class RiderItem {
    constructor(rawJson) {
        this.zwiftId = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwift_id"], ParsersAndSerializers_1.parseType.stringType, "");
        this.name = (0, ParsersAndSerializers_1.parseField)(rawJson, ["name"], ParsersAndSerializers_1.parseType.stringType, "");
        this.country_alpha2 = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwiftracingapp_country_alpha2"], ParsersAndSerializers_1.parseType.stringType, "");
        this.weightKg = (0, ParsersAndSerializers_1.parseField)(rawJson, ["weight_kg"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.heightCm = (0, ParsersAndSerializers_1.parseField)(rawJson, ["height_cm"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.gender = (0, ParsersAndSerializers_1.parseField)(rawJson, ["gender"], ParsersAndSerializers_1.parseType.stringType, "");
        this.ageYears = (0, ParsersAndSerializers_1.parseField)(rawJson, ["age_years"], ParsersAndSerializers_1.parseType.intType, 0);
        this.ageGroup = (0, ParsersAndSerializers_1.parseField)(rawJson, ["age_group"], ParsersAndSerializers_1.parseType.stringType, "");
        this.zwiftFtpWatts = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwift_ftp"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zwiftpowerZFtpWatts = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwiftpower_zFTP"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zwiftRacingAppZpFtpWatts = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwiftracingapp_zpFTP_w"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zsunOneHourWatts = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zsun_one_hour_watts"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zsunCP = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zsun_CP"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zsunAWC = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zsun_AWC"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zwiftZrsScore = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwift_zrs"], ParsersAndSerializers_1.parseType.intType, 0);
        this.zwiftCatOpen = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwift_cat_open"], ParsersAndSerializers_1.parseType.stringType, "");
        this.zwiftCatFemale = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwift_cat_female"], ParsersAndSerializers_1.parseType.stringType, "");
        this.zwiftRacingAppVeloRating = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwiftracingapp_velo_rating_30_days"], ParsersAndSerializers_1.parseType.intType, 0);
        this.zwiftRacingAppCatNum = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwiftracingapp_cat_num_30_days"], ParsersAndSerializers_1.parseType.intType, 0);
        this.zwiftRacingAppCatName = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwiftracingapp_cat_name_30_days"], ParsersAndSerializers_1.parseType.stringType, "");
        this.zwiftRacingAppCP = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwiftracingapp_CP"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zwiftRacingAppAWC = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zwiftracingapp_AWC"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zsunOneHourCurveCoefficient = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zsun_one_hour_curve_coefficient"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zsunOneHourCurveExponent = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zsun_one_hour_curve_exponent"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zsunTTTPullCurveCoefficient = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zsun_TTT_pull_curve_coefficient"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zsunTTTPullCurveExponent = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zsun_TTT_pull_curve_exponent"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zsunTTTPullCurveFitRSquared = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zsun_TTT_pull_curve_fit_r_squared"], ParsersAndSerializers_1.parseType.floatType, 0.0);
        this.zsunWhenCurvesFitted = (0, ParsersAndSerializers_1.parseField)(rawJson, ["zsun_when_curves_fitted"], ParsersAndSerializers_1.parseType.dateType, null);
        this._isRiderItem = true;
    }
}
exports.RiderItem = RiderItem;
function serializeRiderItemObject(r) {
    if (!r || typeof r !== "object")
        return {};
    if (!(r instanceof RiderItem) && !r._isRiderItem)
        return {};
    return {
        zwift_id: (0, ParsersAndSerializers_1.serializeType)(r.zwiftId, ParsersAndSerializers_1.parseType.stringType, ""),
        name: (0, ParsersAndSerializers_1.serializeType)(r.name, ParsersAndSerializers_1.parseType.stringType, ""),
        zwiftracingapp_country_alpha2: (0, ParsersAndSerializers_1.serializeType)(r.country_alpha2, ParsersAndSerializers_1.parseType.stringType, ""),
        weight_kg: (0, ParsersAndSerializers_1.serializeType)(r.weightKg, ParsersAndSerializers_1.parseType.floatType, 0),
        height_cm: (0, ParsersAndSerializers_1.serializeType)(r.heightCm, ParsersAndSerializers_1.parseType.floatType, 0),
        gender: (0, ParsersAndSerializers_1.serializeType)(r.gender, ParsersAndSerializers_1.parseType.stringType, ""),
        age_years: (0, ParsersAndSerializers_1.serializeType)(r.ageYears, ParsersAndSerializers_1.parseType.intType, 0),
        age_group: (0, ParsersAndSerializers_1.serializeType)(r.ageGroup, ParsersAndSerializers_1.parseType.stringType, ""),
        zwift_ftp: (0, ParsersAndSerializers_1.serializeType)(r.zwiftFtpWatts, ParsersAndSerializers_1.parseType.floatType, 0),
        zwiftpower_zFTP: (0, ParsersAndSerializers_1.serializeType)(r.zwiftpowerZFtpWatts, ParsersAndSerializers_1.parseType.floatType, 0),
        zwiftracingapp_zpFTP_w: (0, ParsersAndSerializers_1.serializeType)(r.zwiftRacingAppZpFtpWatts, ParsersAndSerializers_1.parseType.floatType, 0),
        zsun_one_hour_watts: (0, ParsersAndSerializers_1.serializeType)(r.zsunOneHourWatts, ParsersAndSerializers_1.parseType.floatType, 0),
        zsun_CP: (0, ParsersAndSerializers_1.serializeType)(r.zsunCP, ParsersAndSerializers_1.parseType.floatType, 0),
        zsun_AWC: (0, ParsersAndSerializers_1.serializeType)(r.zsunAWC, ParsersAndSerializers_1.parseType.floatType, 0),
        zwift_zrs: (0, ParsersAndSerializers_1.serializeType)(r.zwiftZrsScore, ParsersAndSerializers_1.parseType.intType, 0),
        zwift_cat_open: (0, ParsersAndSerializers_1.serializeType)(r.zwiftCatOpen, ParsersAndSerializers_1.parseType.stringType, ""),
        zwift_cat_female: (0, ParsersAndSerializers_1.serializeType)(r.zwiftCatFemale, ParsersAndSerializers_1.parseType.stringType, ""),
        zwiftracingapp_velo_rating_30_days: (0, ParsersAndSerializers_1.serializeType)(r.zwiftRacingAppVeloRating, ParsersAndSerializers_1.parseType.intType, 0),
        zwiftracingapp_cat_num_30_days: (0, ParsersAndSerializers_1.serializeType)(r.zwiftRacingAppCatNum, ParsersAndSerializers_1.parseType.intType, 0),
        zwiftracingapp_cat_name_30_days: (0, ParsersAndSerializers_1.serializeType)(r.zwiftRacingAppCatName, ParsersAndSerializers_1.parseType.stringType, ""),
        zwiftracingapp_CP: (0, ParsersAndSerializers_1.serializeType)(r.zwiftRacingAppCP, ParsersAndSerializers_1.parseType.floatType, 0),
        zwiftracingapp_AWC: (0, ParsersAndSerializers_1.serializeType)(r.zwiftRacingAppAWC, ParsersAndSerializers_1.parseType.floatType, 0),
        zsun_one_hour_curve_coefficient: (0, ParsersAndSerializers_1.serializeType)(r.zsunOneHourCurveCoefficient, ParsersAndSerializers_1.parseType.floatType, 0),
        zsun_one_hour_curve_exponent: (0, ParsersAndSerializers_1.serializeType)(r.zsunOneHourCurveExponent, ParsersAndSerializers_1.parseType.floatType, 0),
        zsun_TTT_pull_curve_coefficient: (0, ParsersAndSerializers_1.serializeType)(r.zsunTTTPullCurveCoefficient, ParsersAndSerializers_1.parseType.floatType, 0),
        zsun_TTT_pull_curve_exponent: (0, ParsersAndSerializers_1.serializeType)(r.zsunTTTPullCurveExponent, ParsersAndSerializers_1.parseType.floatType, 0),
        zsun_TTT_pull_curve_fit_r_squared: (0, ParsersAndSerializers_1.serializeType)(r.zsunTTTPullCurveFitRSquared, ParsersAndSerializers_1.parseType.floatType, 0),
        zsun_when_curves_fitted: (0, ParsersAndSerializers_1.serializeType)(r.zsunWhenCurvesFitted, ParsersAndSerializers_1.parseType.dateType, null)
    };
}
function serializeRiderItem(r) {
    const obj = serializeRiderItemObject(r);
    try {
        return JSON.stringify(obj);
    }
    catch (e) {
        return "{}";
    }
}
function deserializeRiderItem(jsonOrObject) {
    if (jsonOrObject == null)
        return null;
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
}
function deserializeRiderItems(jsonOrArray) {
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
        const rider = deserializeRiderItem(arr[i]);
        if (rider)
            result.push(rider);
    }
    return result;
}
function makeRiderInitials(rider) {
    if (!rider || typeof rider.name !== "string" || rider.name.trim() === "")
        return "";
    return rider.name
        .trim()
        .split(/\s+/)
        .reduce((acc, part) => acc + (part ? part.charAt(0).toLowerCase() : ""), "");
}
function makeRiderStats01(rider) {
    var _a;
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
    return `${prettyZwiftCat} (${prettyZFtpWkg} - ${rider ? String((_a = rider.zwiftZrsScore) !== null && _a !== void 0 ? _a : "") : ""})`;
}
function makeRiderStats02(rider) {
    var _a, _b, _c;
    if (!rider)
        return "";
    return `${String((_a = rider.zwiftRacingAppCatNum) !== null && _a !== void 0 ? _a : "")} (${String((_b = rider.zwiftRacingAppVeloRating) !== null && _b !== void 0 ? _b : "")} - ${String((_c = rider.zwiftRacingAppCatName) !== null && _c !== void 0 ? _c : "")})`;
}
//# sourceMappingURL=RiderItem.js.map