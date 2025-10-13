// jsUtilsAsync.js
/**
 * NOTE: None of the methods in this file are compatible with Google Apps Script.
 *
 * Google Apps Script does not support JavaScript Promises or the async/await syntax.
 * Its runtime is based on an older version of JavaScript (ES5), which lacks support for
 * asynchronous constructs such as Promises, async functions, and the Fetch API.
 * As a result, any method that returns a Promise or uses async/await will fail to run
 * in Google Apps Script environments. These methods are intended for use in modern
 * browsers or JavaScript runtimes that support ES6 and later.
 */

/**
 * Asynchronously loads a script into the document.
 * @param {string} src - The source URL of the script.
 * @returns {Promise<void>}
 */
export async function loadScriptAsync(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

/**
 * Waits for a specified number of milliseconds.
 * @param {number} ms - Milliseconds to wait.
 * @returns {Promise<void>}
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Asynchronously fetches JSON from a URL.
 * @param {string} url - The URL to fetch.
 * @param {RequestInit} [options] - Fetch options.
 * @returns {Promise<any>}
 */
export async function fetchJsonAsync(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}