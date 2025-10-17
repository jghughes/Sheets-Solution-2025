// Sheets01\public\Models.js
import { ParseType, parseField } from "./ParsingFieldsUtils.js";

/**
 * RiderItem constructor that uses parseField helpers to normalize raw JSON fields.
 */
function RiderItem(rawJson) {
    if (!rawJson) rawJson = {};

    this.zwiftId = parseField(rawJson, ["zwift_id"], ParseType.STRING, "");
    this.name = parseField(rawJson, ["name"], ParseType.STRING, "");
    this.country_alpha2 = parseField(rawJson, ["zwiftracingapp_country_alpha2"], ParseType.STRING, "");
    this.weightKg = parseField(rawJson, ["weight_kg"], ParseType.FLOAT, 0.0);
    this.heightCm = parseField(rawJson, ["height_cm"], ParseType.FLOAT, 0.0);
    this.gender = parseField(rawJson, ["gender"], ParseType.STRING, "");
    this.ageYears = parseField(rawJson, ["age_years"], ParseType.INT, 0);
    this.ageGroup = parseField(rawJson, ["age_group"], ParseType.STRING, "");
    this.zwiftFtpWatts = parseField(rawJson, ["zwift_ftp"], ParseType.FLOAT, 0.0);
    this.zwiftpowerZFtpWatts = parseField(rawJson, ["zwiftpower_zFTP"], ParseType.FLOAT, 0.0);
    this.zwiftRacingAppZpFtpWatts = parseField(rawJson, ["zwiftracingapp_zpFTP_w"], ParseType.FLOAT, 0.0);
    this.zsunOneHourWatts = parseField(rawJson, ["zsun_one_hour_watts"], ParseType.FLOAT, 0.0);
    this.zsunCP = parseField(rawJson, ["zsun_CP"], ParseType.FLOAT, 0.0);
    this.zsunAWC = parseField(rawJson, ["zsun_AWC"], ParseType.FLOAT, 0.0);
    this.zwiftZrsScore = parseField(rawJson, ["zwift_zrs"], ParseType.INT, 0);
    this.zwiftCatOpen = parseField(rawJson, ["zwift_cat_open"], ParseType.STRING, "");
    this.zwiftCatFemale = parseField(rawJson, ["zwift_cat_female"], ParseType.STRING, "");
    this.zwiftRacingAppVeloRating = parseField(rawJson, ["zwiftracingapp_velo_rating_30_days"], ParseType.INT, 0);
    this.zwiftRacingAppCatNum = parseField(rawJson, ["zwiftracingapp_cat_num_30_days"], ParseType.INT, 0);
    this.zwiftRacingAppCatName = parseField(rawJson, ["zwiftracingapp_cat_name_30_days"], ParseType.STRING, "");
    this.zwiftRacingAppCP = parseField(rawJson, ["zwiftracingapp_CP"], ParseType.FLOAT, 0.0);
    this.zwiftRacingAppAWC = parseField(rawJson, ["zwiftracingapp_AWC"], ParseType.FLOAT, 0.0);
    this.zsunOneHourCurveCoefficient = parseField(rawJson, ["zsun_one_hour_curve_coefficient"], ParseType.FLOAT, 0.0);
    this.zsunOneHourCurveExponent = parseField(rawJson, ["zsun_one_hour_curve_exponent"], ParseType.FLOAT, 0.0);
    this.zsunTTTPullCurveCoefficient = parseField(rawJson, ["zsun_TTT_pull_curve_coefficient"], ParseType.FLOAT, 0.0);
    this.zsunTTTPullCurveExponent = parseField(rawJson, ["zsun_TTT_pull_curve_exponent"], ParseType.FLOAT, 0.0);
    this.zsunTTTPullCurveFitRSquared = parseField(rawJson, ["zsun_TTT_pull_curve_fit_r_squared"], ParseType.FLOAT, 0.0);
    this.zsunWhenCurvesFitted = parseField(rawJson, ["zsun_when_curves_fitted"], ParseType.DATE, null);

    // marker to identify instances at runtime
    this._isRiderItem = true;
}

