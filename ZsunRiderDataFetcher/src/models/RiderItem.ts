import { parseType, serializeType, parseField } from "../utils/ParsersAndSerializers";

class RiderItem {
    zwiftId: string;
    name: string;
    country_alpha2: string;
    weightKg: number;
    heightCm: number;
    gender: string;
    ageYears: number;
    ageGroup: string;
    zwiftFtpWatts: number;
    zwiftpowerZFtpWatts: number;
    zwiftRacingAppZpFtpWatts: number;
    zsunOneHourWatts: number;
    zsunCP: number;
    zsunAWC: number;
    zwiftZrsScore: number;
    zwiftCatOpen: string;
    zwiftCatFemale: string;
    zwiftRacingAppVeloRating: number;
    zwiftRacingAppCatNum: number;
    zwiftRacingAppCatName: string;
    zwiftRacingAppCP: number;
    zwiftRacingAppAWC: number;
    zsunOneHourCurveCoefficient: number;
    zsunOneHourCurveExponent: number;
    zsunTTTPullCurveCoefficient: number;
    zsunTTTPullCurveExponent: number;
    zsunTTTPullCurveFitRSquared: number;
    zsunWhenCurvesFitted: Date | null;
    _isRiderItem: boolean;

    constructor(rawJson: string) {
        this.zwiftId = parseField(rawJson, ["zwift_id"], parseType.stringType, "");
        this.name = parseField(rawJson, ["name"], parseType.stringType, "");
        this.country_alpha2 = parseField(rawJson, ["zwiftracingapp_country_alpha2"], parseType.stringType, "");
        this.weightKg = parseField(rawJson, ["weight_kg"], parseType.floatType, 0.0);
        this.heightCm = parseField(rawJson, ["height_cm"], parseType.floatType, 0.0);
        this.gender = parseField(rawJson, ["gender"], parseType.stringType, "");
        this.ageYears = parseField(rawJson, ["age_years"], parseType.intType, 0);
        this.ageGroup = parseField(rawJson, ["age_group"], parseType.stringType, "");
        this.zwiftFtpWatts = parseField(rawJson, ["zwift_ftp"], parseType.floatType, 0.0);
        this.zwiftpowerZFtpWatts = parseField(rawJson, ["zwiftpower_zFTP"], parseType.floatType, 0.0);
        this.zwiftRacingAppZpFtpWatts = parseField(rawJson, ["zwiftracingapp_zpFTP_w"], parseType.floatType, 0.0);
        this.zsunOneHourWatts = parseField(rawJson, ["zsun_one_hour_watts"], parseType.floatType, 0.0);
        this.zsunCP = parseField(rawJson, ["zsun_CP"], parseType.floatType, 0.0);
        this.zsunAWC = parseField(rawJson, ["zsun_AWC"], parseType.floatType, 0.0);
        this.zwiftZrsScore = parseField(rawJson, ["zwift_zrs"], parseType.intType, 0);
        this.zwiftCatOpen = parseField(rawJson, ["zwift_cat_open"], parseType.stringType, "");
        this.zwiftCatFemale = parseField(rawJson, ["zwift_cat_female"], parseType.stringType, "");
        this.zwiftRacingAppVeloRating = parseField(rawJson, ["zwiftracingapp_velo_rating_30_days"], parseType.intType, 0);
        this.zwiftRacingAppCatNum = parseField(rawJson, ["zwiftracingapp_cat_num_30_days"], parseType.intType, 0);
        this.zwiftRacingAppCatName = parseField(rawJson, ["zwiftracingapp_cat_name_30_days"], parseType.stringType, "");
        this.zwiftRacingAppCP = parseField(rawJson, ["zwiftracingapp_CP"], parseType.floatType, 0.0);
        this.zwiftRacingAppAWC = parseField(rawJson, ["zwiftracingapp_AWC"], parseType.floatType, 0.0);
        this.zsunOneHourCurveCoefficient = parseField(rawJson, ["zsun_one_hour_curve_coefficient"], parseType.floatType, 0.0);
        this.zsunOneHourCurveExponent = parseField(rawJson, ["zsun_one_hour_curve_exponent"], parseType.floatType, 0.0);
        this.zsunTTTPullCurveCoefficient = parseField(rawJson, ["zsun_TTT_pull_curve_coefficient"], parseType.floatType, 0.0);
        this.zsunTTTPullCurveExponent = parseField(rawJson, ["zsun_TTT_pull_curve_exponent"], parseType.floatType, 0.0);
        this.zsunTTTPullCurveFitRSquared = parseField(rawJson, ["zsun_TTT_pull_curve_fit_r_squared"], parseType.floatType, 0.0);
        this.zsunWhenCurvesFitted = parseField(rawJson, ["zsun_when_curves_fitted"], parseType.dateType, null);

        this._isRiderItem = true;
    }
} function serializeRiderItemObject(r: any): Record<string, any> {
    if (!r || typeof r !== "object") return {};
    if (!(r instanceof RiderItem) && !r._isRiderItem) return {};

    return {
        zwift_id: serializeType(r.zwiftId, parseType.stringType, ""),
        name: serializeType(r.name, parseType.stringType, ""),
        zwiftracingapp_country_alpha2: serializeType(r.country_alpha2, parseType.stringType, ""),
        weight_kg: serializeType(r.weightKg, parseType.floatType, 0),
        height_cm: serializeType(r.heightCm, parseType.floatType, 0),
        gender: serializeType(r.gender, parseType.stringType, ""),
        age_years: serializeType(r.ageYears, parseType.intType, 0),
        age_group: serializeType(r.ageGroup, parseType.stringType, ""),
        zwift_ftp: serializeType(r.zwiftFtpWatts, parseType.floatType, 0),
        zwiftpower_zFTP: serializeType(r.zwiftpowerZFtpWatts, parseType.floatType, 0),
        zwiftracingapp_zpFTP_w: serializeType(r.zwiftRacingAppZpFtpWatts, parseType.floatType, 0),
        zsun_one_hour_watts: serializeType(r.zsunOneHourWatts, parseType.floatType, 0),
        zsun_CP: serializeType(r.zsunCP, parseType.floatType, 0),
        zsun_AWC: serializeType(r.zsunAWC, parseType.floatType, 0),
        zwift_zrs: serializeType(r.zwiftZrsScore, parseType.intType, 0),
        zwift_cat_open: serializeType(r.zwiftCatOpen, parseType.stringType, ""),
        zwift_cat_female: serializeType(r.zwiftCatFemale, parseType.stringType, ""),
        zwiftracingapp_velo_rating_30_days: serializeType(r.zwiftRacingAppVeloRating, parseType.intType, 0),
        zwiftracingapp_cat_num_30_days: serializeType(r.zwiftRacingAppCatNum, parseType.intType, 0),
        zwiftracingapp_cat_name_30_days: serializeType(r.zwiftRacingAppCatName, parseType.stringType, ""),
        zwiftracingapp_CP: serializeType(r.zwiftRacingAppCP, parseType.floatType, 0),
        zwiftracingapp_AWC: serializeType(r.zwiftRacingAppAWC, parseType.floatType, 0),
        zsun_one_hour_curve_coefficient: serializeType(r.zsunOneHourCurveCoefficient, parseType.floatType, 0),
        zsun_one_hour_curve_exponent: serializeType(r.zsunOneHourCurveExponent, parseType.floatType, 0),
        zsun_TTT_pull_curve_coefficient: serializeType(r.zsunTTTPullCurveCoefficient, parseType.floatType, 0),
        zsun_TTT_pull_curve_exponent: serializeType(r.zsunTTTPullCurveExponent, parseType.floatType, 0),
        zsun_TTT_pull_curve_fit_r_squared: serializeType(r.zsunTTTPullCurveFitRSquared, parseType.floatType, 0),
        zsun_when_curves_fitted: serializeType(r.zsunWhenCurvesFitted, parseType.dateType, null)
    };
}

