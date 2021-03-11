"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPeripheral = exports.isHt5179 = exports.isHt5101 = exports.isHt5075 = exports.isHt5074 = void 0;
const h5074_uuid_rev = "88ec";
const h5075_uuid_rev = "88ec";
const h5101_uuid_rev = "0100";
const h5179_uuid_rev = "0188";
exports.isHt5074 = (hex) => hex.includes(h5074_uuid_rev) && hex.length == 18; // Govee H5074
exports.isHt5075 = (hex) => hex.includes(h5075_uuid_rev) && hex.length == 16; // Govee H5072/H5075
exports.isHt5101 = (hex) => hex.includes(h5101_uuid_rev); // Govee H5101/H5102
exports.isHt5179 = (hex) => hex.includes(h5179_uuid_rev) && hex.length == 22; // Govee H5179
exports.isValidPeripheral = (peripheral) => {
    const { address, advertisement } = peripheral;
    if (!advertisement || !advertisement.manufacturerData) {
        return false;
    }
    const hex = advertisement.manufacturerData.toString("hex");
    if (!exports.isHt5074(hex) && !exports.isHt5075(hex) && !exports.isHt5101(hex) && !exports.isHt5179(hex)) {
        return false;
    }
    return true;
};
