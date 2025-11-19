"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RiderStatsItem_1 = require("../../src/models/RiderStatsItem");
const RiderStatsDto_1 = require("../../src/models/RiderStatsDto");
const RiderStatsDisplayItem_1 = require("../../src/models/RiderStatsDisplayItem");
describe("RiderStatsItem", () => {
    it("should construct with default values", () => {
        const item = new RiderStatsItem_1.RiderStatsItem();
        expect(item).toBeInstanceOf(RiderStatsItem_1.RiderStatsItem);
        expect(item.zwiftId).toBe("");
        expect(item.ageYears).toBe(0.0);
        expect(item.timestamp).toBe("");
    });
    it("should construct with partial data", () => {
        const item = new RiderStatsItem_1.RiderStatsItem({ zwiftId: "123", fullName: "Test Rider", ageYears: 25 });
        expect(item.zwiftId).toBe("123");
        expect(item.fullName).toBe("Test Rider");
        expect(item.ageYears).toBe(25);
    });
    it("should convert to and from RiderStatsDto", () => {
        const item = new RiderStatsItem_1.RiderStatsItem({ zwiftId: "456", fullName: "Dto Rider", ageYears: 30 });
        const dto = RiderStatsItem_1.RiderStatsItem.toDataTransferObject(item);
        expect(dto).toBeInstanceOf(RiderStatsDto_1.RiderStatsDto);
        expect(dto.zwiftId).toBe("456");
        expect(dto.fullName).toBe("Dto Rider");
        expect(dto.ageYears).toBe(30);
        const itemFromDto = RiderStatsItem_1.RiderStatsItem.fromDataTransferObject(dto);
        expect(itemFromDto).toBeInstanceOf(RiderStatsItem_1.RiderStatsItem);
        expect(itemFromDto.zwiftId).toBe("456");
        expect(itemFromDto.fullName).toBe("Dto Rider");
        expect(itemFromDto.ageYears).toBe(30);
    });
    it("should convert arrays to and from DTOs", () => {
        const items = [
            new RiderStatsItem_1.RiderStatsItem({ zwiftId: "1", fullName: "A" }),
            new RiderStatsItem_1.RiderStatsItem({ zwiftId: "2", fullName: "B" })
        ];
        const dtos = RiderStatsItem_1.RiderStatsItem.toDtoArray(items);
        expect(Array.isArray(dtos)).toBe(true);
        expect(dtos.length).toBe(2);
        expect(dtos[0]).toBeInstanceOf(RiderStatsDto_1.RiderStatsDto);
        const itemsFromDtos = RiderStatsItem_1.RiderStatsItem.fromDtoArray(dtos);
        expect(Array.isArray(itemsFromDtos)).toBe(true);
        expect(itemsFromDtos.length).toBe(2);
        expect(itemsFromDtos[0]).toBeInstanceOf(RiderStatsItem_1.RiderStatsItem);
    });
    it("should convert to RiderStatsDisplayItem", () => {
        const item = new RiderStatsItem_1.RiderStatsItem({
            zwiftId: "789",
            fullName: "Display Rider",
            ageYears: 40,
            timestamp: "2025-11-17T12:00:000Z"
        });
        const display = RiderStatsItem_1.RiderStatsItem.toDisplayItem(item);
        expect(display).toBeInstanceOf(RiderStatsDisplayItem_1.RiderStatsDisplayItem);
        expect(display.zwiftId).toBe("789");
        expect(display.name).toBe("Display Rider");
        expect(display.age).toBe(40);
        expect(display.timestamp).toEqual("2025-11-17T12:00:000Z");
    });
    it("should convert array to RiderStatsDisplayItem array", () => {
        const items = [
            new RiderStatsItem_1.RiderStatsItem({ zwiftId: "1", fullName: "A" }),
            new RiderStatsItem_1.RiderStatsItem({ zwiftId: "2", fullName: "B" })
        ];
        const displayItems = RiderStatsItem_1.RiderStatsItem.toDisplayItemArray(items);
        expect(Array.isArray(displayItems)).toBe(true);
        expect(displayItems.length).toBe(2);
        expect(displayItems[0]).toBeInstanceOf(RiderStatsDisplayItem_1.RiderStatsDisplayItem);
    });
    it("should create a display item dictionary by zwiftId", () => {
        const displayItems = [
            Object.assign(new RiderStatsDisplayItem_1.RiderStatsDisplayItem(), { zwiftId: "1", name: "A" }),
            Object.assign(new RiderStatsDisplayItem_1.RiderStatsDisplayItem(), { zwiftId: "2", name: "B" })
        ];
        const dict = RiderStatsItem_1.RiderStatsItem.toDisplayItemDictionary(displayItems);
        expect(dict["1"]).toBe(displayItems[0]);
        expect(dict["2"]).toBe(displayItems[1]);
        expect(Object.keys(dict)).toEqual(["1", "2"]);
    });
    it("should return empty array or object for invalid input", () => {
        expect(RiderStatsItem_1.RiderStatsItem.fromDtoArray(null)).toEqual([]);
        expect(RiderStatsItem_1.RiderStatsItem.toDtoArray(null)).toEqual([]);
        expect(RiderStatsItem_1.RiderStatsItem.toDisplayItemArray(null)).toEqual([]);
        expect(RiderStatsItem_1.RiderStatsItem.toDisplayItemDictionary(null)).toEqual({});
    });
});
//# sourceMappingURL=riderStatsItem.test.js.map