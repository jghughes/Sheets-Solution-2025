// jsUtils.js
// Utility functions for Sheets01

/**
 * Checks if an object has all required properties, and they are non-empty strings (not arrays).
 * @param {Object} objectToCheck - The object to check.
 * @param {string[]} requiredProperties - Array of required property names.
 * @returns {boolean} True if all properties exist and are valid, false otherwise.
 */
function hasValidStringProps(objectToCheck, requiredProperties) {
    if (typeof objectToCheck !== "object" || objectToCheck === null || Array.isArray(objectToCheck)) {
        return false;
    }
    return requiredProperties.every(propertyName =>
        Object.prototype.hasOwnProperty.call(objectToCheck, propertyName) &&
        typeof objectToCheck[propertyName] === "string" &&
        !Array.isArray(objectToCheck[propertyName]) &&
        !isEmpty(objectToCheck[propertyName])
    );
}
/**
 * Checks if a value is empty (null, undefined, empty string, or array/object with no items).
 * @param {*} value
 * @returns {boolean}
 */
function isEmpty(value) {
    if (value == null) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0) return true;
    return false;
}

/**
 * Deep clones an object or array.
 * @param {*} obj
 * @returns {*}
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * De-bounces a function, ensuring it's only called after a delay.
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Throttles a function, ensuring it's only called once per interval.
 * @param {Function} func
 * @param {number} limit
 * @returns {Function}
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Synchronous sleep for Google Apps Script (blocks execution for ms milliseconds).
 * Use with care, as it will block the entire script during the wait.
 * @param {number} ms - Milliseconds to sleep.
 */
function sleep(ms) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
        // Busy-wait loop
    }
}


export {
    hasValidStringProps,
    isEmpty,
    deepClone,
    debounce,
    throttle,
    sleep
};