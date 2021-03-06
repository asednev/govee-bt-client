import noble from "@abandonware/noble";
import { isHt5075, isHt5101, isValidPeripheral } from "./validation";
import { decodeAny } from "./decode";
import { GoveeReading } from "./goveeReading";

process.env.NOBLE_REPORT_ALL_HCI_EVENTS = "1"; // needed on Linux including Raspberry Pi

const h5075_uuid = "ec88";
const h5101_uuid = "0001";

let DEBUG = false;

let discoverCallback: undefined | ((reading: GoveeReading) => void);
let scanStartCallback: undefined | Function;
let scanStopCallback: undefined | Function;

noble.on("discover", async (peripheral) => {
    const { id, uuid, address, state, rssi, advertisement } = peripheral;
    if (DEBUG) {
        console.log("discovered", id, uuid, address, state, rssi);
    }

    if (!isValidPeripheral(peripheral)) {
        if (DEBUG) {
            let mfgData;
            if (advertisement.manufacturerData) {
                mfgData = advertisement.manufacturerData.toString("hex");
            }
            console.log(`invalid peripheral, manufacturerData=[${mfgData}]`);
        }
        return;
    }

    const { localName, manufacturerData } = advertisement;

    const streamUpdate = manufacturerData.toString("hex");

    if (DEBUG) {
        console.log(`${id}: ${streamUpdate}`);
    }

    const decodedValues = decodeAny(streamUpdate);

    const current: GoveeReading = {
        uuid,
        address,
        model: localName,
        battery: decodedValues.battery,
        humidity: decodedValues.humidity,
        tempInC: decodedValues.tempInC,
        tempInF: decodedValues.tempInF,
        rssi,
    };

    if (discoverCallback) {
        discoverCallback(current);
    }
});

noble.on("scanStart", () => {
    if (DEBUG) {
        console.log("scanStart");
    }
    if (scanStartCallback) {
        scanStartCallback();
    }
});

noble.on("scanStop", () => {
    if (DEBUG) {
        console.log("scanStop");
    }
    if (scanStopCallback) {
        scanStopCallback();
    }
});

export const debug = (on: boolean) => {
    DEBUG = on;
};

export const startDiscovery = async (
    callback: (reading: GoveeReading) => void
) => {
    discoverCallback = callback;

    await noble.startScanningAsync([h5075_uuid, h5101_uuid], true);
};

export const stopDiscovery = async () => {
    await noble.stopScanningAsync();

    discoverCallback = undefined;
    scanStartCallback = undefined;
    scanStopCallback = undefined;
};

export const registerScanStart = (callback: Function) => {
    scanStartCallback = callback;
};

export const registarScanStop = (callback: Function) => {
    scanStopCallback = callback;
};

export * from "./goveeReading";
