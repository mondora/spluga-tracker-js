import axios from "axios";
import oauth from "axios-oauth-client";

const TOLLERANCE = 0.2;

export const createToken = async (options, logger) => {
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
        const token = {
            access_token: auth.access_token,
            created: new Date().getTime(),
            expires: auth.expires_in,
            async getToken() {
                const now = new Date().getTime();
                if ((now - this.created) / 1000 > this.expires - TOLLERANCE) {
                    logger("Spluga: refresh token");
                    const auth = await getClientCredentials();
                    this.access_token = auth.access_token;
                    (this.created = new Date().getTime()), (this.expires = auth.expires_in);
                }
                return this.access_token;
            }
        };
        return token;
    } catch (error) {
        if (options && options.raiseError) {
            throw error;
        }
    }
};
