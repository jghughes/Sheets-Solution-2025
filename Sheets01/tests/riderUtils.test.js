import { hasValidStringProps, isValidRawRiderData, makeCustomizedRiderData, makeRiderStats01 } from "../public/riderUtils.js";

describe("isValidRawRiderData", () => {
    it("returns true for valid data", () => {
        const data = {
            "123": { zwift_id: "123", name: "Alice" }
        };
        expect(isValidRawRiderData(data)).toBe(true);
    });

    it("returns error for missing name", () => {
        const data = {
            "123": { zwift_id: "123" }
        };
        expect(isValidRawRiderData(data)).toMatch(/missing property 'name'/);
    });
});