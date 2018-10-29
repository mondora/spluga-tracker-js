import { expect } from "chai";
import sinon from "sinon";

import splugaTrackerModule from "../src";

describe("splugaTracker", () => {
    const baseOption = {
        activityEndpoint: "1",
        clientId: "2",
        clientSecret: "3",
        player: "4",
        tokenEndpoint: "5",
        name: "sample"
    };
    after(() => {
        splugaTrackerModule.__ResetDependency__("axios");
        splugaTrackerModule.__ResetDependency__("createToken");
    });

    it("invokes getToken to get a fresh token", () => {
        const createTokenMock = sinon.spy();
        splugaTrackerModule.__Rewire__("createToken", createTokenMock);
        const splugaTracker = splugaTrackerModule.__GetDependency__("splugaTracker");
        splugaTracker(baseOption);
        expect(createTokenMock.callCount).to.equal(1);
        splugaTrackerModule.__ResetDependency__("createToken");
    });

    it("returns a functions able to post on spluga", async () => {
        const sampleToken = 1234;
        const postMock = sinon.spy();
        const axios = {
            post: async (a1, a2, a3) => {
                postMock(a1, a2, a3);
            }
        };
        splugaTrackerModule.__Rewire__("createToken", async () => {
            return {
                getToken: async () => {
                    return sampleToken;
                }
            };
        });
        splugaTrackerModule.__Rewire__("axios", axios);
        const splugaTracker = splugaTrackerModule.__GetDependency__("splugaTracker");
        const tracker = await splugaTracker(baseOption);
        await tracker(100, "sample");
        expect(postMock.callCount).to.equal(1);
        expect(postMock.firstCall.args[0]).to.equal(baseOption.activityEndpoint);
        expect(postMock.firstCall.args[1].name).to.equal(baseOption.name);
        expect(postMock.firstCall.args[1].player).to.equal(baseOption.player);
        expect(postMock.firstCall.args[1].description).to.equal("api created");
        expect(postMock.firstCall.args[1].goalActivities[0]._quantity).to.equal(100);
        expect(postMock.firstCall.args[1].goalActivities[0]._resource).to.equal("sample");
    });

    it("fails silently", async () => {
        const splugaTracker = splugaTrackerModule.__GetDependency__("splugaTracker");
        const tracker = await splugaTracker({ wrongOptions: 123 });
        await tracker();
    });
});
