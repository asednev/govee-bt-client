export declare const debug: (on: boolean) => void;
export declare const startDiscovery: (callback: (reading: GoveeReading) => void) => Promise<void>;
export declare const stopDiscovery: () => Promise<void>;
export declare type GoveeReading = {
    uuid: string;
    address: string;
    model: string;
    tempInC: number;
    tempInF: number;
    humidity: number;
    battery: number;
    rssi: number;
};
//# sourceMappingURL=index.d.ts.map