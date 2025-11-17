declare class RiderItem {
    zwiftId: string;
    name: string;
    country_alpha2: string;
    weightKg: number;
    heightCm: number;
    gender: string;
    ageYears: number;
    ageGroup: string;
    zwiftFtpWatts: number;
    zwiftpowerZFtpWatts: number;
    zwiftRacingAppZpFtpWatts: number;
    zsunOneHourWatts: number;
    zsunCP: number;
    zsunAWC: number;
    zwiftZrsScore: number;
    zwiftCatOpen: string;
    zwiftCatFemale: string;
    zwiftRacingAppVeloRating: number;
    zwiftRacingAppCatNum: number;
    zwiftRacingAppCatName: string;
    zwiftRacingAppCP: number;
    zwiftRacingAppAWC: number;
    zsunOneHourCurveCoefficient: number;
    zsunOneHourCurveExponent: number;
    zsunTTTPullCurveCoefficient: number;
    zsunTTTPullCurveExponent: number;
    zsunTTTPullCurveFitRSquared: number;
    zsunWhenCurvesFitted: Date | null;
    _isRiderItem: boolean;
    constructor(rawJson: string);
}
export declare function serializeRiderItem(r: any): string;
export declare function deserializeRiderItem(jsonOrObject: string | object | RiderItem): RiderItem | null;
export declare function deserializeRiderItems(jsonOrArray: string | any[]): RiderItem[] | null;
export { RiderItem };
//# sourceMappingURL=RiderItem.d.ts.map