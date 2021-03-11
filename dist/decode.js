"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAny = exports.decodeH5179Values = exports.decodeH5101Values = exports.decodeH5075Values = exports.decodeH5074Values = void 0;
const validation_1 = require("./validation");
exports.decodeH5074Values = (streamUpdate) => {
    // inspired by https://github.com/Home-Is-Where-You-Hang-Your-Hack/sensor.goveetemp_bt_hci/blob/master/custom_components/govee_ble_hci/govee_advertisement.py#L116
    const temp_lsb = streamUpdate
        .substring(8, 10)
        .concat(streamUpdate.substring(6, 8));
    const hum_lsb = streamUpdate
        .substring(12, 14)
        .concat(streamUpdate.substring(10, 12));
    const tempInC = twos_complement(parseInt(temp_lsb, 16)) / 100;
    const tempInF = (tempInC * 9) / 5 + 32;
    const humidity = parseInt(hum_lsb, 16) / 100;
    const battery = parseInt(streamUpdate.substring(14, 16), 16);
    return {
        battery,
        humidity,
        tempInC,
        tempInF,
    };
};
exports.decodeH5075Values = (streamUpdate) => {
    // TODO would be great to find a way to validate
    const encodedData = parseInt(streamUpdate.substring(6, 12), 16);
    const battery = parseInt(streamUpdate.substring(12, 14), 16);
    const tempInC = encodedData / 10000;
    const tempInF = (tempInC * 9) / 5 + 32;
    const humidity = (encodedData % 1000) / 10;
    return {
        battery,
        humidity,
        tempInC,
        tempInF,
    };
};
exports.decodeH5101Values = (streamUpdate) => {
    // TODO would be great to find a way to validate
    const encodedData = parseInt(streamUpdate.substring(8, 14), 16);
    const battery = parseInt(streamUpdate.substring(14, 16), 16);
    const tempInC = encodedData / 10000;
    const tempInF = (tempInC * 9) / 5 + 32;
    const humidity = (encodedData % 1000) / 10;
    return {
        battery,
        humidity,
        tempInC,
        tempInF,
    };
};
exports.decodeH5179Values = (streamUpdate) => {
    // TODO would be great to find a way to validate
    const temp_lsb = streamUpdate
        .substring(14, 16)
        .concat(streamUpdate.substring(16, 18));
    const hum_lsb = streamUpdate
        .substring(18, 20)
        .concat(streamUpdate.substring(16, 18));
    const tempInC = twos_complement(parseInt(temp_lsb, 16)) / 100;
    const tempInF = (tempInC * 9) / 5 + 32;
    const humidity = parseInt(hum_lsb, 16) / 100;
    const battery = parseInt(streamUpdate.substring(20, 22), 16);
    return {
        battery,
        humidity,
        tempInC,
        tempInF,
    };
};
exports.decodeAny = (streamUpdate) => {
    if (validation_1.isHt5074(streamUpdate)) {
        return exports.decodeH5074Values(streamUpdate);
    }
    if (validation_1.isHt5075(streamUpdate)) {
        return exports.decodeH5075Values(streamUpdate);
    }
    if (validation_1.isHt5101(streamUpdate)) {
        return exports.decodeH5101Values(streamUpdate);
    }
    if (validation_1.isHt5179(streamUpdate)) {
        return exports.decodeH5179Values(streamUpdate);
    }
    throw new Error("Unsupported stream update: " + streamUpdate);
};
function twos_complement(n, w = 16) {
    // Adapted from: https://stackoverflow.com/a/33716541.
    if (n & (1 << (w - 1))) {
        n = n - (1 << w);
    }
    return n;
}
