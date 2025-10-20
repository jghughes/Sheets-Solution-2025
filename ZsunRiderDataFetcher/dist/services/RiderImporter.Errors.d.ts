declare class ValidationError extends Error {
    code: string;
    context: any;
    constructor(code: string, message: string, context: any);
    toJson(): {
        name: string;
        code: string;
        message: string;
        context: any;
        stack: string | undefined;
    };
}
declare class ServerError extends Error {
    code: string;
    context: any;
    constructor(code: string, message: string, context: any);
    toJson(): {
        name: string;
        code: string;
        message: string;
        context: any;
        stack: string | undefined;
    };
}
declare function throwServerError(code: string, message: string, context: any): never;
declare function isValidationError(err: any): boolean;
declare function isServerError(err: any): boolean;
//# sourceMappingURL=RiderImporter.Errors.d.ts.map