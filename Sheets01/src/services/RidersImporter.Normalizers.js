// Sheets01 / src / services / RidersImporter.Normalizers.js
// Parsing, normalization and precompute helpers

function snakeToCamel(s) {
    if (!s || typeof s !== "string") return s;
    return s.replace(/_([a-zA-Z0-9])/g, function (_m, g1) { return g1.toUpperCase(); });
}

function bestEffortNormalize(raw, key) {
    if (!raw || typeof raw !== "object") return null;
    var o = {};
    for (var k in raw) {
        if (!Object.prototype.hasOwnProperty.call(raw, k)) continue;
        var val = raw[k];
        var camel = snakeToCamel(k);
        o[camel] = val;
        o[k] = val;
    }
    o.zwiftId = o.zwiftId || o.zwift_id || key;
    return o;
}

function dictionaryToArray(dict) {
    var out = [];
    for (var key in dict) {
        if (!Object.prototype.hasOwnProperty.call(dict, key)) continue;
        var raw = dict[key];
        if (typeof raw === "string") {
            var t = raw.trim();
            if (t === "") continue;
            try { raw = JSON.parse(t); } catch (e) { continue; }
        }
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
        var entry = {};
        for (var k2 in raw) {
            if (!Object.prototype.hasOwnProperty.call(raw, k2)) continue;
            entry[k2] = raw[k2];
            try {
                var camel = snakeToCamel(k2);
                if (!Object.prototype.hasOwnProperty.call(entry, camel)) entry[camel] = raw[k2];
            } catch (err) { /* ignore */ }
        }
        entry.zwiftId = entry.zwiftId || entry.zwift_id || key;
        out.push(entry);
    }
    return out;
}

function dictionaryToNormalisedArray(dict) {
    var out = [];
    for (var key in dict) {
        if (!Object.prototype.hasOwnProperty.call(dict, key)) continue;
        var raw = dict[key];
        if (typeof raw === "string") {
            var t = raw.trim();
            if (t === "") continue;
            try { raw = JSON.parse(t); } catch (e) { continue; }
        }
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;

        var riderInstance = null;
        if (typeof deserializeRiderItem === "function") {
            riderInstance = deserializeRiderItem(raw);
        } else if (typeof RiderItem === "function") {
            try { riderInstance = new RiderItem(raw); } catch (e) { riderInstance = null; }
        } else {
            riderInstance = bestEffortNormalize(raw, key);
        }

        if (!riderInstance) continue;
        out.push(riderInstance);
    }
    return out;
}

function dictionaryToPrecomputedArray(normalizedRiders) {
    if (!normalizedRiders || !Array.isArray(normalizedRiders)) return [];
    var out = [];
    for (var i = 0; i < normalizedRiders.length; i++) {
        var r = normalizedRiders[i] || {};
        var zwiftId = r.zwiftId || r.zwift_id || "";
        var zFtpWkg = "?";
        var initials = "?";
        var stats01 = "?";
        var stats02 = "?";
        try {
            zFtpWkg = makeZFtpWkg(r) || "?";
            initials = makeRiderInitials(r) || "?";
            stats01 = makeRiderStats01(r) || "?";
            stats02 = makeRiderStats02(r) || "?";
        } catch (e) { /* keep defaults */ }
        out.push({
            zwiftId: zwiftId,
            zFtpWkg: zFtpWkg,
            initials: initials,
            stats01: stats01,
            stats02: stats02
        });
    }
    return out;
}

/* Precompute helpers */

function makeZFtpWkg(obj) {
    if (obj && obj.zwiftRacingAppZpFtpWatts != null && obj.weightKg != null && Number(obj.weightKg) !== 0) {
        var n = Number(obj.zwiftRacingAppZpFtpWatts) / Number(obj.weightKg);
        return n.toFixed(2);
    }
    return "?";
}

function makeRiderInitials(rider) {
    if (!rider || !rider.name || typeof rider.name !== "string") return "";
    var parts = rider.name.trim().split(/\s+/);
    var initials = "";
    for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (p && p.length > 0) initials += p.charAt(0).toLowerCase();
    }
    return initials;
}

function makeRiderStats01(rider) {
    var prettyZwiftCat = "";
    if (rider && rider.gender && String(rider.gender).toLowerCase() === "f") {
        prettyZwiftCat = String(rider.zwiftCatOpen || "") + "/" + String(rider.zwiftCatFemale || "");
    } else {
        prettyZwiftCat = rider ? String(rider.zwiftCatOpen || "") : "";
    }

    var prettyZFtpWkg = "?";
    if (rider && rider.zwiftRacingAppZpFtpWatts != null && rider.weightKg != null && Number(rider.weightKg) !== 0) {
        var n = Number(rider.zwiftRacingAppZpFtpWatts) / Number(rider.weightKg);
        prettyZFtpWkg = n.toFixed(2);
    }

    return prettyZwiftCat + " (" + prettyZFtpWkg + " - " + (rider ? String(rider.zwiftZrsScore || "") : "") + ")";
}

function makeRiderStats02(rider) {
    if (!rider) return "";
    return String(rider.zwiftRacingAppCatNum || "") + " (" + String(rider.zwiftRacingAppVeloRating || "") + " - " + String(rider.zwiftRacingAppCatName || "") + ")";
}