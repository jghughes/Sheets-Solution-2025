import { ZsunDTO } from "./ZsunDTO";

export class ZsunItem {
    zwift_id: string = "";
    name: string = "";
    zwiftracingapp_country_alpha2: string = "";
    weight_kg: number = 0.0;
    height_cm: number = 0.0;
    gender: string = "";
    age_years: number = 0.0;
    age_group: string = "";
    zwift_ftp_watts: number = 0.0;
    zwiftpower_zFTP_watts: number = 0.0;
    zwiftracingapp_zpFTP_watts: number = 0.0;
    zsun_one_hour_watts: number = 0.0;
    zsun_CP_watts: number = 0.0;
    zsun_AWC_kJ: number = 0.0;
    zwift_zrs_score: number = 0.0;
    zwift_cat_open: string = "";
    zwift_cat_female: string = "";
    zwiftracingapp_velo_rating_30_days: number = 0.0;
    zwiftracingapp_cat_num_30_days: number = 0;
    zwiftracingapp_cat_name_30_days: string = "";
    zwiftracingapp_CP_watts: number = 0.0;
    zwiftracingapp_AWC_kJ: number = 0.0;
    zsun_one_hour_curve_coefficient: number = 0.0;
    zsun_one_hour_curve_exponent: number = 0.0;
    zsun_TTT_pull_curve_coefficient: number = 0.0;
    zsun_TTT_pull_curve_exponent: number = 0.0;
    zsun_TTT_pull_curve_fit_r_squared: number = 0.0;
    zsun_when_curves_fitted: string = "";

    constructor() {
        // All properties initialized above
    }

    static to_dataTransferObject(item: ZsunItem | null): ZsunDTO {
        if (!item) {
            return new ZsunDTO();
        }
        const dto = new ZsunDTO();
        dto.zwift_id = item.zwift_id;
        dto.name = item.name;
        dto.zwiftracingapp_country_alpha2 = item.zwiftracingapp_country_alpha2;
        dto.weight_kg = item.weight_kg;
        dto.height_cm = item.height_cm;
        dto.gender = item.gender;
        dto.age_years = item.age_years;
        dto.age_group = item.age_group;
        dto.zwift_ftp_watts = item.zwift_ftp_watts;
        dto.zwiftpower_zFTP_watts = item.zwiftpower_zFTP_watts;
        dto.zwiftracingapp_zpFTP_watts = item.zwiftracingapp_zpFTP_watts;
        dto.zsun_one_hour_watts = item.zsun_one_hour_watts;
        dto.zsun_CP_watts = item.zsun_CP_watts;
        dto.zsun_AWC_kJ = item.zsun_AWC_kJ;
        dto.zwift_zrs_score = item.zwift_zrs_score;
        dto.zwift_cat_open = item.zwift_cat_open;
        dto.zwift_cat_female = item.zwift_cat_female;
        dto.zwiftracingapp_velo_rating_30_days = item.zwiftracingapp_velo_rating_30_days;
        dto.zwiftracingapp_cat_num_30_days = item.zwiftracingapp_cat_num_30_days;
        dto.zwiftracingapp_cat_name_30_days = item.zwiftracingapp_cat_name_30_days;
        dto.zwiftracingapp_CP_watts = item.zwiftracingapp_CP_watts;
        dto.zwiftracingapp_AWC_kJ = item.zwiftracingapp_AWC_kJ;
        dto.zsun_one_hour_curve_coefficient = item.zsun_one_hour_curve_coefficient;
        dto.zsun_one_hour_curve_exponent = item.zsun_one_hour_curve_exponent;
        dto.zsun_TTT_pull_curve_coefficient = item.zsun_TTT_pull_curve_coefficient;
        dto.zsun_TTT_pull_curve_exponent = item.zsun_TTT_pull_curve_exponent;
        dto.zsun_TTT_pull_curve_fit_r_squared = item.zsun_TTT_pull_curve_fit_r_squared;
        dto.zsun_when_curves_fitted = item.zsun_when_curves_fitted;
        return dto;
    }

    static from_dataTransferObject(dto: ZsunDTO | null): ZsunItem {
        const item = new ZsunItem();
        if (!dto) {
            return item;
        }
        item.zwift_id = dto.zwift_id || "";
        item.name = dto.name || "";
        item.zwiftracingapp_country_alpha2 = dto.zwiftracingapp_country_alpha2 || "";
        item.weight_kg = dto.weight_kg || 0.0;
        item.height_cm = dto.height_cm || 0.0;
        item.gender = dto.gender || "";
        item.age_years = dto.age_years || 0.0;
        item.age_group = dto.age_group || "";
        item.zwift_ftp_watts = dto.zwift_ftp_watts || 0.0;
        item.zwiftpower_zFTP_watts = dto.zwiftpower_zFTP_watts || 0.0;
        item.zwiftracingapp_zpFTP_watts = dto.zwiftracingapp_zpFTP_watts || 0.0;
        item.zsun_one_hour_watts = dto.zsun_one_hour_watts || 0.0;
        item.zsun_CP_watts = dto.zsun_CP_watts || 0.0;
        item.zsun_AWC_kJ = dto.zsun_AWC_kJ || 0.0;
        item.zwift_zrs_score = dto.zwift_zrs_score || 0.0;
        item.zwift_cat_open = dto.zwift_cat_open || "";
        item.zwift_cat_female = dto.zwift_cat_female || "";
        item.zwiftracingapp_velo_rating_30_days = dto.zwiftracingapp_velo_rating_30_days || 0.0;
        item.zwiftracingapp_cat_num_30_days = dto.zwiftracingapp_cat_num_30_days || 0;
        item.zwiftracingapp_cat_name_30_days = dto.zwiftracingapp_cat_name_30_days || "";
        item.zwiftracingapp_CP_watts = dto.zwiftracingapp_CP_watts || 0.0;
        item.zwiftracingapp_AWC_kJ = dto.zwiftracingapp_AWC_kJ || 0.0;
        item.zsun_one_hour_curve_coefficient = dto.zsun_one_hour_curve_coefficient || 0.0;
        item.zsun_one_hour_curve_exponent = dto.zsun_one_hour_curve_exponent || 0.0;
        item.zsun_TTT_pull_curve_coefficient = dto.zsun_TTT_pull_curve_coefficient || 0.0;
        item.zsun_TTT_pull_curve_exponent = dto.zsun_TTT_pull_curve_exponent || 0.0;
        item.zsun_TTT_pull_curve_fit_r_squared = dto.zsun_TTT_pull_curve_fit_r_squared || 0.0;
        item.zsun_when_curves_fitted = dto.zsun_when_curves_fitted || "";
        return item;
    }
}