// Simple runtime serializer for a RiderItem — exits early if input is not a RiderItem
export function serializeRiderItem(r) {
    // fast check: accept real RiderItem instances (constructed with `new RiderItem(...)`)
    // or objects explicitly marked with `_isRiderItem`
    if (!r || (typeof r !== "object") || (!(r instanceof RiderItem) && !r._isRiderItem)) {
        return {};
    }

    const answer = {
        zwift_id: r.zwiftId || "",
        name: r.name || "",
        zwiftracingapp_country_alpha2: r.country_alpha2 || "",
        weight_kg: typeof r.weightKg === "number" ? r.weightKg : (r.weightKg ? Number(r.weightKg) : 0),
        height_cm: typeof r.heightCm === "number" ? r.heightCm : (r.heightCm ? Number(r.heightCm) : 0),
        gender: r.gender || "",
        age_years: typeof r.ageYears === "number" ? r.ageYears : (r.ageYears ? parseInt(r.ageYears, 10) || 0 : 0),
        age_group: r.ageGroup || "",
        zwift_ftp: typeof r.zwiftFtpWatts === "number" ? r.zwiftFtpWatts : (r.zwiftFtpWatts ? Number(r.zwiftFtpWatts) : 0),
        zwiftpower_zFTP: typeof r.zwiftpowerZFtpWatts === "number" ? r.zwiftpowerZFtpWatts : (r.zwiftpowerZFtpWatts ? Number(r.zwiftpowerZFtpWatts) : 0),
        zwiftracingapp_zpFTP_w: typeof r.zwiftRacingAppZpFtpWatts === "number" ? r.zwiftRacingAppZpFtpWatts : (r.zwiftRacingAppZpFtpWatts ? Number(r.zwiftRacingAppZpFtpWatts) : 0),
        zsun_one_hour_watts: typeof r.zsunOneHourWatts === "number" ? r.zsunOneHourWatts : (r.zsunOneHourWatts ? Number(r.zsunOneHourWatts) : 0),
        zsun_CP: typeof r.zsunCP === "number" ? r.zsunCP : (r.zsunCP ? Number(r.zsunCP) : 0),
        zsun_AWC: typeof r.zsunAWC === "number" ? r.zsunAWC : (r.zsunAWC ? Number(r.zsunAWC) : 0),
        zwift_zrs: typeof r.zwiftZrsScore === "number" ? r.zwiftZrsScore : (r.zwiftZrsScore ? parseInt(r.zwiftZrsScore, 10) || 0 : 0),
        zwift_cat_open: r.zwiftCatOpen || "",
        zwift_cat_female: r.zwiftCatFemale || "",
        zwiftracingapp_velo_rating_30_days: typeof r.zwiftRacingAppVeloRating === "number" ? r.zwiftRacingAppVeloRating : (r.zwiftRacingAppVeloRating ? parseInt(r.zwiftRacingAppVeloRating, 10) || 0 : 0),
        zwiftracingapp_cat_num_30_days: typeof r.zwiftRacingAppCatNum === "number" ? r.zwiftRacingAppCatNum : (r.zwiftRacingAppCatNum ? parseInt(r.zwiftRacingAppCatNum, 10) || 0 : 0),
        zwiftracingapp_cat_name_30_days: r.zwiftRacingAppCatName || "",
        zwiftracingapp_CP: typeof r.zwiftRacingAppCP === "number" ? r.zwiftRacingAppCP : (r.zwiftRacingAppCP ? Number(r.zwiftRacingAppCP) : 0),
        zwiftracingapp_AWC: typeof r.zwiftRacingAppAWC === "number" ? r.zwiftRacingAppAWC : (r.zwiftRacingAppAWC ? Number(r.zwiftRacingAppAWC) : 0),
        zsun_one_hour_curve_coefficient: typeof r.zsunOneHourCurveCoefficient === "number" ? r.zsunOneHourCurveCoefficient : (r.zsunOneHourCurveCoefficient ? Number(r.zsunOneHourCurveCoefficient) : 0),
        zsun_one_hour_curve_exponent: typeof r.zsunOneHourCurveExponent === "number" ? r.zsunOneHourCurveExponent : (r.zsunOneHourCurveExponent ? Number(r.zsunOneHourCurveExponent) : 0),
        zsun_TTT_pull_curve_coefficient: typeof r.zsunTTTPullCurveCoefficient === "number" ? r.zsunTTTPullCurveCoefficient : (r.zsunTTTPullCurveCoefficient ? Number(r.zsunTTTPullCurveCoefficient) : 0),
        zsun_TTT_pull_curve_exponent: typeof r.zsunTTTPullCurveExponent === "number" ? r.zsunTTTPullCurveExponent : (r.zsunTTTPullCurveExponent ? Number(r.zsunTTTPullCurveExponent) : 0),
        zsun_TTT_pull_curve_fit_r_squared: typeof r.zsunTTTPullCurveFitRSquared === "number" ? r.zsunTTTPullCurveFitRSquared : (r.zsunTTTPullCurveFitRSquared ? Number(r.zsunTTTPullCurveFitRSquared) : 0),
        zsun_when_curves_fitted: r.zsunWhenCurvesFitted instanceof Date ? r.zsunWhenCurvesFitted.toISOString() : (r.zsunWhenCurvesFitted || null)
    };

    return answer;
}


/**
 * Returns the initials of a RiderItem's name in lower case.
 * @param {RiderItem} rider - The RiderItem object.
 * @returns {string} The initials in lower case.
 */
function makeRiderInitials(rider) {
    if (!rider || typeof rider !== "object" || typeof rider.name !== "string" || rider.name.trim() === "") {
        return "";
    }
    return rider.name
        .split(/\s+/)
        .filter(function (part) { return part.length > 0; })
        .map(function (part) { return part.charAt(0).toLowerCase(); })
        .join("");
}

