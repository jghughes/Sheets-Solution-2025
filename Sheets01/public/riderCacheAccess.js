// Pure/testable version
function getRiderNameFromCache(zwiftId, cache) {
    if (typeof zwiftId !== "string" || zwiftId.trim() === "") return "Invalid zwiftID";
    var key = zwiftId.trim();
    if (!cache || typeof cache !== "object") return "Cache empty";
    var rider = cache[key];
    if (!rider || typeof rider !== "object") return key;
    if (!rider.hasOwnProperty("name") || typeof rider.name !== "string" || rider.name.trim() === "") return "{name} missing";
    return rider.name;
}

function getRiderStats01FromCache(zwiftId, cache) {
    if (typeof zwiftId !== "string" || zwiftId.trim() === "") return "Invalid zwiftID";
    var key = zwiftId.trim();
    if (!cache || typeof cache !== "object") return "Cache empty";
    var rider = cache[key];
    if (!rider || typeof rider !== "object") return key;
    if (!rider.hasOwnProperty("riderStats01") || typeof rider.riderStats01 !== "string" || rider.riderStats01.trim() === "") return "{riderStats01} missing";
    return rider.riderStats01;
}

function getRiderPropertyFromCache(zwiftId, propertyName, cache) {
    if (typeof zwiftId !== "string" || zwiftId.trim() === "" ||
        typeof propertyName !== "string" || propertyName.trim() === "") return "?";
    var key = zwiftId.trim();
    var prop = propertyName.trim();
    if (!cache || typeof cache !== "object") return "?";
    var rider = cache[key];
    if (!rider || typeof rider !== "object") return "?";
    if (!rider.hasOwnProperty(prop) || rider[prop] === undefined || rider[prop] === null) return "?";
    return rider[prop];
}

// At the end of riderCacheAccess.js
export {
    getRiderNameFromCache,
    getRiderStats01FromCache,
    getRiderPropertyFromCache
    };