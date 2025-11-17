"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractGoogleDriveFileIdFromString = extractGoogleDriveFileIdFromString;
/**
 * Extracts the Google Drive file ID from a shared link, direct ID, or any string containing a valid ID.
 * Supports common formats:
 * - https://drive.google.com/file/d/<ID>/view?usp=sharing
 * - https://drive.google.com/open?id=<ID>
 * - https://drive.google.com/uc?id=<ID>&export=download
 * - https://drive.google.com/drive/folders/<ID>
 * - Direct ID string
 * - Any string containing a valid ID
 * Returns empty string if no valid ID is found.
 */
function extractGoogleDriveFileIdFromString(input) {
    if (typeof input !== "string" || !input.trim())
        return "";
    const trimmed = input.trim();
    // Direct ID (25+ chars, alphanumeric, _, -)
    if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
        return trimmed;
    }
    // Try to parse as URL
    let url;
    try {
        url = new URL(trimmed);
    }
    catch (err) {
        // Not a valid URL, fallback to regex below
        url = null;
        // Optionally, you could log the error for debugging:
        // console.debug("URL parse failed:", err);
    }
    // /file/d/<ID>/ or /folders/<ID>
    const fileMatch = /\/d\/([a-zA-Z0-9_-]{10,})/.exec(trimmed);
    if (fileMatch)
        return fileMatch[1];
    const folderMatch = /\/folders\/([a-zA-Z0-9_-]{10,})/.exec(trimmed);
    if (folderMatch)
        return folderMatch[1];
    // id=<ID> in query string
    if (url) {
        const idParam = url.searchParams.get("id");
        if (idParam && /^[a-zA-Z0-9_-]{10,}$/.test(idParam)) {
            return idParam;
        }
    }
    else {
        // fallback for non-URL strings
        const idMatch = /id=([a-zA-Z0-9_-]{10,})/.exec(trimmed);
        if (idMatch)
            return idMatch[1];
    }
    // Last fallback: search for a long ID anywhere in the string
    const genericId = trimmed.match(/([a-zA-Z0-9_-]{25,})/);
    if (genericId)
        return genericId[1];
    return "";
}
//# sourceMappingURL=RemoteHelpers.js.map