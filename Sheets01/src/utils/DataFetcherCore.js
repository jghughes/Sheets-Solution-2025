// javascript Sheets01\src\utils\DataFetcherCore.js
// Pure helpers for DataFetcher — easy to unit test in Node.

function extractDriveIdFromSharedLink(link) {
    if (typeof link !== "string") return null;
    // typical /d/<id>/ patterns
    const m = /\/d\/([a-zA-Z0-9_-]+)/.exec(link);
    if (m) return m[1];
    // fallback to id= param
    const q = /id=([a-zA-Z0-9_-]+)/.exec(link);
    if (q) return q[1];
    return null;
}

function isNumericString(s) {
    return typeof s === "string" && /^-?\d+$/.test(s);
}

