"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderStatsItem = void 0;
// Alias map: JSON field name -> class property name
const aliasMap = {
    zwift_id: "zwiftId",
    zwiftId: "zwiftId",
    full_name: "fullName",
    fullName: "fullName",
    zwift_country_code3: "zwiftCountryCode3",
    zwiftCountryCode3: "zwiftCountryCode3",
    age_years: "ageYears",
    ageYears: "ageYears",
    height_cm: "heightCm",
    heightCm: "heightCm",
    weight_kg: "weightKg",
    weightKg: "weightKg",
    gender_code: "genderCode",
    genderCode: "genderCode",
    cat_open: "catOpen",
    catOpen: "catOpen",
    cat_women: "catWomen",
    catWomen: "catWomen",
    zwift_racing_score: "zwiftRacingScore",
    zwiftRacingScore: "zwiftRacingScore",
    zwift_ftp_w: "zwiftWattsFtp",
    zwiftWattsFtp: "zwiftWattsFtp",
    zwift_zftp_w: "zwiftWattsZFtp",
    zwiftWattsZftp: "zwiftWattsZFtp",
    zwift_zftp_wkg: "zwiftWattsKgZFtp",
    zwiftWattsKgZftp: "zwiftWattsKgZFtp",
    zwift_cat_label: "zwiftCatLabel",
    zwiftCatLabel: "zwiftCatLabel",
    velo_age_group: "veloAgeGroup",
    veloAgeGroup: "veloAgeGroup",
    velo_cat_num_30_days: "veloCatNum30Days",
    veloCatNum30Days: "veloCatNum30Days",
    velo_cat_name_30_days: "veloCatName30Days",
    veloCatName30Days: "veloCatName30Days",
    velo_rating_30_days: "veloRating30Days",
    veloRating30Days: "veloRating30Days",
    velo_cat_label: "veloCatLabel",
    veloCatLabel: "veloCatLabel",
    wkg_05sec: "wkg05Sec",
    wkg05Sec: "wkg05Sec",
    wkg_15sec: "wkg15Sec",
    wkg15Sec: "wkg15Sec",
    wkg_30sec: "wkg30Sec",
    wkg30Sec: "wkg30Sec",
    wkg_01min: "wkg01Min",
    wkg01Min: "wkg01Min",
    wkg_02min: "wkg02Min",
    wkg02Min: "wkg02Min",
    wkg_03min: "wkg03Min",
    wkg03Min: "wkg03Min",
    wkg_05min: "wkg05Min",
    wkg05Min: "wkg05Min",
    wkg_10min: "wkg10Min",
    wkg10Min: "wkg10Min",
    wkg_12min: "wkg12Min",
    wkg12Min: "wkg12Min",
    wkg_15min: "wkg15Min",
    wkg15Min: "wkg15Min",
    wkg_20min: "wkg20Min",
    wkg20Min: "wkg20Min",
    wkg_30min: "wkg30Min",
    wkg30Min: "wkg30Min",
    wkg_40min: "wkg40Min",
    wkg40Min: "wkg40Min",
    wkg_60min_curvefit: "wkg60MinCurveFit",
    wkg60MinCurvefit: "wkg60MinCurveFit",
    w_05sec: "w05Sec",
    w05Sec: "w05Sec",
    w_15sec: "w15Sec",
    w15Sec: "w15Sec",
    w_30sec: "w30Sec",
    w30Sec: "w30Sec",
    w_01min: "w01Min",
    w01Min: "w01Min",
    w_02min: "w02Min",
    w02Min: "w02Min",
    w_03min: "w03Min",
    w03Min: "w03Min",
    w_05min: "w05Min",
    w05Min: "w05Min",
    w_10min: "w10Min",
    w10Min: "w10Min",
    w_12min: "w12Min",
    w12Min: "w12Min",
    w_15min: "w15Min",
    w15Min: "w15Min",
    w_20min: "w20Min",
    w20Min: "w20Min",
    w_30min: "w30Min",
    w30Min: "w30Min",
    w_40min: "w40Min",
    w40Min: "w40Min",
    w_60min_curvefit: "w60MinCurveFit",
    w60MinCurvefit: "w60MinCurveFit",
    timestamp: "timestamp"
};
// Main class with defaults, alias support, and roundtripping
class RiderStatsItem {
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
        this.timestamp = "";
        Object.assign(this, data);
    }
    // Deserialize from JSON with alias support
    static fromJson(json) {
        const item = new RiderStatsItem();
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
    // Validate required and range fields (expand as needed)
    validate() {
        const errors = [];
        if (!this.zwiftId)
            errors.push("zwiftId is required.");
        if (!this.fullName)
            errors.push("fullName is required.");
        if (!this.timestamp)
            errors.push("timestamp is required.");
        if (this.ageYears < 0 || this.ageYears > 120)
            errors.push("ageYears must be between 0 and 120.");
        if (this.heightCm < 0)
            errors.push("heightCm must be non-negative.");
        if (this.weightKg < 0)
            errors.push("weightKg must be non-negative.");
        // Add more validation rules as needed
        return errors;
    }
    // Example transformation: trim name, round numbers
    transform() {
        this.fullName = this.fullName.trim();
        this.ageYears = Math.round(this.ageYears);
        this.heightCm = Math.round(this.heightCm * 10) / 10;
        this.weightKg = Math.round(this.weightKg * 10) / 10;
        // Add more transformations as needed
    }
}
exports.RiderStatsItem = RiderStatsItem;
//# sourceMappingURL=RiderStatstemV2.js.map