// mappers.js

/**
 * Maps normalized property names to their corresponding keys in the raw rider JSON data,
 * along with default values to use if the property is missing or undefined.
 *
 * Each entry has the form:
 *   normalizedName: { key: "source_json_property", default: <defaultValue> }
 *
 * This map is used by mapRiderProperties() to produce a consistent, normalized rider object
 * regardless of missing or incomplete data from the source.
 */
const riderPropertyMap = {
    zwiftId: { key: "zwift_id", default: "" },
    name: { key: "name", default: "" },
    weightKg: { key: "weight_kg", default: null },
    heightCm: { key: "height_cm", default: null },
    gender: { key: "gender", default: "" },
    ageYears: { key: "age_years", default: null },
    ageGroup: { key: "age_group", default: "" },
    zwiftFtp: { key: "zwift_ftp", default: null },
    zwiftpowerZFtp: { key: "zwiftpower_zFTP", default: null },
    zraZpFtpW: { key: "zwiftracingapp_zpFTP_w", default: null },
    zsunOneHourWatts: { key: "zsun_one_hour_watts", default: null },
    zsunCP: { key: "zsun_CP", default: null },
    zsunAWC: { key: "zsun_AWC", default: null },
    zwiftZrs: { key: "zwift_zrs", default: "?" },
    zwiftCat: { key: "zwift_cat", default: "?" },
    zraScore: { key: "zwiftracingapp_score", default: "?" },
    zraCatNum: { key: "zwiftracingapp_cat_num", default: "?" },
    zraCatName: { key: "zwiftracingapp_cat_name", default: "?" },
    zraCP: { key: "zwiftracingapp_CP", default: null },
    zraAWC: { key: "zwiftracingapp_AWC", default: null },
    zsunOneHourCurveCoefficient: { key: "zsun_one_hour_curve_coefficient", default: null },
    zsunOneHourCurveExponent: { key: "zsun_one_hour_curve_exponent", default: null },
    zsunTTTPullCurveCoefficient: { key: "zsun_TTT_pull_curve_coefficient", default: null },
    zsunTTTPullCurveExponent: { key: "zsun_TTT_pull_curve_exponent", default: null },
    zsunTTTPullCurveFitRSquared: { key: "zsun_TTT_pull_curve_fit_r_squared", default: null },
    zsunWhenCurvesFitted: { key: "zsun_when_curves_fitted", default: "" }
};

/**
 * Maps a raw rider JSON object to a normalized object with consistent property names and default values.
 *
 * @param {Object} rider - The raw rider object from source JSON data.
 * @returns {Object} An object with normalized property names and defaults for missing values.
 *                   See `riderPropertyMap` for all mapped properties.
 */
function mapRiderProperties(rawRider) {
    const normalizedRider = {};
    for (const [normalizedProp, { key: sourceKey, default: defaultValue }] of Object.entries(riderPropertyMap)) {
        normalizedRider[normalizedProp] = rawRider[sourceKey] ?? defaultValue;
    }
    return normalizedRider;
}