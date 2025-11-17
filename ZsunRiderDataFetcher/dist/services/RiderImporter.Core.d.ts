import { RiderStatsDto } from "../models/RiderStatsDto";
export declare function showHelpDocument(): void;
export declare function importRidersFromMyDrive(filename: string, driveAppImpl?: any): {
    ok: boolean;
    message: string;
    reason?: string;
    details?: any;
};
export declare function importRidersFromGoogleDriveLink(link: string, driveAppImpl?: any): {
    ok: boolean;
    message: string;
    reason?: string;
    details?: any;
};
export declare function importRidersFromUrl(url: string, fetchImpl?: any): {
    ok: boolean;
    message: string;
    reason?: string;
    details?: any;
};
export declare function refreshRiderData(fetchFunction: () => string, successMessage?: string | null, operationName?: string): {
    ok: boolean;
    message: string;
    reason?: string;
    details?: any;
};
export declare function processFileContentsAndWriteSheets(jsonText: string, sourceLabel: string): {
    [key: string]: RiderStatsDto;
};
//# sourceMappingURL=RiderImporter.Core.d.ts.map