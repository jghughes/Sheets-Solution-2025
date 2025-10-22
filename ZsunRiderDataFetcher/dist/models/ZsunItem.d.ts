import { ZSunDto } from "./ZSunDTO";
export declare class ZSunItem {
    zwiftId: string;
    name: string;
    zwiftRacingAppCountryAlpha2: string;
    weightKg: number;
    heightCm: number;
    gender: string;
    ageYears: number;
    ageGroup: string;
    zwiftFtpWatts: number;
    zwiftPowerZFtpWatts: number;
    zwiftRacingAppZpFtpWatts: number;
    jghOneHourWatts: number;
    jghCpWatts: number;
    jghAwcKj: number;
    zwiftZrsScore: number;
    zwiftCatOpen: string;
    zwiftCatFemale: string;
    zwiftRacingAppRating30Days: number;
    zwiftRacingAppCatNum30Days: number;
    zwiftRacingAppCatName30Days: string;
    zwiftRacingAppCpWatts: number;
    zwiftRacingAppAwcKj: number;
    jghOneHourCurveCoefficient: number;
    jghOneHourCurveExponent: number;
    jghTttPullCurveCoefficient: number;
    jghTttPullCurveExponent: number;
    jghTttPullCurveFitRSquared: number;
    jghWhenCurvesFitted: string;
    constructor();
    static toDataTransferObject(item: ZSunItem | null): ZSunDto;
    static fromDataTransferObject(dto: ZSunDto | null): ZSunItem;
}
//# sourceMappingURL=ZSunItem.d.ts.map