/**
 * Repository for RiderItem objects, keyed by zwiftId (int as string).
 * Backing store is a plain object. Entries are accessible in alpha order by name.
 */
function RepositoryOfRiders() {
    this._backingStoreDictOfRiders = {}; // Key: zwiftId (as string), Value: RiderItem
}

/**
 * Loads riders from a JSON object.
 * @param {Object} jsonObj - Dictionary keyed by zwiftId (string), value is a record for RiderItem.
 * @returns {boolean} True if load succeeded, false otherwise.
 */
RepositoryOfRiders.prototype.loadFromJson = function (jsonObj) {
    if (!jsonObj || typeof jsonObj !== "object" || Array.isArray(jsonObj)) {
        return false;
    }
    this._backingStoreDictOfRiders = {};
    for (let key in jsonObj) {
        if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) continue;
        // Ensure key is a string of digits (valid zwiftId)
        if (!/^\d+$/.test(key)) continue;
        const value = jsonObj[key];
        if (!value || typeof value !== "object" || Array.isArray(value)) continue;
        const rider = new RiderItem(value);
        // Ensure zwiftId and name are present
        if (rider.zwiftId && rider.name) {
            this._backingStoreDictOfRiders[key] = rider;
        }
    }
    return true;
};

/**
 * Removes all riders whose zwiftId is NOT in the provided array.
 * Efficient for keeping a small subset of a large collection.
 * Mutates this._backingStoreDictOfRiders in place by replacing it with a new object.
 *
 * @param {number[]} idArray - Array of zwiftId integers to retain.
 * @returns {number} The number of entries removed.
 *
 * @example
 * // Suppose the repository contains riders with IDs 101, 102, 103, 104
 * var repo = new RepositoryOfRiders();
 * repo.loadFromJson(jsonObj);
 * // Retain only riders with IDs 101 and 104
 * var removed = repo.compactAllRidersToSubsetOfRiders([101, 104]);
 * // After this call, only riders 101 and 104 remain in the repository
 * // removed === 2
 */
RepositoryOfRiders.prototype.compactRepositoryToSubsetOfRiders = function (idArray) {
    if (!Array.isArray(idArray)) return 0;
    const idSet = {};
    for (let i = 0; i < idArray.length; ++i) {
        idSet[String(idArray[i])] = true;
    }
    const newRiders = {};
    var kept = 0;
    for (let key in idSet) {
        if (this._backingStoreDictOfRiders.hasOwnProperty(key)) {
            newRiders[key] = this._backingStoreDictOfRiders[key];
            kept++;
        }
    }
    const removed = Object.keys(this._backingStoreDictOfRiders).length - kept;
    this._backingStoreDictOfRiders = newRiders;
    return removed;
};

/**
 * Clears all riders.
 */
RepositoryOfRiders.prototype.clear = function () {
    this._backingStoreDictOfRiders = {};
};

/**
 * Returns an array of RiderItem, sorted by name (case-insensitive, alpha).
 * @returns {RiderItem[]}
 */
RepositoryOfRiders.prototype.getAllSortedByName = function () {
    const arr = [];
    for (let key in this._backingStoreDictOfRiders) {
        if (this._backingStoreDictOfRiders.hasOwnProperty(key)) {
            arr.push(this._backingStoreDictOfRiders[key]);
        }
    }
    arr.sort(function (a, b) {
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });
    return arr;
};

/**
 * Gets a rider by zwiftId.
 * @param {number} zwiftId
 * @returns {RiderItem|null}
 */
RepositoryOfRiders.prototype.getById = function (zwiftId) {
    zwiftId = String(zwiftId);
    return this._backingStoreDictOfRiders.hasOwnProperty(zwiftId) ? this._backingStoreDictOfRiders[zwiftId] : null;
};

/**
 * Returns the count of riders.
 * @returns {number}
 */
RepositoryOfRiders.prototype.count = function () {
    return Object.keys(this._backingStoreDictOfRiders).length;
};


