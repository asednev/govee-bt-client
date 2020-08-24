import noble from '@abandonware/noble';

const h5075_uuid = "ec88";
const h5075_uuid_rev = "88ec"
const govee_bt_mac = "a4-c1-38";

let DEBUG = false;

const validPeripheral = (peripheral: noble.Peripheral) => {

    const { address, advertisement } = peripheral;

    if (!advertisement || !advertisement.manufacturerData) { return false; }
    if (address && !address.toLowerCase().startsWith(govee_bt_mac)) { return false; }

    const hex = advertisement.manufacturerData.toString('hex');
    if (!hex.includes(h5075_uuid_rev)) { return false; }

    return true;
}

const decodeValues = (streamUpdate: string) => {

    // TODO would be great to find a way to validate

    const encodedData = parseInt(streamUpdate.substring(6, 12), 16);
    const battery = parseInt(streamUpdate.substring(12, 14), 16);
    const tempInC = encodedData / 10000;
    const tempInF = (tempInC * 5 / 9) + 32;
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

    if (!validPeripheral(peripheral)) {
        if (DEBUG) { console.log('invalid peripheral, scan for another'); };
        // await startDiscovery();
        return;
    }

    const { localName, manufacturerData } = advertisement;

    const streamUpdate = manufacturerData.toString('hex');

    if (DEBUG) { console.log(`${id}: ${streamUpdate}`); }

    const decodedValues = decodeValues(streamUpdate);

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
