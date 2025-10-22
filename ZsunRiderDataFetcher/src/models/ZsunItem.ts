import { ZSunDto } from "./ZSunDTO";

export class ZSunItem {
    zwiftId = "";
    name = "";
    zwiftRacingAppCountryAlpha2 = "";
    weightKg = 0.0;
    heightCm = 0.0;
    gender = "";
    ageYears = 0.0;
    ageGroup = "";
    zwiftFtpWatts = 0.0;
    zwiftPowerZFtpWatts = 0.0;
    zwiftRacingAppZpFtpWatts = 0.0;
    jghOneHourWatts = 0.0;
    jghCpWatts = 0.0;
    jghAwcKj = 0.0;
    zwiftZrsScore = 0.0;
    zwiftCatOpen = "";
    zwiftCatFemale = "";
    zwiftRacingAppRating30Days = 0.0;
    zwiftRacingAppCatNum30Days = 0;
    zwiftRacingAppCatName30Days = "";
    zwiftRacingAppCpWatts = 0.0;
    zwiftRacingAppAwcKj = 0.0;
    jghOneHourCurveCoefficient = 0.0;
    jghOneHourCurveExponent = 0.0;
    jghTttPullCurveCoefficient = 0.0;
    jghTttPullCurveExponent = 0.0;
    jghTttPullCurveFitRSquared = 0.0;
    jghWhenCurvesFitted = "";

    constructor() {
        // All properties initialized above
    }

    static toDataTransferObject(item: ZSunItem | null): ZSunDto {
        if (!item) {
            return new ZSunDto();
        }
        const dto = new ZSunDto();
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

    static fromDataTransferObject(dto: ZSunDto | null): ZSunItem {
        const item = new ZSunItem();
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