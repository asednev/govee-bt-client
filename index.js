"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopDiscovery = exports.startDiscovery = exports.debug = void 0;
const noble_1 = __importDefault(require("@abandonware/noble"));
const h5075_uuid = "ec88";
const h5075_uuid_rev = "88ec";
const govee_bt_mac = "a4-c1-38";
let DEBUG = false;
const validPeripheral = (peripheral) => {
    const { address, advertisement } = peripheral;
    if (!advertisement || !advertisement.manufacturerData) {
        return false;
    }
    if (address && !address.toLowerCase().startsWith(govee_bt_mac)) {
        return false;
    }
    const hex = advertisement.manufacturerData.toString('hex');
    if (!hex.includes(h5075_uuid_rev)) {
        return false;
    }
    return true;
};
const decodeValues = (streamUpdate) => {
    // TODO would be great to find a way to validate
    const encodedData = parseInt(streamUpdate.substring(6, 12), 16);
    const battery = parseInt(streamUpdate.substring(12, 14), 16);
    const tempInC = encodedData / 10000;
    const tempInF = (tempInC * 5 / 9) + 32;
    const humidity = (encodedData % 1000) / 10;
    return {
        battery,
        humidity,
        tempInC,
        tempInF,
    };
};
let currentCallback;
noble_1.default.on('discover', async (peripheral) => {
    const { id, uuid, address, state, rssi, advertisement } = peripheral;
    if (DEBUG) {
        console.log('discovered', id, uuid, address, state, rssi);
    }
    if (!validPeripheral(peripheral)) {
        if (DEBUG) {
            console.log('invalid peripheral, scan for another');
        }
        ;
        // await startDiscovery();
        return;
    }
    const { localName, manufacturerData } = advertisement;
    const streamUpdate = manufacturerData.toString('hex');
    if (DEBUG) {
        console.log(`${id}: ${streamUpdate}`);
    }
    const decodedValues = decodeValues(streamUpdate);
    const current = {
        uuid,
        address,
        model: localName,
        battery: decodedValues.battery,
        humidity: decodedValues.humidity,
        tempInC: decodedValues.tempInC,
        tempInF: decodedValues.tempInF,
        rssi
    };
    if (currentCallback) {
        currentCallback(current);
    }
    ;
});
exports.debug = (on) => { DEBUG = on; };
exports.startDiscovery = async (callback) => {
    currentCallback = callback;
    await noble_1.default.startScanningAsync([h5075_uuid], true);
};
exports.stopDiscovery = async () => {
    await noble_1.default.stopScanningAsync();
    currentCallback = undefined;
};
