"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderStatsItem = void 0;
const RiderStatsDto_1 = require("./RiderStatsDto");
const RiderStatsDisplayItem_1 = require("./RiderStatsDisplayItem");
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
    static toDataTransferObject(item) {
        if (!item) {
            return new RiderStatsDto_1.RiderStatsDto();
        }
        // Map all properties directly
        return new RiderStatsDto_1.RiderStatsDto({ ...item });
    }
    static fromDataTransferObject(dto) {
        if (!dto) {
            return new RiderStatsItem();
        }
        // Map all properties directly
        return new RiderStatsItem({ ...dto });
    }
    static fromDtoArray(dtos) {
        if (!Array.isArray(dtos))
            return [];
        return dtos.map(dto => RiderStatsItem.fromDataTransferObject(dto));
    }
    static toDtoArray(items) {
        if (!Array.isArray(items))
            return [];
        return items.map(item => RiderStatsItem.toDataTransferObject(item));
    }
    static toDisplayItem(item) {
        const display = new RiderStatsDisplayItem_1.RiderStatsDisplayItem();
        if (!item)
            return display;
        display.zwiftId = item.zwiftId;
        display.name = item.fullName;
        display.country = item.zwiftCountryCode3;
        display.age = item.ageYears;
        display.height = item.heightCm;
        display.weight = item.weightKg;
        display.gender = item.genderCode;
        display.catOpen = item.catOpen;
        display.catWomen = item.catWomen;
        display.racingScore = item.zwiftRacingScore;
        display.ftpW = item.zwiftWattsFtp;
        display.zFtpW = item.zwiftWattsZFtp;
        display.zFtpWkg = item.zwiftWattsKgZFtp;
        display.catLabel = item.zwiftCatLabel;
        display.raAgeGroup = item.veloAgeGroup;
        display.raCatNum = item.veloCatNum30Days;
        display.raCatOpen = item.veloCatName30Days;
        display.raRating = item.veloRating30Days;
        display.raCatLabel = item.veloCatLabel;
        display["05sWkg"] = item.wkg05Sec;
        display["15sWkg"] = item.wkg15Sec;
        display["30sWkg"] = item.wkg30Sec;
        display["01mWkg"] = item.wkg01Min;
        display["02mWkg"] = item.wkg02Min;
        display["03mWkg"] = item.wkg03Min;
        display["05mWkg"] = item.wkg05Min;
        display["10mWkg"] = item.wkg10Min;
        display["12mWkg"] = item.wkg12Min;
        display["15mWkg"] = item.wkg15Min;
        display["20mWkg"] = item.wkg20Min;
        display["30mWkg"] = item.wkg30Min;
        display["40mWkg"] = item.wkg40Min;
        display["60mWkg"] = item.wkg60MinCurveFit;
        display["05sW"] = item.w05Sec;
        display["15sW"] = item.w15Sec;
        display["30sW"] = item.w30Sec;
        display["01mW"] = item.w01Min;
        display["02mW"] = item.w02Min;
        display["03mW"] = item.w03Min;
        display["05mW"] = item.w05Min;
        display["10mW"] = item.w10Min;
        display["12mW"] = item.w12Min;
        display["15mW"] = item.w15Min;
        display["20mW"] = item.w20Min;
        display["30mW"] = item.w30Min;
        display["40mW"] = item.w40Min;
        display["60mW"] = item.w60MinCurveFit;
        display.timestamp = item.timestamp ? new Date(item.timestamp) : null;
        return display;
    }
    static toDisplayItemArray(items) {
        if (!Array.isArray(items))
            return [];
        return items.map(item => RiderStatsItem.toDisplayItem(item));
    }
    static toDisplayItemDictionary(items) {
        const dict = {};
        if (!Array.isArray(items))
            return dict;
        for (const item of items) {
            if (item && typeof item.zwiftId === "string" && item.zwiftId.length > 0) {
                dict[item.zwiftId] = item;
            }
        }
        return dict;
    }
}
exports.RiderStatsItem = RiderStatsItem;
//# sourceMappingURL=RiderStatsItem.js.map