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
export declare function extractGoogleDriveFileIdFromString(input: string): string;
//# sourceMappingURL=RemoteHelpers.d.ts.map