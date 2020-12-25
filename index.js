"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopDiscovery = exports.startDiscovery = exports.debug = void 0;
const noble_1 = __importDefault(require("@abandonware/noble"));
process.env.NOBLE_REPORT_ALL_HCI_EVENTS = '1'; // needed on Linux including Raspberry Pi
const h5075_uuid = "ec88";
const h5075_uuid_rev = "88ec";
const h5101_uuid_rev = "0100";
const govee_bt_mac = "a4-c1-38";
const govee_bt_mac_alt = "a4:c1:38";
let DEBUG = false;
const isHt5075 = (hex) => hex.includes(h5075_uuid_rev); // Govee H5072/H5075
const isHt5101 = (hex) => hex.includes(h5101_uuid_rev); // Govee H5101/H5102
const isValidPeripheral = (peripheral) => {
    const { address, advertisement } = peripheral;
    if (!advertisement || !advertisement.manufacturerData) {
        return false;
    }
    if (address && (!address.toLowerCase().startsWith(govee_bt_mac) && !address.toLowerCase().startsWith(govee_bt_mac_alt))) {
        return false;
    }
    const hex = advertisement.manufacturerData.toString('hex');
    if (!isHt5075(hex) && !isHt5101(hex)) {
        return false;
    }
    return true;
};
const decodeH5075Values = (streamUpdate) => {
    // TODO would be great to find a way to validate
    const encodedData = parseInt(streamUpdate.substring(6, 12), 16);
    const battery = parseInt(streamUpdate.substring(12, 14), 16);
    const tempInC = encodedData / 10000;
    const tempInF = (tempInC * 9 / 5) + 32;
    const humidity = (encodedData % 1000) / 10;
    return {
        battery,
        humidity,
        tempInC,
        tempInF,
    };
};
const decodeH5101Values = (streamUpdate) => {
    // TODO would be great to find a way to validate
    const encodedData = parseInt(streamUpdate.substring(8, 14), 16);
    const battery = parseInt(streamUpdate.substring(14, 16), 16);
    const tempInC = encodedData / 10000;
    const tempInF = (tempInC * 9 / 5) + 32;
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
    if (!isValidPeripheral(peripheral)) {
        if (DEBUG) {
            console.log('invalid peripheral, scan for another');
        }
        ;
        return;
    }
    const { localName, manufacturerData } = advertisement;
    const streamUpdate = manufacturerData.toString('hex');
    if (DEBUG) {
        console.log(`${id}: ${streamUpdate}`);
    }
    const decodedValues = isHt5075(streamUpdate) ? decodeH5075Values(streamUpdate) : decodeH5101Values(streamUpdate);
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
