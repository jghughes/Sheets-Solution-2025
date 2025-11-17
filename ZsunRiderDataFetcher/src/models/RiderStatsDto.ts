// Alias map: JSON field name -> class property name
const aliasMap: Record<string, keyof RiderStatsDto> = {
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


// DTO interface for type safety
export interface IRiderStatsDto {
    zwiftId: string;
    fullName: string;
    zwiftCountryCode3: string;
    ageYears: number;
    heightCm: number;
    weightKg: number;
    genderCode: string;
    catOpen: string;
    catWomen: string;
    zwiftRacingScore: number;
    zwiftWattsFtp: number;
    zwiftWattsZFtp: number;
    zwiftWattsKgZFtp: number;
    zwiftCatLabel: string;
    veloAgeGroup: string;
    veloCatNum30Days: number;
    veloCatName30Days: string;
    veloRating30Days: number;
    veloCatLabel: string;
    wkg05Sec: number;
    wkg15Sec: number;
    wkg30Sec: number;
    wkg01Min: number;
    wkg02Min: number;
    wkg03Min: number;
    wkg05Min: number;
    wkg10Min: number;
    wkg12Min: number;
    wkg15Min: number;
    wkg20Min: number;
    wkg30Min: number;
    wkg40Min: number;
    wkg60MinCurveFit: number;
    w05Sec: number;
    w15Sec: number;
    w30Sec: number;
    w01Min: number;
    w02Min: number;
    w03Min: number;
    w05Min: number;
    w10Min: number;
    w12Min: number;
    w15Min: number;
    w20Min: number;
    w30Min: number;
    w40Min: number;
    w60MinCurveFit: number;
    timestamp: string;
}

// Main class with defaults, alias support, and roundtripping
export class RiderStatsDto implements IRiderStatsDto {
    zwiftId = "";
    fullName = "";
    zwiftCountryCode3 = "";
    ageYears = 0.0;
    heightCm = 0.0;
    weightKg = 0.0;
    genderCode = "";
    catOpen = "";
    catWomen = "";
    zwiftRacingScore = 0.0;
    zwiftWattsFtp = 0.0;
    zwiftWattsZFtp = 0.0;
    zwiftWattsKgZFtp = 0.0;
    zwiftCatLabel = "";
    veloAgeGroup = "";
    veloCatNum30Days = 0;
    veloCatName30Days = "";
    veloRating30Days = 0.0;
    veloCatLabel = "";
    wkg05Sec = 0.0;
    wkg15Sec = 0.0;
    wkg30Sec = 0.0;
    wkg01Min = 0.0;
    wkg02Min = 0.0;
    wkg03Min = 0.0;
    wkg05Min = 0.0;
    wkg10Min = 0.0;
    wkg12Min = 0.0;
    wkg15Min = 0.0;
    wkg20Min = 0.0;
    wkg30Min = 0.0;
    wkg40Min = 0.0;
    wkg60MinCurveFit = 0.0;
    w05Sec = 0.0;
    w15Sec = 0.0;
    w30Sec = 0.0;
    w01Min = 0.0;
    w02Min = 0.0;
    w03Min = 0.0;
    w05Min = 0.0;
    w10Min = 0.0;
    w12Min = 0.0;
    w15Min = 0.0;
    w20Min = 0.0;
    w30Min = 0.0;
    w40Min = 0.0;
    w60MinCurveFit = 0.0;
    timestamp = "";

    constructor(data?: Partial<RiderStatsDto>) {
        Object.assign(this, data);
    }

    // Deserialize from JSON with alias support
    static fromJson(json: Record<string, any>): RiderStatsDto {
        const item = new RiderStatsDto();
        for (const [jsonKey, value] of Object.entries(json)) {
            const prop = aliasMap[jsonKey];
            if (prop) {
                // Convert zwiftId to string if needed
                if (prop === "zwiftId" && typeof value === "number") {
                    item[prop] = String(value);
                } else {
                    item[prop] = value;
                }
            }
        }
        return item;
    }

    // Serialize to JSON using preferred aliases (second field in AliasChoices)
    toJson(): Record<string, any> {
        const result: Record<string, any> = {};
        // Only use the preferred alias for each property
        for (const [jsonKey, prop] of Object.entries(aliasMap)) {
            if (jsonKey === prop) { // preferred alias
                result[jsonKey] = this[prop];
            }
        }
        return result;
    }

    // Deserialize an array of JSON objects to an array of RiderStatsDto
    static fromJsonArray(jsonArray: Record<string, any>[]): RiderStatsDto[] {
        if (!Array.isArray(jsonArray)) return [];
        return jsonArray.map(obj => RiderStatsDto.fromJson(obj));
    }

    // Serialize an array of RiderStatsDto to an array of JSON objects
    static toJsonArray(dtos: RiderStatsDto[]): Record<string, any>[] {
        if (!Array.isArray(dtos)) return [];
        return dtos.map(dto => dto.toJson());
    }

}