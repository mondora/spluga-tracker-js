import axios from "axios";
import { checkMandatory, getLogger } from "./util";
import createToken from "./token";

const MANDATORY = ["activityEndpoint", "clientId", "clientSecret", "player", "tokenEndpoint"];

const splugaTracker = async (options = {}) => {
    const logger = getLogger(options.verbose);
    try {
        checkMandatory(options, MANDATORY);
        const token = await createToken(options, logger);
        return async (quantity, resource) => {
            try {
                const config = {
                    headers: { Authorization: `bearer ${await token.getToken()}` }
                };
                logger(`Spluga: tracking ${resource}:${quantity}`);
                return await axios.post(
                    options.activityEndpoint,
                    {
                        name: options.name || "Api Integrations",
                        player: options.player,
                        description: "api created",
                        goalActivities: [
                            {
                                _quantity: quantity,
                                _receiver: "PLAYER",
                                _resource: resource,
                                activityDate: new Date()
                            }
                        ]
                    },
                    config
                );
            } catch (error) {
                logger("Spluga: error tracking data");
                if (options && options.raiseError) {
                    throw error;
                }
                return error;
            }
        };
    } catch (error) {
        logger("Spluga: error creating instance");
        if (options && options.raiseError) {
            throw error;
        } else {
            return () => {
                logger("Spluga: error creating instance - reboot");
            };
        }
    }
};

export default splugaTracker;
