"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderStatsItem = void 0;
const RiderStatsDto_1 = require("./RiderStatsDto");
class RiderStatsItem {
    constructor() {
        this.zwiftId = "";
        this.name = "";
        this.zwiftRacingAppCountryAlpha2 = "";
        this.weightKg = 0.0;
        this.heightCm = 0.0;
        this.gender = "";
        this.ageYears = 0.0;
        this.ageGroup = "";
        this.zwiftFtpWatts = 0.0;
        this.zwiftPowerZFtpWatts = 0.0;
        this.zwiftRacingAppZpFtpWatts = 0.0;
        this.jghOneHourWatts = 0.0;
        this.jghCpWatts = 0.0;
        this.jghAwcKj = 0.0;
        this.zwiftZrsScore = 0.0;
        this.zwiftCatOpen = "";
        this.zwiftCatFemale = "";
        this.zwiftRacingAppRating30Days = 0.0;
        this.zwiftRacingAppCatNum30Days = 0;
        this.zwiftRacingAppCatName30Days = "";
        this.zwiftRacingAppCpWatts = 0.0;
        this.zwiftRacingAppAwcKj = 0.0;
        this.jghOneHourCurveCoefficient = 0.0;
        this.jghOneHourCurveExponent = 0.0;
        this.jghTttPullCurveCoefficient = 0.0;
        this.jghTttPullCurveExponent = 0.0;
        this.jghTttPullCurveFitRSquared = 0.0;
        this.jghWhenCurvesFitted = "";
        // All properties initialized above
    }
    static toDataTransferObject(item) {
        if (!item) {
            return new RiderStatsDto_1.RiderStatsDto();
        }
        const dto = new RiderStatsDto_1.RiderStatsDto();
        dto.zwift_id = item.zwiftId;
        dto.name = item.name;
        dto.zwiftracingapp_country_alpha2 = item.zwiftRacingAppCountryAlpha2;
        dto.weight_kg = item.weightKg;
        dto.height_cm = item.heightCm;
        dto.gender = item.gender;
        dto.age_years = item.ageYears;
        dto.age_group = item.ageGroup;
        dto.zwift_ftp_watts = item.zwiftFtpWatts;
        dto.zwiftpower_zFTP_watts = item.zwiftPowerZFtpWatts;
        dto.zwiftracingapp_zpFTP_watts = item.zwiftRacingAppZpFtpWatts;
        dto.zsun_one_hour_watts = item.jghOneHourWatts;
        dto.zsun_CP_watts = item.jghCpWatts;
        dto.zsun_AWC_kJ = item.jghAwcKj;
        dto.zwift_zrs_score = item.zwiftZrsScore;
        dto.zwift_cat_open = item.zwiftCatOpen;
        dto.zwift_cat_female = item.zwiftCatFemale;
        dto.zwiftracingapp_velo_rating_30_days = item.zwiftRacingAppRating30Days;
        dto.zwiftracingapp_cat_num_30_days = item.zwiftRacingAppCatNum30Days;
        dto.zwiftracingapp_cat_name_30_days = item.zwiftRacingAppCatName30Days;
        dto.zwiftracingapp_CP_watts = item.zwiftRacingAppCpWatts;
        dto.zwiftracingapp_AWC_kJ = item.zwiftRacingAppAwcKj;
        dto.zsun_one_hour_curve_coefficient = item.jghOneHourCurveCoefficient;
        dto.zsun_one_hour_curve_exponent = item.jghOneHourCurveExponent;
        dto.zsun_TTT_pull_curve_coefficient = item.jghTttPullCurveCoefficient;
        dto.zsun_TTT_pull_curve_exponent = item.jghTttPullCurveExponent;
        dto.zsun_TTT_pull_curve_fit_r_squared = item.jghTttPullCurveFitRSquared;
        dto.zsun_when_curves_fitted = item.jghWhenCurvesFitted;
        return dto;
    }
    static fromDataTransferObject(dto) {
        const item = new RiderStatsItem();
        if (!dto) {
            return item;
        }
        item.zwiftId = dto.zwift_id || "";
        item.name = dto.name || "";
        item.zwiftRacingAppCountryAlpha2 = dto.zwiftracingapp_country_alpha2 || "";
        item.weightKg = dto.weight_kg || 0.0;
        item.heightCm = dto.height_cm || 0.0;
        item.gender = dto.gender || "";
        item.ageYears = dto.age_years || 0.0;
        item.ageGroup = dto.age_group || "";
        item.zwiftFtpWatts = dto.zwift_ftp_watts || 0.0;
        item.zwiftPowerZFtpWatts = dto.zwiftpower_zFTP_watts || 0.0;
        item.zwiftRacingAppZpFtpWatts = dto.zwiftracingapp_zpFTP_watts || 0.0;
        item.jghOneHourWatts = dto.zsun_one_hour_watts || 0.0;
        item.jghCpWatts = dto.zsun_CP_watts || 0.0;
        item.jghAwcKj = dto.zsun_AWC_kJ || 0.0;
        item.zwiftZrsScore = dto.zwift_zrs_score || 0.0;
        item.zwiftCatOpen = dto.zwift_cat_open || "";
        item.zwiftCatFemale = dto.zwift_cat_female || "";
        item.zwiftRacingAppRating30Days = dto.zwiftracingapp_velo_rating_30_days || 0.0;
        item.zwiftRacingAppCatNum30Days = dto.zwiftracingapp_cat_num_30_days || 0;
        item.zwiftRacingAppCatName30Days = dto.zwiftracingapp_cat_name_30_days || "";
        item.zwiftRacingAppCpWatts = dto.zwiftracingapp_CP_watts || 0.0;
        item.zwiftRacingAppAwcKj = dto.zwiftracingapp_AWC_kJ || 0.0;
        item.jghOneHourCurveCoefficient = dto.zsun_one_hour_curve_coefficient || 0.0;
        item.jghOneHourCurveExponent = dto.zsun_one_hour_curve_exponent || 0.0;
        item.jghTttPullCurveCoefficient = dto.zsun_TTT_pull_curve_coefficient || 0.0;
        item.jghTttPullCurveExponent = dto.zsun_TTT_pull_curve_exponent || 0.0;
        item.jghTttPullCurveFitRSquared = dto.zsun_TTT_pull_curve_fit_r_squared || 0.0;
        item.jghWhenCurvesFitted = dto.zsun_when_curves_fitted || "";
        return item;
    }
}
exports.RiderStatsItem = RiderStatsItem;
//# sourceMappingURL=RiderStatsItem.js.map