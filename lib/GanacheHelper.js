import _ from "lodash";
import ganache from "ganache-core";

const DEFAULT_OPTIONS = {
    mnemonic: "concert load couple harbor equip island argue ramp clarify fence smart topic",
    verbose: false,
    port: 8545,
    blockTime: 1,
    hostname: "127.0.0.1",
    default_balance_ether: 10000,
    gasLimit: "0x1fffffffffffff",
    networkId: 50,
    network_id: 50,
    allowUnlimitedContractSize: true,
    logger: undefined
    // logger: console
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

        this.server = ganache.server(this.options);

        return new Promise(resolve => this.server.listen(this.options.port, this.options.hostname, (err, index) => {
            if (err) {
                return reject(err);
            }

            this.isRunning = true;
            resolve(index)
        }));
    }

    stop () {
        if (!this.isRunning) {
            return;
        }

        console.log("Stopping ganache...");
        return new Promise(async (resolve, reject) => {
            await this.server.close((err) => {
                this.isRunning = false;

                if (err) {
                    return reject(err);
                }

                resolve();
            }
            );
        });
    }
}
