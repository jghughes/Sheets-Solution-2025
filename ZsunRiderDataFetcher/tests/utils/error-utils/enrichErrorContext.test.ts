import { enrichErrorContext, ValidationError, ServerError, AlertMessageError } from "../../../src/utils/ErrorUtils";

describe("enrichErrorContext", () => {
    it("should add new properties to an error's context", () => {
        const error = new ValidationError("code", "msg", { foo: "bar" });
        const extraContext: Partial<ValidationError["context"]> = { baz: 42 };
        enrichErrorContext(error, extraContext);
        expect(error.context.foo).toBe("bar");
        expect(error.context.baz).toBe(42);
    });

    it("should overwrite existing properties in context", () => {
        const error = new ServerError("code", "msg", { a: 1, b: 2 });
        const extraContext: Partial<ServerError["context"]> = { b: 99 };
        enrichErrorContext(error, extraContext);
        expect(error.context.a).toBe(1);
        expect(error.context.b).toBe(99);
    });

    it("should initialize context if it is undefined", () => {
        // context is undefined by default if not passed
        const error = new AlertMessageError("code", "msg", undefined);
        const extraContext: Partial<AlertMessageError["context"]> = { x: "y" };
        enrichErrorContext(error, extraContext);
        expect(error.context.x).toBe("y");
    });

    it("should initialize context if it is null", () => {
        const obj: { context?: any } = { context: null };
        const extraContext: Partial<typeof obj.context> = { test: true };
        enrichErrorContext(obj, extraContext);
        expect(obj.context.test).toBe(true);
    });

    it("should work with plain objects that have a context property", () => {
        const obj: { context?: any } = {};
        const extraContext: Partial<typeof obj.context> = { test: true };
        enrichErrorContext(obj, extraContext);
        expect(obj.context.test).toBe(true);
    });

    it("should not modify context if no properties are provided", () => {
        const error = new ValidationError("code", "msg", { foo: "bar" });
        const extraContext: Partial<ValidationError["context"]> = {};
        enrichErrorContext(error, extraContext);
        expect(error.context).toEqual({ foo: "bar" });
    });
});