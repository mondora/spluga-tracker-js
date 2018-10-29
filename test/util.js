import { expect } from "chai";

import { checkMandatory, getLogger } from "../src/util";

describe("util", () => {
    describe("checkMandatory", () => {
        const obj = {
            a: 1,
            b: 2,
            c: 3
        };
        it("does not raise anything, if mandatory is empty", () => {
            checkMandatory(obj, []);
        });
        it("raises error, if field is missing", () => {
            try {
                checkMandatory(obj, ["a", "b", "c", "d"]);
            } catch (raisedError) {
                expect(raisedError.message).to.equal("ERROR: d is mandatory.");
            }
        });
        it("does not raise anything, if mandatories are satisfied", () => {
            checkMandatory(obj, ["a", "b"]);
        });
    });

    describe("getLogger", () => {
        it("get console.log if enabled", () => {
            expect(getLogger(true)).to.equal(console.log);
        });
        it("get empty function if else", () => {
            expect(getLogger(false)).to.not.equal(console.log);
        });
    });
});
