"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderStatsDto = void 0;
// Alias map: JSON field name -> class property name
const aliasMap = {
    zwift_id: "zwiftId",
    full_name: "fullName",
    zwift_country_code3: "zwiftCountryCode3",
    age_years: "ageYears",
    height_cm: "heightCm",
    weight_kg: "weightKg",
    gender_code: "genderCode",
    cat_open: "catOpen",
    cat_women: "catWomen",
    zwift_racing_score: "zwiftRacingScore",
    zwift_ftp_w: "zwiftWattsFtp",
    zwift_zftp_w: "zwiftWattsZFtp",
    zwift_zftp_wkg: "zwiftWattsKgZFtp",
    zwift_cat_label: "zwiftCatLabel",
    velo_age_group: "veloAgeGroup",
    velo_cat_num_30_days: "veloCatNum30Days",
    velo_cat_name_30_days: "veloCatName30Days",
    velo_rating_30_days: "veloRating30Days",
    velo_cat_label: "veloCatLabel",
    wkg_05sec: "wkg05Sec",
    wkg_15sec: "wkg15Sec",
    wkg_30sec: "wkg30Sec",
    wkg_01min: "wkg01Min",
    wkg_02min: "wkg02Min",
    wkg_03min: "wkg03Min",
    wkg_05min: "wkg05Min",
    wkg_10min: "wkg10Min",
    wkg_12min: "wkg12Min",
    wkg_15min: "wkg15Min",
    wkg_20min: "wkg20Min",
    wkg_30min: "wkg30Min",
    wkg_40min: "wkg40Min",
    wkg_60min_curvefit: "wkg60MinCurveFit",
    w_05sec: "w05Sec",
    w_15sec: "w15Sec",
    w_30sec: "w30Sec",
    w_01min: "w01Min",
    w_02min: "w02Min",
    w_03min: "w03Min",
    w_05min: "w05Min",
    w_10min: "w10Min",
    w_12min: "w12Min",
    w_15min: "w15Min",
    w_20min: "w20Min",
    w_30min: "w30Min",
    w_40min: "w40Min",
    w_60min_curvefit: "w60MinCurveFit",
    timestamp: "timestamp"
};
// Main class with defaults, alias support, and round-tripping
class RiderStatsDto {
    constructor(data) {
        this.zwiftId = "";
        this.fullName = "";
        this.zwiftCountryCode3 = "";
        this.ageYears = 0.0;
        this.heightCm = 0.0;
        this.weightKg = 0.0;
        this.genderCode = "";
        this.catOpen = "";
        this.catWomen = "";
        this.zwiftRacingScore = 0.0;
        this.zwiftWattsFtp = 0.0;
        this.zwiftWattsZFtp = 0.0;
        this.zwiftWattsKgZFtp = 0.0;
        this.zwiftCatLabel = "";
        this.veloAgeGroup = "";
        this.veloCatNum30Days = 0;
        this.veloCatName30Days = "";
        this.veloRating30Days = 0.0;
        this.veloCatLabel = "";
        this.wkg05Sec = 0.0;
        this.wkg15Sec = 0.0;
        this.wkg30Sec = 0.0;
        this.wkg01Min = 0.0;
        this.wkg02Min = 0.0;
        this.wkg03Min = 0.0;
        this.wkg05Min = 0.0;
        this.wkg10Min = 0.0;
        this.wkg12Min = 0.0;
        this.wkg15Min = 0.0;
        this.wkg20Min = 0.0;
        this.wkg30Min = 0.0;
        this.wkg40Min = 0.0;
        this.wkg60MinCurveFit = 0.0;
        this.w05Sec = 0.0;
        this.w15Sec = 0.0;
        this.w30Sec = 0.0;
        this.w01Min = 0.0;
        this.w02Min = 0.0;
        this.w03Min = 0.0;
        this.w05Min = 0.0;
        this.w10Min = 0.0;
        this.w12Min = 0.0;
        this.w15Min = 0.0;
        this.w20Min = 0.0;
        this.w30Min = 0.0;
        this.w40Min = 0.0;
        this.w60MinCurveFit = 0.0;
        this.timestamp = ""; // formatted ISO 8601 string, e.g., '2025-08-15T12:34:56.789Z'
        Object.assign(this, data);
    }
    // Deserialize from JSON with alias support
    static fromJson(json) {
        const item = new RiderStatsDto();
        for (const [jsonKey, value] of Object.entries(json)) {
            const prop = aliasMap[jsonKey];
            if (prop) {
                // Convert zwiftId to string if needed
                if (prop === "zwiftId" && typeof value === "number") {
                    item[prop] = String(value);
                }
                else {
                    item[prop] = value;
                }
            }
        }
        return item;
    }
    // Serialize to JSON using preferred aliases (second field in AliasChoices)
    toJson() {
        const result = {};
        // Only use the preferred alias for each property
        for (const [jsonKey, prop] of Object.entries(aliasMap)) {
            if (jsonKey === prop) { // preferred alias
                result[jsonKey] = this[prop];
            }
        }
        return result;
    }
    // Deserialize an array of JSON objects to an array of RiderStatsDto
    static fromJsonArray(jsonArray) {
        if (!Array.isArray(jsonArray))
            return [];
        return jsonArray.map(obj => RiderStatsDto.fromJson(obj));
    }
    // Serialize an array of RiderStatsDto to an array of JSON objects
    static toJsonArray(dtos) {
        if (!Array.isArray(dtos))
            return [];
        return dtos.map(dto => dto.toJson());
    }
}
exports.RiderStatsDto = RiderStatsDto;
//# sourceMappingURL=RiderStatsDto.js.map