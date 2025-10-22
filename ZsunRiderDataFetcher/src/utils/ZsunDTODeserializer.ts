import { ZSunDto as ZsunDTO } from "../models/ZSunDTO";
import { parseField, parseType } from "../utils/SerialisationUtils";

/**
 * Attempts to parse a JSON string which is known to be
 * a single serialised ZsunDTO.
 * Returns null if the string is not valid JSON or not an object.
 */
export function deserializeSingleZSunDto(jsonString: string): ZsunDTO | null {
    if (typeof jsonString !== "string" || jsonString.trim() === "") {
        return null;
    }
    let obj: any;
    try {
        obj = JSON.parse(jsonString);
    } catch (err) {
        // Optionally log the error for debugging
        // console.error("Failed to parse JSON in deserializeZsunDTO:", err);
        return null;
    }

    if (!obj || typeof obj !== "object" || obj === null || Array.isArray(obj)) {
        return null;
    }
    const dto = new ZsunDTO();
    dto.zwift_id = parseField(obj, ["zwift_id"], parseType.stringType, "") as string;
    dto.name = parseField(obj, ["name"], parseType.stringType, "") as string;
    dto.zwiftracingapp_country_alpha2 = parseField(obj, ["zwiftracingapp_country_alpha2"], parseType.stringType, "") as string;
    dto.weight_kg = parseField(obj, ["weight_kg"], parseType.floatType, 0.0) as number;
    dto.height_cm = parseField(obj, ["height_cm"], parseType.floatType, 0.0) as number;
    dto.gender = parseField(obj, ["gender"], parseType.stringType, "") as string;
    dto.age_years = parseField(obj, ["age_years"], parseType.floatType, 0.0) as number;
    dto.age_group = parseField(obj, ["age_group"], parseType.stringType, "") as string;
    dto.zwift_ftp_watts = parseField(obj, ["zwift_ftp_watts"], parseType.floatType, 0.0) as number;
    dto.zwiftpower_zFTP_watts = parseField(obj, ["zwiftpower_zFTP_watts"], parseType.floatType, 0.0) as number;
    dto.zwiftracingapp_zpFTP_watts = parseField(obj, ["zwiftracingapp_zpFTP_watts"], parseType.floatType, 0.0) as number;
    dto.zsun_one_hour_watts = parseField(obj, ["zsun_one_hour_watts"], parseType.floatType, 0.0) as number;
    dto.zsun_CP_watts = parseField(obj, ["zsun_CP_watts"], parseType.floatType, 0.0) as number;
    dto.zsun_AWC_kJ = parseField(obj, ["zsun_AWC_kJ"], parseType.floatType, 0.0) as number;
    dto.zwift_zrs_score = parseField(obj, ["zwift_zrs_score"], parseType.floatType, 0.0) as number;
    dto.zwift_cat_open = parseField(obj, ["zwift_cat_open"], parseType.stringType, "") as string;
    dto.zwift_cat_female = parseField(obj, ["zwift_cat_female"], parseType.stringType, "") as string;
    dto.zwiftracingapp_velo_rating_30_days = parseField(obj, ["zwiftracingapp_velo_rating_30_days"], parseType.floatType, 0.0) as number;
    dto.zwiftracingapp_cat_num_30_days = parseField(obj, ["zwiftracingapp_cat_num_30_days"], parseType.intType, 0) as number;
    dto.zwiftracingapp_cat_name_30_days = parseField(obj, ["zwiftracingapp_cat_name_30_days"], parseType.stringType, "") as string;
    dto.zwiftracingapp_CP_watts = parseField(obj, ["zwiftracingapp_CP_watts"], parseType.floatType, 0.0) as number;
    dto.zwiftracingapp_AWC_kJ = parseField(obj, ["zwiftracingapp_AWC_kJ"], parseType.floatType, 0.0) as number;
    dto.zsun_one_hour_curve_coefficient = parseField(obj, ["zsun_one_hour_curve_coefficient"], parseType.floatType, 0.0) as number;
    dto.zsun_one_hour_curve_exponent = parseField(obj, ["zsun_one_hour_curve_exponent"], parseType.floatType, 0.0) as number;
    dto.zsun_TTT_pull_curve_coefficient = parseField(obj, ["zsun_TTT_pull_curve_coefficient"], parseType.floatType, 0.0) as number;
    dto.zsun_TTT_pull_curve_exponent = parseField(obj, ["zsun_TTT_pull_curve_exponent"], parseType.floatType, 0.0) as number;
    dto.zsun_TTT_pull_curve_fit_r_squared = parseField(obj, ["zsun_TTT_pull_curve_fit_r_squared"], parseType.floatType, 0.0) as number;
    dto.zsun_when_curves_fitted = parseField(obj, ["zsun_when_curves_fitted"], parseType.stringType, "") as string;
    return dto;
}

