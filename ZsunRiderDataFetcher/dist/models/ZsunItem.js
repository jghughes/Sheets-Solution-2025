"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZsunItem = void 0;
const ZsunDTO_1 = require("./ZsunDTO");
class ZsunItem {
    constructor() {
        this.zwift_id = "";
        this.name = "";
        this.zwiftracingapp_country_alpha2 = "";
        this.weight_kg = 0.0;
        this.height_cm = 0.0;
        this.gender = "";
        this.age_years = 0.0;
        this.age_group = "";
        this.zwift_ftp_watts = 0.0;
        this.zwiftpower_zFTP_watts = 0.0;
        this.zwiftracingapp_zpFTP_watts = 0.0;
        this.zsun_one_hour_watts = 0.0;
        this.zsun_CP_watts = 0.0;
        this.zsun_AWC_kJ = 0.0;
        this.zwift_zrs_score = 0.0;
        this.zwift_cat_open = "";
        this.zwift_cat_female = "";
        this.zwiftracingapp_velo_rating_30_days = 0.0;
        this.zwiftracingapp_cat_num_30_days = 0;
        this.zwiftracingapp_cat_name_30_days = "";
        this.zwiftracingapp_CP_watts = 0.0;
        this.zwiftracingapp_AWC_kJ = 0.0;
        this.zsun_one_hour_curve_coefficient = 0.0;
        this.zsun_one_hour_curve_exponent = 0.0;
        this.zsun_TTT_pull_curve_coefficient = 0.0;
        this.zsun_TTT_pull_curve_exponent = 0.0;
        this.zsun_TTT_pull_curve_fit_r_squared = 0.0;
        this.zsun_when_curves_fitted = "";
        // All properties initialized above
    }
    static to_dataTransferObject(item) {
        if (!item) {
            return new ZsunDTO_1.ZsunDTO();
        }
        const dto = new ZsunDTO_1.ZsunDTO();
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
    static from_dataTransferObject(dto) {
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
exports.ZsunItem = ZsunItem;
//# sourceMappingURL=ZsunItem.js.map