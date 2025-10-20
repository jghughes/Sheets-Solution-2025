// Pure helpers for DataFetcher — easy to unit test in Node.

function extractDriveIdFromSharedLink(link: string): string {
    // typical /d/<id>/ patterns
    const m = /\/d\/([a-zA-Z0-9_-]+)/.exec(link);
    if (m) return m[1];
    // fallback to id= param
    const q = /id=([a-zA-Z0-9_-]+)/.exec(link);
    if (q) return q[1];
    return "";
}

function isNumericString(s: string): boolean {
    return /^-?\d+$/.test(s);
}