import { isHt5075, isHt5101, isValidPeripheral} from "./validation";


describe("validate peripheral", () => {

    const validationMatrix: {
        deviceModel: string,
        mfgData: string,
        address: string,
    }[] = [
        { deviceModel: "h5075", mfgData: "88ec0002ccd65800", address: "" },
        { deviceModel: "h5075", mfgData: "88ec0002ff904000", address: "a4-c1-38-xx-xx-xx" },
        { deviceModel: "h5075", mfgData: "88ec000368d15800", address: "a4:c1:38:xx:xx:xx" },
        { deviceModel: "h5072", mfgData: "88ec000309295f00", address: "a4:c1:38:45:xx:xx" },
        { deviceModel: "h5102", mfgData: "0100010103165564", address: "a4:c1:38:e2:xx:xx" },
    ];
    test("validation tests should pass", () => {

        validationMatrix.forEach(x => {
            const peripheralMock: any = mockPeripheral(x.address, x.mfgData);
            const isValid = isValidPeripheral(peripheralMock);

            if(!isValid) { 
                console.error(`${x.deviceModel} VALIDATION FAILED`);
            }

            expect(isValid).toBeTruthy();

            
        });

    });

});

describe("match fingerprint", () => {

    it("should pass as h5075", () => expect(isHt5075("88ec0002ef9c4400")).toBeTruthy());
    it("should pass as h5101", () => expect(isHt5101("0100010103165564")).toBeTruthy());

});

function mockPeripheral(address: string, mfgData: string) {
    return {
        address,
        advertisement: {
            manufacturerData: Buffer.from(mfgData, 'hex')
        }
    };
}

