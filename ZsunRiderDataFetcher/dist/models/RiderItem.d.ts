export function serializeRiderItem(r: RiderItem | Object): string;
export function deserializeRiderItem(jsonOrObject: string | Object | RiderItem): RiderItem | null;
export function deserializeRiderItems(jsonOrArray: string | any[]): RiderItem[] | null;
/**
 * RiderItem class that uses parseField helpers to normalize raw JSON fields.
 *
 * @param {Object|null} rawJson - Raw object (parsed JSON) with snake_cased keys.
 */
export class RiderItem {
    constructor(rawJson?: {});
    zwiftId: any;
    name: any;
    country_alpha2: any;
    weightKg: any;
    heightCm: any;
    gender: any;
    ageYears: any;
    ageGroup: any;
    zwiftFtpWatts: any;
    zwiftpowerZFtpWatts: any;
    zwiftRacingAppZpFtpWatts: any;
    zsunOneHourWatts: any;
    zsunCP: any;
    zsunAWC: any;
    zwiftZrsScore: any;
    zwiftCatOpen: any;
    zwiftCatFemale: any;
    zwiftRacingAppVeloRating: any;
    zwiftRacingAppCatNum: any;
    zwiftRacingAppCatName: any;
    zwiftRacingAppCP: any;
    zwiftRacingAppAWC: any;
    zsunOneHourCurveCoefficient: any;
    zsunOneHourCurveExponent: any;
    zsunTTTPullCurveCoefficient: any;
    zsunTTTPullCurveExponent: any;
    zsunTTTPullCurveFitRSquared: any;
    zsunWhenCurvesFitted: any;
    _isRiderItem: boolean;
}
//# sourceMappingURL=RiderItem.d.ts.map