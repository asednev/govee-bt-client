import noble from '@abandonware/noble';
process.env.NOBLE_REPORT_ALL_HCI_EVENTS = '1'; // needed on Linux including Raspberry Pi

const h5075_uuid = "ec88";
const h5075_uuid_rev = "88ec";
const h5101_uuid_rev = "0100"; 

const govee_bt_mac = "a4-c1-38";
const govee_bt_mac_alt = "a4:c1:38";

let DEBUG = false;


const isHt5075 = (hex: string) => hex.includes(h5075_uuid_rev); // Govee H5072/H5075
const isHt5101 = (hex: string) => hex.includes(h5101_uuid_rev); // Govee H5101/H5102

const isValidPeripheral = (peripheral: noble.Peripheral) => {

    const { address, advertisement } = peripheral;

    if (!advertisement || !advertisement.manufacturerData) { return false; }
    if (address && (!address.toLowerCase().startsWith(govee_bt_mac) && !address.toLowerCase().startsWith(govee_bt_mac_alt))) { return false; }

    const hex = advertisement.manufacturerData.toString('hex');
    if (!isHt5075(hex) && !isHt5101(hex)) { return false; }

    return true;
}

const decodeH5075Values = (streamUpdate: string) => {

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
}

const decodeH5101Values = (streamUpdate: string) => {

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
}

let currentCallback: undefined | ((reading: GoveeReading) => void);

noble.on('discover', async (peripheral) => {

    const { id, uuid, address, state, rssi, advertisement } = peripheral;
    if (DEBUG) { console.log('discovered', id, uuid, address, state, rssi); }

    if (!isValidPeripheral(peripheral)) {
        if (DEBUG) { console.log('invalid peripheral, scan for another'); };
        return;
    }

    const { localName, manufacturerData } = advertisement;

    const streamUpdate = manufacturerData.toString('hex');

    if (DEBUG) { console.log(`${id}: ${streamUpdate}`); }

    const decodedValues = isHt5075(streamUpdate) ? decodeH5075Values(streamUpdate) : decodeH5101Values(streamUpdate);

    const current: GoveeReading = {
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
    };

});

export const debug = (on: boolean) => { DEBUG = on;}

export const startDiscovery = async (callback: (reading: GoveeReading) => void) => {

    currentCallback = callback;

    await noble.startScanningAsync([h5075_uuid], true);

}

export const stopDiscovery = async () => {

    await noble.stopScanningAsync();

    currentCallback = undefined;
}


export type GoveeReading = {
    uuid: string,
    address: string,
    model: string
    tempInC: number,
    tempInF: number,
    humidity: number,
    battery: number,
    rssi: number
};
