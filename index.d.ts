export declare const debug: (on: boolean) => void;
export declare const startDiscovery: (callback: (reading: GoveeReading) => void) => Promise<void>;
export declare const stopDiscovery: () => Promise<void>;
declare type GoveeReading = {
    tempInC: number;
    tempInF: number;
    humidity: number;
    battery: number;
    rssi: number;
};
export {};
//# sourceMappingURL=index.d.ts.map