export function serializeRiderItem(r: any): string {
    const obj = serializeRiderItemObject(r);
    try {
        return JSON.stringify(obj);
    } catch (e) {
        return "{}";
    }
}

export function deserializeRiderItem(jsonOrObject: string | object | RiderItem): RiderItem | null {
    if (jsonOrObject == null) return null;
    if (jsonOrObject instanceof RiderItem) return jsonOrObject;

    let obj = jsonOrObject;
    if (typeof jsonOrObject === "string") {
        const trimmed = jsonOrObject.trim();
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

export function deserializeRiderItems(jsonOrArray: string | any[]): RiderItem[] | null {
    if (jsonOrArray == null) return null;
    let arr = jsonOrArray;
    if (typeof jsonOrArray === "string") {
        const trimmed = jsonOrArray.trim();
        if (trimmed === "") return null;
        try {
            arr = JSON.parse(trimmed);
        } catch (e) {
            return null;
        }
    }
    if (!Array.isArray(arr)) return null;
    const result: RiderItem[] = [];
    for (let i = 0; i < arr.length; i++) {
        const rider = deserializeRiderItem(arr[i]);
        if (rider) result.push(rider);
    }
    return result;
}

function makeRiderInitials(rider: RiderItem): string {
    if (!rider || typeof rider.name !== "string" || rider.name.trim() === "") return "";
    return rider.name
        .trim()
        .split(/\s+/)
        .reduce((acc, part) => acc + (part ? part.charAt(0).toLowerCase() : ""), "");
}

function makeRiderStats01(rider: RiderItem): string {
    let prettyZwiftCat = "";
    if (rider && typeof rider.gender === "string" && rider.gender.toLowerCase() === "f") {
        prettyZwiftCat = `${rider.zwiftCatOpen}/${rider.zwiftCatFemale}`;
    } else {
        prettyZwiftCat = rider ? `${rider.zwiftCatOpen}` : "";
    }
    let prettyZFtpWkg = "?";
    if (rider && rider.zwiftRacingAppZpFtpWatts != null && rider.weightKg != null && Number(rider.weightKg) !== 0) {
        prettyZFtpWkg = (Number(rider.zwiftRacingAppZpFtpWatts) / Number(rider.weightKg)).toFixed(2);
    }
    return `${prettyZwiftCat} (${prettyZFtpWkg} - ${rider ? String(rider.zwiftZrsScore ?? "") : ""})`;
}

function makeRiderStats02(rider: RiderItem): string {
    if (!rider) return "";
    return `${String(rider.zwiftRacingAppCatNum ?? "")} (${String(rider.zwiftRacingAppVeloRating ?? "")} - ${String(rider.zwiftRacingAppCatName ?? "")})`;
}

export { RiderItem };