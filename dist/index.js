"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerScanStop = exports.registerScanStart = exports.stopDiscovery = exports.startDiscovery = exports.debug = void 0;
const noble_1 = __importDefault(require("@abandonware/noble"));
const validation_1 = require("./validation");
const decode_1 = require("./decode");
process.env.NOBLE_REPORT_ALL_HCI_EVENTS = "1"; // needed on Linux including Raspberry Pi
const h5075_uuid = "ec88";
const h5101_uuid = "0001";
let DEBUG = false;
let discoverCallback;
let scanStartCallback;
let scanStopCallback;
noble_1.default.on("discover", async (peripheral) => {
    const { id, uuid, address, state, rssi, advertisement } = peripheral;
    if (DEBUG) {
        console.log("discovered", id, uuid, address, state, rssi);
    }
    if (!validation_1.isValidPeripheral(peripheral)) {
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
    const decodedValues = decode_1.decodeAny(streamUpdate);
    const current = {
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
noble_1.default.on("scanStart", () => {
    if (DEBUG) {
        console.log("scanStart");
    }
    if (scanStartCallback) {
        scanStartCallback();
    }
});
noble_1.default.on("scanStop", () => {
    if (DEBUG) {
        console.log("scanStop");
    }
    if (scanStopCallback) {
        scanStopCallback();
    }
});
exports.debug = (on) => {
    DEBUG = on;
};
exports.startDiscovery = async (callback) => {
    discoverCallback = callback;
    await noble_1.default.startScanningAsync([h5075_uuid, h5101_uuid], true);
};
exports.stopDiscovery = async () => {
    await noble_1.default.stopScanningAsync();
    discoverCallback = undefined;
    scanStartCallback = undefined;
    scanStopCallback = undefined;
};
exports.registerScanStart = (callback) => {
    scanStartCallback = callback;
};
exports.registerScanStop = (callback) => {
    scanStopCallback = callback;
};
__exportStar(require("./goveeReading"), exports);
