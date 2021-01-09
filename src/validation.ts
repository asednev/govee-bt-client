import noble from '@abandonware/noble';

const govee_bt_mac = "a4-c1-38";
const govee_bt_mac_alt = "a4:c1:38";

const h5075_uuid_rev = "88ec";
const h5101_uuid_rev = "0100"; 

export const isHt5075 = (hex: string) => hex.includes(h5075_uuid_rev); // Govee H5072/H5075
export const isHt5101 = (hex: string) => hex.includes(h5101_uuid_rev); // Govee H5101/H5102
export const isValidPeripheral = (peripheral: noble.Peripheral) => {

    const { address, advertisement } = peripheral;

    if (!advertisement || !advertisement.manufacturerData) { return false; }
    if (address && (!address.toLowerCase().startsWith(govee_bt_mac) && !address.toLowerCase().startsWith(govee_bt_mac_alt))) { return false; }

    const hex = advertisement.manufacturerData.toString('hex');

    if (!isHt5075(hex) && !isHt5101(hex)) { return false; }

    return true;
}