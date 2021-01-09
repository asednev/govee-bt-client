import { isHt5075 } from "./validation";

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

export const decodeAny = (streamUpdate: string) => {
    return isHt5075(streamUpdate)
        ? decodeH5075Values(streamUpdate)
        : decodeH5101Values(streamUpdate);
};
