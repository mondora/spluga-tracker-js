import { expect } from "chai";
import sinon from "sinon";

import createTokenModule from "../src/token";

describe("createToken", () => {
    after(() => {
        createTokenModule.__ResetDependency__("axios");
        createTokenModule.__ResetDependency__("oauth");
    });

    it("invokes getClientCredentials to get a oauth token", () => {
        const getClientCredentialsMock = sinon.spy();
        const axios = {
            create: sinon.spy()
        };
        const oauth = {
            client: () => {
                getClientCredentialsMock();
                return {};
            }
        };
        createTokenModule.__Rewire__("axios", axios);
        createTokenModule.__Rewire__("oauth", oauth);
        const ct = createTokenModule.__GetDependency__("createToken");
        ct({}, () => {});
        expect(axios.create.callCount).to.equal(1);
        expect(getClientCredentialsMock.callCount).to.equal(1);
    });

    it("creates a token object", async () => {
        const token = {
            access_token: "test",
            expires_in: "1"
        };
        const axios = {
            create: sinon.spy()
        };
        const oauth = {
            client: () => {
                return async () => token;
            }
        };
        createTokenModule.__Rewire__("axios", axios);
        createTokenModule.__Rewire__("oauth", oauth);
        const ct = createTokenModule.__GetDependency__("createToken");
        const received = await ct({}, () => {});
        expect(received.access_token).to.equal(token.access_token);
        expect(received.expires).to.equal(token.expires_in);
        expect(await received.getToken()).to.equal(token.access_token);
    });

    it("refreshes the token if too old", async () => {
        const getClientCredentialsMock = sinon.spy();
        const token = {
            access_token: "test",
            expires_in: "0.0001"
        };
        const axios = {
            create: sinon.spy()
        };
        const oauth = {
            client: () => {
                return async () => {
                    getClientCredentialsMock();
                    return token;
                };
            }
        };
        createTokenModule.__Rewire__("axios", axios);
        createTokenModule.__Rewire__("oauth", oauth);
        const ct = createTokenModule.__GetDependency__("createToken");
        const received = await ct({}, () => {});
        expect(received.access_token).to.equal(token.access_token);
        expect(received.expires).to.equal(token.expires_in);
        expect(await received.getToken()).to.equal(token.access_token);
        expect(getClientCredentialsMock.callCount).to.equal(2);
    });
});
