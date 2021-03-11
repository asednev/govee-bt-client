import { GoveeReading } from "./goveeReading";
export declare const debug: (on: boolean) => void;
export declare const startDiscovery: (callback: (reading: GoveeReading) => void) => Promise<void>;
export declare const stopDiscovery: () => Promise<void>;
export declare const registerScanStart: (callback: Function) => void;
export declare const registerScanStop: (callback: Function) => void;
export * from "./goveeReading";
//# sourceMappingURL=index.d.ts.map