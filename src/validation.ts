import noble from "@abandonware/noble";

const govee_bt_mac_allowlist = [
    "a4:c1:38", // Telink Semiconductor (Taipei) Co. Ltd.
    "e3:37:3c", // unknown manufacturer
];

const h5074_uuid_rev = "88ec";
const h5075_uuid_rev = "88ec";
const h5101_uuid_rev = "0100";

export const isHt5074 = (hex: string) =>
    hex.includes(h5074_uuid_rev) && hex.length == 18; // Govee H5074
export const isHt5075 = (hex: string) =>
    hex.includes(h5075_uuid_rev) && hex.length == 16; // Govee H5072/H5075
export const isHt5101 = (hex: string) => hex.includes(h5101_uuid_rev); // Govee H5101/H5102

export const isValidPeripheral = (peripheral: noble.Peripheral) => {
    const { address, advertisement } = peripheral;

    if (!advertisement || !advertisement.manufacturerData) {
        return false;
    }

    if (
        address &&
        !govee_bt_mac_allowlist.some((x) => {
            const prefix = x.replace(/:/g, '');
            const mac = address.toLowerCase().replace(/:/g, '').replace(/-/g, '');
            return mac.startsWith(prefix);
        })
    ) {
        return false;
    }

    const hex = advertisement.manufacturerData.toString("hex");

    if (!isHt5074(hex) && !isHt5075(hex) && !isHt5101(hex)) {
        return false;
    }

    return true;
};
