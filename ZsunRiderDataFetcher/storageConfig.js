"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSourceUrlForRidersOnAzure = void 0;
const defaultStorageAccount = "<your-storage-account>";
const defaultContainer = "<your-container>";
const defaultBlobName = "<your-blob-name>";
exports.defaultSourceUrlForRidersOnAzure = `https://${defaultStorageAccount}.blob.core.windows.net/${defaultContainer}/${defaultBlobName}`;
//# sourceMappingURL=storageConfig.js.map