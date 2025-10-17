function RepositoryOfRiders() {
    this._backingStoreDictOfRiders = {}; // Key: zwiftId (as string), Value: RiderItem
}

/**
 * Loads riders from a JSON string and replaces the repository contents.
 *
 * The input must be a JSON string that parses to a non-array object whose keys
 * are Zwift IDs (digits-only strings) and whose values are plain objects used
 * to construct `RiderItem` instances.
 *
 * Side effects:
 * - Replaces `this._backingStoreDictOfRiders` with the parsed and validated data.
 *
 * @param {string} jsonString - A JSON string representing a dictionary where
 *                              each key is a Zwift ID (digits-only string)
 *                              and each value is a record used to construct a `RiderItem`.
 * @throws {TypeError}   If `jsonString` is not a string or is empty/whitespace.
 * @throws {SyntaxError} If the string cannot be parsed as JSON. The original
 *                       parser error message is appended for context.
 * @throws {Error}       If the parsed value is not an object, if an object key
 *                       is not a digits-only string, if a value is not a plain
 *                       object, if `RiderItem` construction fails for any key,
 *                       or if a constructed `RiderItem` is missing required
 *                       properties (`zwiftId` and/or `name`).
 *
 * @example
 * // Valid input:
 * // '{"101": {"zwiftId": 101, "name": "Alice"}, "102": {"zwiftId": 102, "name": "Bob"}}'
 * repo.loadFromJson(jsonString);
 */
RepositoryOfRiders.prototype.loadFromJson = function (jsonString) {
    if (typeof jsonString !== "string") {
        throw new Error("RepositoryOfRiders.loadFromJson: input must be a JSON string.");
    }
    if (jsonString.trim().length === 0) {
        throw new Error("RepositoryOfRiders.loadFromJson: input string is empty or whitespace.");
    }

    let jsonObj;
    try {
        jsonObj = JSON.parse(jsonString);
    } catch (parseErr) {
        throw new Error("RepositoryOfRiders.loadFromJson: failed to parse JSON string. " + (parseErr && parseErr.message ? parseErr.message : String(parseErr)));
    }

    if (!jsonObj || typeof jsonObj !== "object" || Array.isArray(jsonObj)) {
        throw new Error("RepositoryOfRiders.loadFromJson: parsed JSON must be a non-array object mapping zwiftId (string) to RiderItem records.");
    }

    this._backingStoreDictOfRiders = {};

    for (let key in jsonObj) {
        if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) continue;

        // Validate key
        if (!/^\d+$/.test(key)) {
            throw new Error("RepositoryOfRiders.loadFromJson: encountered invalid key '" + key + "'. Expected zwiftId as digits-only string.");
        }

        const value = jsonObj[key];
        if (!value || typeof value !== "object" || Array.isArray(value)) {
            throw new Error("RepositoryOfRiders.loadFromJson: value for key '" + key + "' must be a non-array object representing a RiderItem.");
        }

        let rider;
        try {
            rider = new RiderItem(value);
        } catch (ctorErr) {
            throw new Error("RepositoryOfRiders.loadFromJson: failed to construct RiderItem for key '" + key + "'. " + (ctorErr && ctorErr.message ? ctorErr.message : String(ctorErr)));
        }

        if (!rider.zwiftId || !rider.name) {
            throw new Error("RepositoryOfRiders.loadFromJson: RiderItem for key '" + key + "' is missing required properties 'zwiftId' and/or 'name'.");
        }

        this._backingStoreDictOfRiders[key] = rider;
    }
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
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
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