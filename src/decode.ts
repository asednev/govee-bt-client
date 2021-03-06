import { isHt5074, isHt5075, isHt5101, isHt5179 } from "./validation";

export const decodeH5074Values = (streamUpdate: string) => {
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

export const decodeH5075Values = (streamUpdate: string) => {
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

export const decodeH5101Values = (streamUpdate: string) => {
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

export const decodeH5179Values = (streamUpdate: string) => {
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

export const decodeAny = (streamUpdate: string) => {
    if (isHt5074(streamUpdate)) {
        return decodeH5074Values(streamUpdate);
    }
    if (isHt5075(streamUpdate)) {
        return decodeH5075Values(streamUpdate);
    }
    if (isHt5101(streamUpdate)) {
        return decodeH5101Values(streamUpdate);
    }
    if (isHt5179(streamUpdate)) {
        return decodeH5179Values(streamUpdate);
    }

    throw new Error("Unsupported stream update: " + streamUpdate);
};

function twos_complement(n: number, w: number = 16): number {
    // Adapted from: https://stackoverflow.com/a/33716541.
    if (n & (1 << (w - 1))) {
        n = n - (1 << w);
    }
    return n;
}
