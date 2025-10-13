import { getRiderNameFromCache, getRiderStats01FromCache, getRiderPropertyFromCache } from "../public/riderCacheAccess.js";


const mockCache = {
    "12345": {
        name: "Alice Smith",
        riderStats01: "A (3.50 - Z)  as",
        age: 30
    },
    "67890": {
        name: "",
        riderStats01: "",
        age: 25
    }
};

describe('getRiderNameFromCache', () => {
    it('returns the rider name if present', () => {
        expect(getRiderNameFromCache("12345", mockCache)).toBe("Alice Smith");
    });
    it('returns "{name} missing" if name is empty', () => {
        expect(getRiderNameFromCache("67890", mockCache)).toBe("{name} missing");
    });
    it('returns zwiftId if rider not found', () => {
        expect(getRiderNameFromCache("99999", mockCache)).toBe("99999");
    });
    it('returns "Invalid zwiftID" for invalid input', () => {
        expect(getRiderNameFromCache("", mockCache)).toBe("Invalid zwiftID");
    });
});

describe('getRiderStats01FromCache', () => {
    it('returns the stats string if present', () => {
        expect(getRiderStats01FromCache("12345", mockCache)).toBe("A (3.50 - Z)  as");
    });
    it('returns "{riderStats01} missing" if stats are empty', () => {
        expect(getRiderStats01FromCache("67890", mockCache)).toBe("{riderStats01} missing");
    });
    it('returns zwiftId if rider not found', () => {
        expect(getRiderStats01FromCache("99999", mockCache)).toBe("99999");
    });
    it('returns "Invalid zwiftID" for invalid input', () => {
        expect(getRiderStats01FromCache("", mockCache)).toBe("Invalid zwiftID");
    });
});

describe('getRiderPropertyFromCache', () => {
    it('returns the property value if present', () => {
        expect(getRiderPropertyFromCache("12345", "age", mockCache)).toBe(30);
    });
    it('returns "?" if property is missing', () => {
        expect(getRiderPropertyFromCache("12345", "height", mockCache)).toBe("?");
    });
    it('returns "?" if rider not found', () => {
        expect(getRiderPropertyFromCache("99999", "age", mockCache)).toBe("?");
    });
    it('returns "?" for invalid input', () => {
        expect(getRiderPropertyFromCache("", "age", mockCache)).toBe("?");
        expect(getRiderPropertyFromCache("12345", "", mockCache)).toBe("?");
    });
});