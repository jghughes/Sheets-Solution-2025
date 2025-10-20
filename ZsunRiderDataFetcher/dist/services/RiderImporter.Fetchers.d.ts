declare const personalGoogleDriveRidersFilename: "everyone_in_club_ZsunItems_2025_09_22_modern.json";
declare const publicGoogleDriveRidersFileLink: "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";
declare const azureBlobRidersFileUrl: "https://<your-storage-account>.blob.core.windows.net/<container>/<filename>.json";
/**
 * hasInternetConnection - minimal, dependency-injectable check
 */
declare function hasInternetConnection(fetchImpl?: GoogleAppsScript.URL_Fetch.UrlFetchApp | null): boolean;
/**
 * fetchPlainTextFileFromMyDrive - lookup by filename
 */
declare function fetchPlainTextFileFromMyDrive(filename: any, opName?: string, driveAppImpl?: GoogleAppsScript.Drive.DriveApp | null): string;
/**
 * fetchPlainTextFileFromSharedLinkToGoogleDrive - extract id then fetch
 * Depends on SheetsDataFetcherCore.extractDriveIdFromSharedLink if available.
 */
declare function fetchPlainTextFileFromSharedLinkToGoogleDrive(sharedLink: any, opName?: string, driveAppImpl?: GoogleAppsScript.Drive.DriveApp | null, coreUtil?: any): string;
/**
 * fetchPlainTextFileFromUrl - HTTP(S) fetch with classification of 4xx vs 5xx
 */
declare function fetchPlainTextFileFromUrl(url: any, opName?: string, fetchImpl?: GoogleAppsScript.URL_Fetch.UrlFetchApp | null): any;
//# sourceMappingURL=RiderImporter.Fetchers.d.ts.map