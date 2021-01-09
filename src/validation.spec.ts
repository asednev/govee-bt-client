import { isHt5075, isHt5101, isValidPeripheral } from "./validation";
import { validationMatrix } from "./validationMatrix";

describe("validate peripheral", () => {
    test("validation tests should pass", () => {
        validationMatrix.forEach((x) => {
            const peripheralMock: any = mockPeripheral(x.address, x.mfgData);
            const isValid = isValidPeripheral(peripheralMock);

            if (!isValid) {
                console.error(`${x.deviceModel} VALIDATION FAILED`);
            }

            expect(isValid).toBeTruthy();
        });
    });
});

describe("match fingerprint", () => {
    it("should pass as h5075", () =>
        expect(isHt5075("88ec0002ef9c4400")).toBeTruthy());
    it("should pass as h5101", () =>
        expect(isHt5101("0100010103165564")).toBeTruthy());
});

function mockPeripheral(address: string, mfgData: string) {
    return {
        address,
        advertisement: {
            manufacturerData: Buffer.from(mfgData, "hex"),
        },
    };
}
