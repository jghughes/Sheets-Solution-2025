"use strict";
function writeSourceDataSheet(records, nameOfSheet) {
    nameOfSheet = nameOfSheet || "Source";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(nameOfSheet);
    if (!sheet)
        sheet = ss.insertSheet(nameOfSheet);
    else
        sheet.clear();
    if (!records || records.length === 0) {
        sheet.appendRow(["Zwift ID"]);
        return;
    }
    var keySet = {};
    for (var i = 0; i < records.length; i++) {
        var r = records[i] || {};
        for (var k in r) {
            if (Object.prototype.hasOwnProperty.call(r, k))
                keySet[k] = true;
        }
    }
    var keys = [];
    for (var k2 in keySet) {
        if (k2 !== "zwiftId")
            keys.push(k2);
    }
    keys.sort();
    keys.unshift("zwiftId");
    sheet.appendRow(keys);
    var data = records.map(function (r) {
        return keys.map(function (k) {
            var v = (r && r[k] !== undefined) ? r[k] : "";
            if (v instanceof Date)
                v = v.toISOString();
            return v;
        });
    });
    if (data.length > 0)
        sheet.getRange(2, 1, data.length, keys.length).setValues(data);
}
function writePrettyDataSheet(riders, nameOfSheet) {
    nameOfSheet = nameOfSheet || "Normalised";
    var columns = [
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
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(nameOfSheet);
    if (!sheet)
        sheet = ss.insertSheet(nameOfSheet);
    else
        sheet.clear();
    var header = columns.map(function (c) { return c[0]; });
    sheet.appendRow(header);
    var data = (riders && riders.length > 0) ? riders.map(function (r) {
        return columns.map(function (col) {
            var propName = col[1];
            var v = (typeof r === "object" && r[propName] !== undefined) ? r[propName] : "";
            if (v instanceof Date)
                v = v.toISOString();
            return v;
        });
    }) : [];
    if (data.length > 0)
        sheet.getRange(2, 1, data.length, columns.length).setValues(data);
}
function writeCalculatedSheet(records, nameOfSheet) {
    nameOfSheet = nameOfSheet || "Precomputed";
    var columns = [
        ["Zwift ID", "zwiftId"],
        ["Initials", "initials"],
        ["Stats01", "stats01"],
        ["Stats02", "stats02"]
    ];
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(nameOfSheet);
    if (!sheet)
        sheet = ss.insertSheet(nameOfSheet);
    else
        sheet.clear();
    var header = columns.map(function (c) { return c[0]; });
    sheet.appendRow(header);
    var data = (records && records.length > 0) ? records.map(function (r) {
        return columns.map(function (col) {
            var propName = col[1];
            var v = (typeof r === "object" && r[propName] !== undefined) ? r[propName] : "";
            if (v instanceof Date)
                v = v.toISOString();
            return v;
        });
    }) : [];
    if (data.length > 0)
        sheet.getRange(2, 1, data.length, columns.length).setValues(data);
}
//# sourceMappingURL=RiderImporter.Writers.js.map