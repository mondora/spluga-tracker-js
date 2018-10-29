import axios from "axios";
import oauth from "axios-oauth-client";

const TOLLERANCE = 0.2;

const createToken = async (options, logger) => {
    try {
        const getClientCredentials = oauth.client(axios.create(), {
            url: options.tokenEndpoint,
            grant_type: "client_credentials",
            client_id: options.clientId,
            client_secret: options.clientSecret,
            scope: "api"
        });

        logger("Spluga: get token");
        const auth = await getClientCredentials();
        return {
            access_token: auth.access_token,
            created: new Date().getTime(),
            expires: auth.expires_in,
            async getToken() {
                const now = new Date().getTime();
                if ((now - this.created) / 1000 > this.expires - TOLLERANCE) {
                    logger("Spluga: refresh token");
                    const newToken = await getClientCredentials();
                    this.access_token = newToken.access_token;
                    this.created = new Date().getTime();
                    this.expires = newToken.expires_in;
                }
                return this.access_token;
            }
        };
    } catch (error) {
        if (options && options.raiseError) {
            throw error;
        }
        return error;
    }
};

export default createToken;
