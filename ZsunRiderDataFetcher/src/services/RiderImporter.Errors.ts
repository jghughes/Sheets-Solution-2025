"use strict";

class ValidationError extends Error {
    code: string;
    context: any;

    constructor(code: string, message: string, context: any) {
        super(message);
        this.name = "ValidationError";
        this.code = code;
        this.context = context;
        Object.setPrototypeOf(this, ValidationError.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }

    toJson() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context,
            stack: this.stack
        };
    }
}

class ServerError extends Error {
    code: string;
    context: any;

    constructor(code: string, message: string, context: any) {
        super(message);
        this.name = "ServerError";
        this.code = code || "server_error";
        this.context = context !== undefined ? context : null;
        Object.setPrototypeOf(this, ServerError.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServerError);
        }
    }

    toJson() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context,
            stack: this.stack
        };
    }
}

function throwServerError(code: string, message: string, context: any): never {
    throw new ServerError(code, message, context);
}

function isValidationError(err: any): boolean {
    return err instanceof ValidationError;
}

function isServerError(err: any): boolean {
    return err instanceof ServerError;
}


export {
    ValidationError,
    ServerError,
    throwServerError,
    isValidationError,
    isServerError
    };