type ParseType = any;
declare const parseType: any;
declare function resolveValue(rawJson: string, key: string, defaultValue: any): any;
declare function parseAsString(value: string, defaultValue: string): string;
declare function parseAsFloat(value: string, defaultValue: number): number;
declare function parseAsInt(value: string, defaultValue: number): number;
declare function parseAsBoolean(value: string, defaultValue: boolean): boolean;
declare function fromDotNetTicks(ticks: number): Date;
declare function numericToDate(n: any): any;
declare function parseAsDate(value: string, defaultValue: Date): Date;
declare function serializeString(value: string, defaultValue: any): any;
declare function serializeFloat(value: any, defaultValue: any): any;
declare function serializeInt(value: any, defaultValue: any): any;
declare function serializeDate(value: any): any;
declare function serializeType(value: any, type: any, defaultValue: any): any;
declare function parseField(rawJson: any, key: any, type: any, defaultValue: any): any;
//# sourceMappingURL=ParsersAndSerializers.d.ts.map