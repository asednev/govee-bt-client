"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
index_1.debug(true);
console.log("=== start discovery");
index_1.startDiscovery((reading) => {
    console.log(reading);
});
setTimeout(async () => {
    await index_1.stopDiscovery();
    console.log("===stop discovery");
}, 30000);
