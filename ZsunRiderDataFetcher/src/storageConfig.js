"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSourceUrlForRidersOnAzure = void 0;
const defaultStorageAccount = "<customerzsun>";
const defaultContainer = "<preprocessed>";
const defaultBlobName = "<rider_stats_dto_as_list.json>";
exports.defaultSourceUrlForRidersOnAzure = `https://${defaultStorageAccount}.blob.core.windows.net/${defaultContainer}/${defaultBlobName}`;
//# sourceMappingURL=storageConfig.js.map