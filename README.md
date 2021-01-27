# Govee H5xxx Bluetooth Client
[![npm version](https://badge.fury.io/js/govee-bt-client.svg)](https://badge.fury.io/js/govee-bt-client)

A library to listen for the BLE (Bluetooth Low Energy) broadcasts from Govee Thermometer Hygrometer devices. Requires a compatible bluetooth module and operating system (see [prepequisites](https://github.com/abandonware/noble#prerequisites)).

Supported devices: 
- H5072
- H5074
- H5075
- H5101
- H5102
## Installation

`npm install govee-bt-client`

## API

* `startDiscovery: (callback: (reading: GoveeReading) => void)` 
    * Starts listening to broadcasts and pass decrypted data into the callback function.
* `stopDiscovery()`
    * Stops listening to broadcasts from Bluetooth 
* `debug: (on: boolean)`
    *  Function to enable debugging of bluetooth advertisements and peripherals.

## Example

```
import { startDiscovery, stopDiscovery, debug } from "./index";

debug(true);

console.log("=== start discovery");

startDiscovery((reading) => {
    console.log(reading);
});

setTimeout(async () => {
    await stopDiscovery();
    console.log("=== stop discovery");
}, 30000);
```

## Credits
Credits and thanks to

* [Thrilleratplay/GoveeWatcher](https://github.com/Thrilleratplay/GoveeWatcher) for explanation and examples of how to decode advertisement data for Govee H5075.
* [Home-Is-Where-You-Hang-Your-Hack/sensor.goveetemp_bt_hci](https://github.com/Home-Is-Where-You-Hang-Your-Hack/sensor.goveetemp_bt_hci) for explanation and examples of advertisement data for various Govee devices.
* [@abandonware/noble](https://github.com/abandonware/noble) for a great BLE library for node
