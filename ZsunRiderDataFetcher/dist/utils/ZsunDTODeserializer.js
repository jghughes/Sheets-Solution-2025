"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeZsunDTO = deserializeZsunDTO;
const ZsunDTO_1 = require("../models/ZsunDTO");
const ParsersAndSerializers_1 = require("../utils/ParsersAndSerializers");
/**
 * Attempts to parse a JSON string and populate a ZsunDTO instance.
 * Returns null if the string is not valid JSON or not an object.
 */
function deserializeZsunDTO(jsonString) {
    if (typeof jsonString !== "string" || jsonString.trim() === "") {
        return null;
    }
    let obj;
    try {
        obj = JSON.parse(jsonString);
    }
    catch (err) {
        // Optionally log the error for debugging
        // console.error("Failed to parse JSON in deserializeZsunDTO:", err);
        return null;
    }
    if (!obj || typeof obj !== "object" || obj === null || Array.isArray(obj)) {
        return null;
    }
    const dto = new ZsunDTO_1.ZsunDTO();
    dto.zwift_id = (0, ParsersAndSerializers_1.parseField)(obj, ["zwift_id"], ParsersAndSerializers_1.parseType.stringType, "");
    dto.name = (0, ParsersAndSerializers_1.parseField)(obj, ["name"], ParsersAndSerializers_1.parseType.stringType, "");
    dto.zwiftracingapp_country_alpha2 = (0, ParsersAndSerializers_1.parseField)(obj, ["zwiftracingapp_country_alpha2"], ParsersAndSerializers_1.parseType.stringType, "");
    dto.weight_kg = (0, ParsersAndSerializers_1.parseField)(obj, ["weight_kg"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.height_cm = (0, ParsersAndSerializers_1.parseField)(obj, ["height_cm"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.gender = (0, ParsersAndSerializers_1.parseField)(obj, ["gender"], ParsersAndSerializers_1.parseType.stringType, "");
    dto.age_years = (0, ParsersAndSerializers_1.parseField)(obj, ["age_years"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.age_group = (0, ParsersAndSerializers_1.parseField)(obj, ["age_group"], ParsersAndSerializers_1.parseType.stringType, "");
    dto.zwift_ftp_watts = (0, ParsersAndSerializers_1.parseField)(obj, ["zwift_ftp_watts"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zwiftpower_zFTP_watts = (0, ParsersAndSerializers_1.parseField)(obj, ["zwiftpower_zFTP_watts"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zwiftracingapp_zpFTP_watts = (0, ParsersAndSerializers_1.parseField)(obj, ["zwiftracingapp_zpFTP_watts"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zsun_one_hour_watts = (0, ParsersAndSerializers_1.parseField)(obj, ["zsun_one_hour_watts"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zsun_CP_watts = (0, ParsersAndSerializers_1.parseField)(obj, ["zsun_CP_watts"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zsun_AWC_kJ = (0, ParsersAndSerializers_1.parseField)(obj, ["zsun_AWC_kJ"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zwift_zrs_score = (0, ParsersAndSerializers_1.parseField)(obj, ["zwift_zrs_score"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zwift_cat_open = (0, ParsersAndSerializers_1.parseField)(obj, ["zwift_cat_open"], ParsersAndSerializers_1.parseType.stringType, "");
    dto.zwift_cat_female = (0, ParsersAndSerializers_1.parseField)(obj, ["zwift_cat_female"], ParsersAndSerializers_1.parseType.stringType, "");
    dto.zwiftracingapp_velo_rating_30_days = (0, ParsersAndSerializers_1.parseField)(obj, ["zwiftracingapp_velo_rating_30_days"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zwiftracingapp_cat_num_30_days = (0, ParsersAndSerializers_1.parseField)(obj, ["zwiftracingapp_cat_num_30_days"], ParsersAndSerializers_1.parseType.intType, 0);
    dto.zwiftracingapp_cat_name_30_days = (0, ParsersAndSerializers_1.parseField)(obj, ["zwiftracingapp_cat_name_30_days"], ParsersAndSerializers_1.parseType.stringType, "");
    dto.zwiftracingapp_CP_watts = (0, ParsersAndSerializers_1.parseField)(obj, ["zwiftracingapp_CP_watts"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zwiftracingapp_AWC_kJ = (0, ParsersAndSerializers_1.parseField)(obj, ["zwiftracingapp_AWC_kJ"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zsun_one_hour_curve_coefficient = (0, ParsersAndSerializers_1.parseField)(obj, ["zsun_one_hour_curve_coefficient"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zsun_one_hour_curve_exponent = (0, ParsersAndSerializers_1.parseField)(obj, ["zsun_one_hour_curve_exponent"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zsun_TTT_pull_curve_coefficient = (0, ParsersAndSerializers_1.parseField)(obj, ["zsun_TTT_pull_curve_coefficient"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zsun_TTT_pull_curve_exponent = (0, ParsersAndSerializers_1.parseField)(obj, ["zsun_TTT_pull_curve_exponent"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zsun_TTT_pull_curve_fit_r_squared = (0, ParsersAndSerializers_1.parseField)(obj, ["zsun_TTT_pull_curve_fit_r_squared"], ParsersAndSerializers_1.parseType.floatType, 0.0);
    dto.zsun_when_curves_fitted = (0, ParsersAndSerializers_1.parseField)(obj, ["zsun_when_curves_fitted"], ParsersAndSerializers_1.parseType.stringType, "");
    return dto;
}
//# sourceMappingURL=ZsunDTODeserializer.js.map