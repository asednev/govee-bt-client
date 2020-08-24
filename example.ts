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