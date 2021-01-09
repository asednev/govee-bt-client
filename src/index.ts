import noble from '@abandonware/noble';
import { isHt5075, isHt5101, isValidPeripheral } from './validation';

process.env.NOBLE_REPORT_ALL_HCI_EVENTS = '1'; // needed on Linux including Raspberry Pi

const h5075_uuid = "ec88";
const h5101_uuid = "0001";

let DEBUG = false;

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

    await noble.startScanningAsync([h5075_uuid, h5101_uuid], true);

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
