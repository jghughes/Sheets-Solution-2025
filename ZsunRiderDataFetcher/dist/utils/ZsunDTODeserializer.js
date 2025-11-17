"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeSingleRiderStatsDto = deserializeSingleRiderStatsDto;
const RiderStatsDto_1 = require("../models/RiderStatsDto");
const SerialisationUtils_1 = require("../utils/SerialisationUtils");
/**
 * Attempts to parse a JSON string which is known to be
 * a single serialised RiderStatsDto.
 * Returns null if the string is not valid JSON or not an object.
 */
function deserializeSingleRiderStatsDto(jsonString) {
    if (typeof jsonString !== "string" || jsonString.trim() === "") {
        return null;
    }
    let obj;
    try {
        obj = JSON.parse(jsonString);
    }
    catch (err) {
        // Optionally log the error for debugging
        // console.error("Failed to parse JSON in deserializeRiderStatsDto:", err);
        return null;
    }
    if (!obj || typeof obj !== "object" || obj === null || Array.isArray(obj)) {
        return null;
    }
    const dto = new RiderStatsDto_1.RiderStatsDto();
    dto.zwift_id = (0, SerialisationUtils_1.parseField)(obj, ["zwift_id"], SerialisationUtils_1.parseType.stringType, "");
    dto.name = (0, SerialisationUtils_1.parseField)(obj, ["name"], SerialisationUtils_1.parseType.stringType, "");
    dto.zwiftracingapp_country_alpha2 = (0, SerialisationUtils_1.parseField)(obj, ["zwiftracingapp_country_alpha2"], SerialisationUtils_1.parseType.stringType, "");
    dto.weight_kg = (0, SerialisationUtils_1.parseField)(obj, ["weight_kg"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.height_cm = (0, SerialisationUtils_1.parseField)(obj, ["height_cm"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.gender = (0, SerialisationUtils_1.parseField)(obj, ["gender"], SerialisationUtils_1.parseType.stringType, "");
    dto.age_years = (0, SerialisationUtils_1.parseField)(obj, ["age_years"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.age_group = (0, SerialisationUtils_1.parseField)(obj, ["age_group"], SerialisationUtils_1.parseType.stringType, "");
    dto.zwift_ftp_watts = (0, SerialisationUtils_1.parseField)(obj, ["zwift_ftp_watts"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zwiftpower_zFTP_watts = (0, SerialisationUtils_1.parseField)(obj, ["zwiftpower_zFTP_watts"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zwiftracingapp_zpFTP_watts = (0, SerialisationUtils_1.parseField)(obj, ["zwiftracingapp_zpFTP_watts"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zsun_one_hour_watts = (0, SerialisationUtils_1.parseField)(obj, ["zsun_one_hour_watts"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zsun_CP_watts = (0, SerialisationUtils_1.parseField)(obj, ["zsun_CP_watts"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zsun_AWC_kJ = (0, SerialisationUtils_1.parseField)(obj, ["zsun_AWC_kJ"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zwift_zrs_score = (0, SerialisationUtils_1.parseField)(obj, ["zwift_zrs_score"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zwift_cat_open = (0, SerialisationUtils_1.parseField)(obj, ["zwift_cat_open"], SerialisationUtils_1.parseType.stringType, "");
    dto.zwift_cat_female = (0, SerialisationUtils_1.parseField)(obj, ["zwift_cat_female"], SerialisationUtils_1.parseType.stringType, "");
    dto.zwiftracingapp_velo_rating_30_days = (0, SerialisationUtils_1.parseField)(obj, ["zwiftracingapp_velo_rating_30_days"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zwiftracingapp_cat_num_30_days = (0, SerialisationUtils_1.parseField)(obj, ["zwiftracingapp_cat_num_30_days"], SerialisationUtils_1.parseType.intType, 0);
    dto.zwiftracingapp_cat_name_30_days = (0, SerialisationUtils_1.parseField)(obj, ["zwiftracingapp_cat_name_30_days"], SerialisationUtils_1.parseType.stringType, "");
    dto.zwiftracingapp_CP_watts = (0, SerialisationUtils_1.parseField)(obj, ["zwiftracingapp_CP_watts"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zwiftracingapp_AWC_kJ = (0, SerialisationUtils_1.parseField)(obj, ["zwiftracingapp_AWC_kJ"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zsun_one_hour_curve_coefficient = (0, SerialisationUtils_1.parseField)(obj, ["zsun_one_hour_curve_coefficient"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zsun_one_hour_curve_exponent = (0, SerialisationUtils_1.parseField)(obj, ["zsun_one_hour_curve_exponent"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zsun_TTT_pull_curve_coefficient = (0, SerialisationUtils_1.parseField)(obj, ["zsun_TTT_pull_curve_coefficient"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zsun_TTT_pull_curve_exponent = (0, SerialisationUtils_1.parseField)(obj, ["zsun_TTT_pull_curve_exponent"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zsun_TTT_pull_curve_fit_r_squared = (0, SerialisationUtils_1.parseField)(obj, ["zsun_TTT_pull_curve_fit_r_squared"], SerialisationUtils_1.parseType.floatType, 0.0);
    dto.zsun_when_curves_fitted = (0, SerialisationUtils_1.parseField)(obj, ["zsun_when_curves_fitted"], SerialisationUtils_1.parseType.stringType, "");
    return dto;
}
//# sourceMappingURL=RiderStatsDtoDeserializer.js.map