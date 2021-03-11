"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./validation");
const validationMatrix_1 = require("./validationMatrix");
describe("match fingerprint", () => {
    it("should pass as h5074", () => {
        // h5074 and h5075 have similar signatures, ensure these models are differentiated correctly
        const h5074 = "88ec008b0436156402";
        expect(validation_1.isHt5074(h5074)).toBeTruthy();
        expect(validation_1.isHt5075(h5074)).toBeFalsy();
    });
    it("should pass as h5075", () => {
        // h5074 and h5075 have similar signatures, ensure these models are differentiated correctly
        const h5075 = "88ec0002ef9c4400";
        expect(validation_1.isHt5075(h5075)).toBeTruthy();
        expect(validation_1.isHt5074(h5075)).toBeFalsy();
    });
    it("should pass as h5101", () => expect(validation_1.isHt5101("0100010103165564")).toBeTruthy());
    it("should pass as h5179", () => expect(validation_1.isHt5179("0188ec0001012e09740e64")).toBeTruthy());
});
describe("validate peripheral", () => {
    test("validation tests should pass", () => {
        validationMatrix_1.validationMatrix.forEach((x) => {
            const peripheralMock = mockPeripheral(x.address, x.mfgData);
            const isValid = validation_1.isValidPeripheral(peripheralMock);
            if (!isValid) {
                console.error(`${x.deviceModel} VALIDATION FAILED`, x);
            }
            expect(isValid).toBeTruthy();
        });
    });
});
function mockPeripheral(address, mfgData) {
    return {
        address,
        advertisement: {
            manufacturerData: Buffer.from(mfgData, "hex"),
        },
    };
}
