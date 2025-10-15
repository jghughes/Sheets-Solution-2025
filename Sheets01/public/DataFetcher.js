
/**
 * Retrieves the contents of a JSON file from the user's private Google Drive by file name.
 *
 * This function searches the user's entire Google Drive for files matching the specified name
 * using DriveApp.getFilesByName. If multiple files share the same name, only the first match is used.
 * The file's contents are read as a string and returned. The function assumes the file contains valid JSON,
 * but does not parse or validate the JSON structure.
 *
 * Notes:
 * - File names in Google Drive are not unique; multiple files may have the same name.
 * - Only the first file found is used if duplicates exist.
 * - The function operates in the context of the currently authenticated user.
 * - Throws an error if no file is found.
 *
 * @param {string} fileName - The name of the file to retrieve from Google Drive.
 * @returns {string} The file contents as a string.
 * @throws {Error} If the file is not found.
 */
function fetchJsonFromGoogleDriveFile(fileName) {

// ReSharper disable once UseOfImplicitGlobalInFunctionScope
    const files = DriveApp.getFilesByName(fileName);
    if (!files.hasNext()) {
        throw new Error("File not found.");
    }
    const file = files.next();
    const content = file.getBlob().getDataAsString();
    return content;
}

/**
 * Retrieves the content of a public Google Drive file as plain text using its sharing link.
 *
 * This function extracts the file ID from the provided Google Drive sharing link,
 * constructs a direct download URL, and fetches the file's content as a string.
 * Throws an error if the sharing link is invalid or the file cannot be accessed.
 * No parsing or validation of the file content is performed.
 *
 * Notes:
 * - Only works with files that are publicly accessible via a sharing link.
 * - Throws an error if the file ID cannot be extracted or if the file cannot be accessed.
 * - The returned value is the raw text content of the file.
 *
 * @param {string} publicLink - The public Google Drive sharing link to the file.
 * @returns {string} The file content as plain text.
 * @throws {Error} If the sharing link is invalid or the file cannot be accessed.
 */
function fetchJsonFromPublicGoogleDriveLink(publicLink) {
    // Extract file ID from the sharing link
    const match = publicLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match || !match[1]) {
        throw new Error("Invalid Google Drive sharing link: Unable to extract file ID.");
    }
    const fileId = match[1];

    // Construct the direct download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const content = fetchJsonFromUrl(downloadUrl);
    return content;
}

/**
 * Retrieves the content of a file from any public URL as plain text.
 *
 * This function fetches the content from the specified URL using UrlFetchApp.
 * It handles common HTTP errors and throws descriptive errors for access or connectivity issues.
 * The response content is returned as a string; no parsing or validation is performed.
 *
 * Notes:
 * - Throws an error if the URL is inaccessible or returns a non-200 status code.
 * - The returned value is the raw text content of the response.
 *
 * @param {string} url - The URL to fetch content from.
 * @returns {string} The response content as plain text.
 * @throws {Error} If the URL is invalid,resource is inaccessible, or returns an error status code.
 */
function fetchJsonFromUrl(url) {
    // Minimal URL format validation
    if (!/^(https?:\/\/)[^\s/$.?#].[^\s]*$/.test(url)) {
        throw new Error("Invalid URL format.");
    }

// ReSharper disable once UseOfImplicitGlobalInFunctionScope
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = response.getResponseCode();

    if (code === 403) {
        throw new Error("Access denied: You do not have permission to access this file.");
    }
    if (code === 404) {
        throw new Error("File not found: The URL is invalid or the file does not exist.");
    }
    if (code !== 200) {
        throw new Error(`Failed to fetch file: HTTP ${code}`);
    }

    const content = response.getContentText();

    return content;
}
/**
 * Checks for internet connectivity by attempting to fetch a lightweight, reliable URL.
 * @returns {boolean} True if internet is available, false otherwise.
 */

function hasInternetConnection() {
    try {
// ReSharper disable once UseOfImplicitGlobalInFunctionScope
        const response = UrlFetchApp.fetch("https://www.google.com/generate_204", { muteHttpExceptions: true });
        const code = response.getResponseCode();
        return code === 204 || code === 200;
    } catch (e) {
        return false;
    }
}

export {
    onPersonalGoogleDriveRefreshRidersClick,
    onPublicGoogleDriveLinkRefreshRidersClick,
    onAzureBlobStorageRefreshRidersClick,
    refreshRiderData,
    fetchJsonFromGoogleDriveFile,
    fetchJsonFromPublicGoogleDriveLink,
    fetchJsonFromUrl,
    hasInternetConnection
};