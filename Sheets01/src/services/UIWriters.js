/**
 * Writes an array of rider objects to a specified sheet in the active Google Spreadsheet.
 *
 * GAS-friendly: avoids Array.prototype.map/filter.
 *
 * @param {Object[]} riders - Array of rider objects (or RiderItem) to write.
 * @param {string} nameOfSheet - The name of the sheet to write data to.
 */
function writeRidersToSheet(riders, nameOfSheet) {
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
    var sheet = ss.getSheetByName(nameOfSheet);

    if (!sheet) {
        sheet = ss.insertSheet(nameOfSheet);
    } else {
        sheet.clear();
    }

    // Build header row without map
    const headerRow = [];
    for (var ci = 0; ci < columns.length; ci++) {
        headerRow.push(columns[ci][0]);
    }
    sheet.appendRow(headerRow);

    // Build data rows without map
    var data = [];
    if (riders && riders.length > 0) {
        for (var ri = 0; ri < riders.length; ri++) {
            var r = riders[ri];
            var row = [];
            for (var c = 0; c < columns.length; c++) {
                var propName = columns[c][1];
                var v = (typeof r === "object" && r[propName] !== undefined) ? r[propName] : "";
                if (v instanceof Date) {
                    row.push(v.toISOString());
                } else {
                    row.push(v);
                }
            }
            data.push(row);
        }
    }

    if (data.length > 0) {
        sheet.getRange(2, 1, data.length, columns.length).setValues(data);
    }
}
