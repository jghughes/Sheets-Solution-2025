"use strict";
// ZsunRiderDataFetcher/src/services/RiderImporter.Normalizers.ts
// Parsing, normalization and precompute helpers (modernized for Apps Script V8)
function snakeToCamel(s) {
    if (s === "")
        return "";
    return s.replace(/_([a-zA-Z0-9])/g, (_, g1) => g1.toUpperCase());
}
function bestEffortNormalize(raw, key) {
    const o = {};
    for (const k of Object.keys(raw)) {
        const val = raw[k];
        const camel = snakeToCamel(k);
        o[camel] = val;
        o[k] = val;
    }
    o.zwiftId = String(o.zwiftId || o.zwift_id || key);
    return o;
}
function dictionaryToNormalisedArray(dict) {
    const out = [];
    for (const [key, rawValue] of Object.entries(dict)) {
        let raw;
        if (typeof rawValue === "string") {
            const t = rawValue.trim();
            if (t === "")
                continue;
            try {
                raw = JSON.parse(t);
            }
            catch (err) {
                continue;
            }
        }
        else {
            raw = rawValue;
        }
        if (typeof raw !== "object" || Array.isArray(raw))
            continue;
        let riderInstance;
        if (typeof deserializeRiderItem === "function") {
            riderInstance = deserializeRiderItem(raw);
        }
        else if (typeof riderItem === "function") {
            try {
                riderInstance = new riderItem(raw);
            }
            catch (err) {
                riderInstance = bestEffortNormalize(raw, key);
            }
        }
        else {
            riderInstance = bestEffortNormalize(raw, key);
        }
        out.push(riderInstance);
    }
    return out;
}
function dictionaryToPrecomputedArray(normalizedRiders) {
    if (!Array.isArray(normalizedRiders))
        return [];
    return normalizedRiders.map(r => {
        const rider = r || {};
        const zwiftId = String(rider.zwiftId || rider.zwift_id || "");
        let zFtpWkg = "?";
        let initials = "?";
        let stats01 = "?";
        let stats02 = "?";
        try {
            zFtpWkg = makeZFtpWkg(rider);
            initials = makeRiderInitials(rider);
            stats01 = makeRiderStats01(rider);
            stats02 = makeRiderStats02(rider);
        }
        catch (err) {
            // keep defaults
        }
        return {
            zwiftId,
            zFtpWkg,
            initials,
            stats01,
            stats02
        };
    });
}
/* Precompute helpers */
function makeZFtpWkg(obj) {
    const ftp = obj.zwiftRacingAppZpFtpWatts;
    const weight = obj.weightKg;
    if (ftp !== undefined && weight !== undefined && Number(weight) !== 0) {
        const n = Number(ftp) / Number(weight);
        if (Number.isFinite(n))
            return n.toFixed(2);
    }
    return "?";
}
function makeRiderInitials(rider) {
    if (!rider.name || typeof rider.name !== "string")
        return "";
    return rider.name
        .trim()
        .split(/\s+/)
        .map(p => (p.length > 0 ? p.charAt(0).toLowerCase() : ""))
        .join("");
}
function makeRiderStats01(rider) {
    const gender = String(rider.gender || "").toLowerCase();
    const prettyZwiftCat = gender === "f"
        ? `${String(rider.zwiftCatOpen || "")}/${String(rider.zwiftCatFemale || "")}`
        : String(rider.zwiftCatOpen || "");
    let prettyZFtpWkg = "?";
    if (rider.zwiftRacingAppZpFtpWatts !== undefined && rider.weightKg !== undefined && Number(rider.weightKg) !== 0) {
        const n = Number(rider.zwiftRacingAppZpFtpWatts) / Number(rider.weightKg);
        if (Number.isFinite(n))
            prettyZFtpWkg = n.toFixed(2);
    }
    const zrs = String(rider.zwiftZrsScore || "");
    return `${prettyZwiftCat} (${prettyZFtpWkg} - ${zrs})`;
}
function makeRiderStats02(rider) {
    return `${String(rider.zwiftRacingAppCatNum || "")} (${String(rider.zwiftRacingAppVeloRating || "")} - ${String(rider.zwiftRacingAppCatName || "")})`;
}
//# sourceMappingURL=RiderImporter.Normalizers.js.map