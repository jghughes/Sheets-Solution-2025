import { RiderStatsDto } from "./RiderStatsDto";
export declare class RiderStatsItem {
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
    static toDataTransferObject(item: RiderStatsItem | null): RiderStatsDto;
    static fromDataTransferObject(dto: RiderStatsDto | null): RiderStatsItem;
}
//# sourceMappingURL=RiderStatsItem.d.ts.map