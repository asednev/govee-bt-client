import noble from "@abandonware/noble";
import { isHt5075, isHt5101, isValidPeripheral } from "./validation";
import { decodeAny } from "./decode";
import { GoveeReading } from "./goveeReading";

process.env.NOBLE_REPORT_ALL_HCI_EVENTS = "1"; // needed on Linux including Raspberry Pi

const h5075_uuid = "ec88";
const h5101_uuid = "0001";

let DEBUG = false;

let currentCallback: undefined | ((reading: GoveeReading) => void);

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

    if (currentCallback) {
        currentCallback(current);
    }
});

export const debug = (on: boolean) => {
    DEBUG = on;
};

export const startDiscovery = async (
    callback: (reading: GoveeReading) => void
) => {
    currentCallback = callback;

    await noble.startScanningAsync([h5075_uuid, h5101_uuid], true);
};

export const stopDiscovery = async () => {
    await noble.stopScanningAsync();

    currentCallback = undefined;
};

export * from "./goveeReading";
