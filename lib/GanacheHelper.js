import _ from "lodash";
import ganache from "ganache-core";

const DEFAULT_OPTIONS = {
    mnemonic: "concert load couple harbor equip island argue ramp clarify fence smart topic",
    verbose: true,
    port: 8545,
    hostname: "127.0.0.1",
    default_balance_ether: 10000,
    gasPrice: 1,
    gasLimit: "0x1fffffffffffff",
    networkId: 50,
    network_id: 50,
    allowUnlimitedContractSize: true,
    logger: console,
}

export default class GanacheHelper {
    static start = async (options) => {
        if (GanacheHelper.instance) {
            throw new Error("GanacheHelper instance is already started!");
        }

        GanacheHelper.instance = new GanacheHelper();

        await GanacheHelper.instance._start(options);

        return GanacheHelper.instance;
    }

    async _start(options) {

        this.options = _.defaults({}, options, DEFAULT_OPTIONS);

        console.log("Starting ganache with options:", this.options);

        this.server = server = ganache.server(this.options);

        return new Promise(resolve => server.listen(this.options.port, this.options.hostname, (err, index) => {
            if (err) {
                return reject(err);
            }

            resolve(index)
        }));
    }

    stop () {
        console.log("Stopping ganache...");
        return new Promise((_resolve, reject) => server.close(reject));
    }
}
