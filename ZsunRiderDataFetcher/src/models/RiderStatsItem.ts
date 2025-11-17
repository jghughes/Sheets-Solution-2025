import { RiderStatsDto } from "./RiderStatsDto";
import { RiderStatsDisplayItem } from "./RiderStatsDisplayItem";

export class RiderStatsItem {
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

    constructor(data?: Partial<RiderStatsItem>) {
        Object.assign(this, data);
    }

    static toDataTransferObject(item: RiderStatsItem | null): RiderStatsDto {
        if (!item) {
            return new RiderStatsDto();
        }
        // Map all properties directly
        return new RiderStatsDto({ ...item });
    }

    static fromDataTransferObject(dto: RiderStatsDto | null): RiderStatsItem {
        if (!dto) {
            return new RiderStatsItem();
        }
        // Map all properties directly
        return new RiderStatsItem({ ...dto });
    }

    static fromDtoArray(dtos: RiderStatsDto[]): RiderStatsItem[] {
        if (!Array.isArray(dtos)) return [];
        return dtos.map(dto => RiderStatsItem.fromDataTransferObject(dto));
    }

    static toDtoArray(items: RiderStatsItem[]): RiderStatsDto[] {
        if (!Array.isArray(items)) return [];
        return items.map(item => RiderStatsItem.toDataTransferObject(item));
    }


    static toDisplayItem(item: RiderStatsItem | null): RiderStatsDisplayItem {
    const display = new RiderStatsDisplayItem();
    if (!item) return display;

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

    static toDisplayItemArray(items: RiderStatsItem[]): RiderStatsDisplayItem[] {
        if (!Array.isArray(items)) return [];
        return items.map(item => RiderStatsItem.toDisplayItem(item));
    }

    static toDisplayItemDictionary(items: RiderStatsDisplayItem[]): { [zwiftId: string]: RiderStatsDisplayItem } {
        const dict: { [zwiftId: string]: RiderStatsDisplayItem } = {};
        if (!Array.isArray(items)) return dict;
        for (const item of items) {
            if (item && typeof item.zwiftId === "string" && item.zwiftId.length > 0) {
                dict[item.zwiftId] = item;
            }
        }
        return dict;
    }











}