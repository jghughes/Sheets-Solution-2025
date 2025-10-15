/**
 * Enum for parse types.
 * @readonly
 * @enum {string}
 */
var ParseType = {
    STRING: "string",
    FLOAT: "float",
    INT: "int"
};

/**
 * Looks up a value from rawJson by key, applies the default, and parses it to the specified type.
 * @param {Object} rawJson - The raw input object.
 * @param {string} key - The key in the raw JSON.
 * @param {ParseType} type - The type to parse to.
 * @param {*} defaultValue - The default value if the key is missing or invalid.
 * @returns {string|number}
 */
function parseProp(rawJson, key, type, defaultValue) {
    const val = (rawJson[key] != null) ? rawJson[key] : defaultValue;
    if (type === ParseType.STRING) {
        return (typeof val === "string" && val.trim() !== "") ? val : "";
    }
    if (type === ParseType.FLOAT) {
        let num = parseFloat(val);
        return !isNaN(num) ? num : 0.0;
    }
    if (type === ParseType.INT) {
        let num = parseInt(val, 10);
        return !isNaN(num) ? num : 0;
    }
    return null;
}

function rawRiderItem(rawJson) {
    if (!rawJson) rawJson = {};

    this.zwiftId = parseProp(rawJson, "zwift_id", ParseType.STRING, "");
    this.name = parseProp(rawJson, "name", ParseType.STRING, "");
    this.weightKg = parseProp(rawJson, "weight_kg", ParseType.FLOAT, 0.0);
    this.heightCm = parseProp(rawJson, "height_cm", ParseType.FLOAT, 0.0);
    this.gender = parseProp(rawJson, "gender", ParseType.STRING, "");
    this.ageYears = parseProp(rawJson, "age_years", ParseType.INT, 0);
    this.ageGroup = parseProp(rawJson, "age_group", ParseType.STRING, "");
    this.zwiftFtpWatts = parseProp(rawJson, "zwift_ftp", ParseType.FLOAT, 0.0);
    this.zwiftpowerZFtpWatts = parseProp(rawJson, "zwiftpower_zFTP", ParseType.FLOAT, 0.0);
    this.zwiftRacingAppZpFtpWatts = parseProp(rawJson, "zwiftracingapp_zpFTP_w", ParseType.FLOAT, 0.0);
    this.zsunOneHourWatts = parseProp(rawJson, "zsun_one_hour_watts", ParseType.FLOAT, 0.0);
    this.zsunCP = parseProp(rawJson, "zsun_CP", ParseType.FLOAT, 0.0);
    this.zsunAWC = parseProp(rawJson, "zsun_AWC", ParseType.FLOAT, 0.0);

    // Special handling for "?" values
    var zrsVal = rawJson["zwift_zrs"];
    this.zwiftZrsScore = (zrsVal !== "?") ? parseProp(rawJson, "zwift_zrs", ParseType.INT, 0) : 0;

    this.zwiftCatOpen = parseProp(rawJson, "zwift_cat_open", ParseType.STRING, "");
    this.zwiftCatFemale = parseProp(rawJson, "zwift_cat_female", ParseType.STRING, "");

    var zraScoreVal = rawJson["zwiftracingapp_score"];
    this.zwiftRacingAppScore = (zraScoreVal !== "?") ? parseProp(rawJson, "zwiftracingapp_score", ParseType.INT, 0) : 0;

    var zraCatNumVal = rawJson["zwiftracingapp_cat_num"];
    this.zwiftRacingAppCatNum = (zraCatNumVal !== "?") ? parseProp(rawJson, "zwiftracingapp_cat_num", ParseType.INT, 0) : 0;

    this.zwiftRacingAppCatName = parseProp(rawJson, "zwiftracingapp_cat_name", ParseType.STRING, "");
    this.zwiftRacingAppCP = parseProp(rawJson, "zwiftracingapp_CP", ParseType.FLOAT, 0.0);
    this.zwiftRacingAppAWC = parseProp(rawJson, "zwiftracingapp_AWC", ParseType.FLOAT, 0.0);
    this.zsunOneHourCurveCoefficient = parseProp(rawJson, "zsun_one_hour_curve_coefficient", ParseType.FLOAT, 0.0);
    this.zsunOneHourCurveExponent = parseProp(rawJson, "zsun_one_hour_curve_exponent", ParseType.FLOAT, 0.0);
    this.zsunTTTPullCurveCoefficient = parseProp(rawJson, "zsun_TTT_pull_curve_coefficient", ParseType.FLOAT, 0.0);
    this.zsunTTTPullCurveExponent = parseProp(rawJson, "zsun_TTT_pull_curve_exponent", ParseType.FLOAT, 0.0);
    this.zsunTTTPullCurveFitRSquared = parseProp(rawJson, "zsun_TTT_pull_curve_fit_r_squared", ParseType.FLOAT, 0.0);
    this.zsunWhenCurvesFitted = parseProp(rawJson, "zsun_when_curves_fitted", ParseType.STRING, "");
}

/**
 * Returns the initials of a rider's name in lower case.
 * @param {string} name - The rider's full name.
 * @returns {string} The initials in lower case.
 */
function makeRiderInitials(name) {  
    if (!name) return "";
    return name
        .split(/\s+/)
        .filter(function (part) { return part.length > 0; })
        .map(function (part) { return part.charAt(0).toLowerCase(); })
        .join("");
}

/**
* Returns a formatted rider stats string for a given rawRiderItem, using Zwift cat, FTP w/kg, and ZRS score.
* @param {rawRiderItem} rider - The rider object.
* @returns {string} The formatted stats string.
*/
function makeRiderStats01(rider) {
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
* Returns a formatted rider stats string for a given rawRiderItem.
* @param {rawRiderItem} rider - The rider object.
* @returns {string} The formatted stats string.
*/
function makeRiderStats02(rider) {
    return `${rider.zwiftRacingAppCatNum} (${rider.zwiftRacingAppScore} - ${rider.zwiftRacingAppCatName})`;
}