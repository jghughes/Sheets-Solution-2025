'use strict';

/**
 * ValidationError - user-correctable issues (non-fatal for import workflow)
 */
class ValidationError extends Error {
    /**
     * @param {string} [code='validation']
     * @param {string} [message='']
     * @param {any} [context=null]
     */
    constructor(code = 'validation', message = '', context = null) {
        super(message);
        this.name = 'ValidationError';
        this.code = code;
        this.context = context;

        // Ensure proper prototype chain on some environments
        if (typeof Object.setPrototypeOf === 'function') {
            Object.setPrototypeOf(this, new.target.prototype);
        }

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context,
            stack: this.stack
        };
    }
}

/**
 * ServerError - fatal runtime / environment errors that should surface as failures
 */
class ServerError extends Error {
    /**
     * @param {string} [code='server_error']
     * @param {string} [message='']
     * @param {any} [context=null]
     */
    constructor(code = 'server_error', message = '', context = null) {
        super(message);
        this.name = 'ServerError';
        this.code = code;
        this.context = context;

        if (typeof Object.setPrototypeOf === 'function') {
            Object.setPrototypeOf(this, new.target.prototype);
        }

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context,
            stack: this.stack
        };
    }
}

const throwServerError = (code, message, context) => {
    throw new ServerError(code, message, context);
};

const isValidationError = (err) =>
    !!err && (err instanceof ValidationError || err && err.name === 'ValidationError');

const isServerError = (err) =>
    !!err && (err instanceof ServerError || err && err.name === 'ServerError');