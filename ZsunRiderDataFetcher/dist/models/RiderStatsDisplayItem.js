"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderStatsDisplayItem = void 0;
class RiderStatsDisplayItem {
    constructor(data) {
        this.zwiftId = "";
        this.name = "";
        this.country = "";
        this.age = 0.0;
        this.height = 0.0;
        this.weight = 0.0;
        this.gender = "";
        this.catOpen = "";
        this.catWomen = "";
        this.racingScore = 0.0;
        this.ftpW = 0.0;
        this.zFtpW = 0.0;
        this.zFtpWkg = 0.0;
        this.catLabel = "";
        this.raAgeGroup = "";
        this.raCatNum = 0;
        this.raCatOpen = "";
        this.raRating = 0.0;
        this.raCatLabel = "";
        this["05sWkg"] = 0.0;
        this["15sWkg"] = 0.0;
        this["30sWkg"] = 0.0;
        this["01mWkg"] = 0.0;
        this["02mWkg"] = 0.0;
        this["03mWkg"] = 0.0;
        this["05mWkg"] = 0.0;
        this["10mWkg"] = 0.0;
        this["12mWkg"] = 0.0;
        this["15mWkg"] = 0.0;
        this["20mWkg"] = 0.0;
        this["30mWkg"] = 0.0;
        this["40mWkg"] = 0.0;
        this["60mWkg"] = 0.0;
        this["05sW"] = 0.0;
        this["15sW"] = 0.0;
        this["30sW"] = 0.0;
        this["01mW"] = 0.0;
        this["02mW"] = 0.0;
        this["03mW"] = 0.0;
        this["05mW"] = 0.0;
        this["10mW"] = 0.0;
        this["12mW"] = 0.0;
        this["15mW"] = 0.0;
        this["20mW"] = 0.0;
        this["30mW"] = 0.0;
        this["40mW"] = 0.0;
        this["60mW"] = 0.0;
        this.timestamp = new Date();
        Object.assign(this, data);
    }
}
exports.RiderStatsDisplayItem = RiderStatsDisplayItem;
//# sourceMappingURL=RiderStatsDisplayItem.js.map