declare function snakeToCamel(s: string): string;
type RiderRaw = {
    [key: string]: string | number | boolean;
};
type RiderNormalized = RiderRaw & {
    zwiftId: string;
};
declare function bestEffortNormalize(raw: RiderRaw, key: string): RiderNormalized;
declare function deserializeRiderItem(raw: RiderRaw): RiderNormalized;
declare function riderItem(raw: RiderRaw): RiderNormalized;
declare function dictionaryToNormalisedArray(dict: {
    [key: string]: string | RiderRaw;
}): RiderNormalized[];
type PrecomputedRider = {
    zwiftId: string;
    zFtpWkg: string;
    initials: string;
    stats01: string;
    stats02: string;
};
declare function dictionaryToPrecomputedArray(normalizedRiders: RiderNormalized[]): PrecomputedRider[];
declare function makeZFtpWkg(obj: RiderRaw): string;
declare function makeRiderInitials(rider: RiderRaw): string;
declare function makeRiderStats01(rider: RiderRaw): string;
declare function makeRiderStats02(rider: RiderRaw): string;
//# sourceMappingURL=RiderImporter.Normalizers.d.ts.map