/**
 * Returns a formatted rider stats string for a given RiderItem, using Zwift cat, FTP w/kg, and ZRS score.
 * @param {RiderItem} rider - The rider object.
 * @returns {string} The formatted stats string.
 */
function makeRiderStats01(rider) {
    // ReSharper disable once AssignedValueIsNeverUsed
    let prettyZwiftCat = "";
    if (rider.gender && rider.gender.toLowerCase() === "f") {
        prettyZwiftCat = `${rider.zwiftCatOpen}/${rider.zwiftCatFemale}`;
    } else {
        prettyZwiftCat = rider.zwiftCatOpen;
    }

    let prettyZFtpWkg = "?";
    if (
        rider.zwiftRacingAppZpFtpWatts != null &&
        rider.weightKg != null &&
        rider.weightKg !== 0
    ) {
        prettyZFtpWkg = (rider.zwiftRacingAppZpFtpWatts / rider.weightKg).toFixed(2);
    }

    return `${prettyZwiftCat} (${prettyZFtpWkg} - ${rider.zwiftZrsScore})`;
}

/**
 * Returns a formatted rider stats string for a given RiderItem.
 * @param {RiderItem} rider - The rider object.
 * @returns {string} The formatted stats string.
 */
function makeRiderStats02(rider) {
    // Replaced removed `zwiftRacingAppScore` with `zwiftRacingAppVeloRating`
    return `${rider.zwiftRacingAppCatNum} (${rider.zwiftRacingAppVeloRating} - ${rider.zwiftRacingAppCatName})`;
}

/**
 * Writes an array of rider objects to a specified sheet in the active Google Spreadsheet.
 *
 * - If the sheet named `nameOfSheet` does not exist, it is created and column headers are added.
 * - If the sheet exists, all its contents (including headers) are cleared before writing new data.
 * - Only specific rider properties are included as columns. Headings are concise but meaningful.
 * - Each rider object is mapped to a row, with missing properties filled as empty strings.
 *
 * @param {Object[]} riders - Array of rider objects to write. Each object should contain the specified properties.
 * @param {string} nameOfSheet - The name of the sheet to write data to.
 */
function writeRidersToSheet(riders, nameOfSheet) {
    // Define the headers and corresponding property names as tuples (concise headings)
    const columns = [
        ["Zwift ID", "zwiftId"],
        ["Name", "name"],
        ["Country", "country_alpha2"],
        ["Wgt kg", "weightKg"],
        ["Ht cm", "heightCm"],
        ["Gender", "gender"],
        ["Age yrs", "ageYears"],
        ["Age grp", "ageGroup"],
        ["zFTP W", "zwiftFtpWatts"],
        ["zPwr zFTP", "zwiftpowerZFtpWatts"],
        ["ZR zFTP W", "zwiftRacingAppZpFtpWatts"],
        ["1h W", "zsunOneHourWatts"],
        ["CP W", "zsunCP"],
        ["AWC kJ", "zsunAWC"],
        ["ZRS", "zwiftZrsScore"],
        ["Zwift Cat", "zwiftCatOpen"],
        ["Zwift Cat F", "zwiftCatFemale"],
        ["ZR Velo", "zwiftRacingAppVeloRating"],
        ["ZR Cat#", "zwiftRacingAppCatNum"],
        ["ZR Cat", "zwiftRacingAppCatName"],
        ["ZR CP W", "zwiftRacingAppCP"],
        ["ZR AWC kJ", "zwiftRacingAppAWC"],
        ["1h coeff", "zsunOneHourCurveCoefficient"],
        ["1h exp", "zsunOneHourCurveExponent"],
        ["TTT coeff", "zsunTTTPullCurveCoefficient"],
        ["TTT exp", "zsunTTTPullCurveExponent"],
        ["TTT R2", "zsunTTTPullCurveFitRSquared"],
        ["Curves fitted", "zsunWhenCurvesFitted"]
    ];

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(nameOfSheet);

    // Create the sheet if it doesn't exist, otherwise clear it
    if (!sheet) {
        sheet = ss.insertSheet(nameOfSheet);
    } else {
        sheet.clear();
    }
    // Write headers
    sheet.appendRow(columns.map(function (col) { return col[0]; }));

    // Prepare data rows
    const data = riders.map(function (r) {
        return columns.map(function (col) {
            const v = r[col[1]] !== undefined ? r[col[1]] : "";
            // Format Date objects to ISO string for spreadsheet
            if (v instanceof Date) return v.toISOString();
            return v;
        });
    });

    if (data.length > 0) {
        sheet.getRange(2, 1, data.length, columns.length).setValues(data);
    }
}

export {
    ParseType,
    parseField,
    RiderItem,
    makeRiderInitials,
    makeRiderStats01,
    makeRiderStats02,
    writeRidersToSheet
}