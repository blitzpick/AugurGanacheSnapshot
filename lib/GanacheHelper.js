import _ from "lodash";
import {
    Web3ProviderEngine,
    GanacheSubprovider,
    FakeGasEstimateSubprovider
} from "@0x/subproviders";

const DEFAULT_OPTIONS = {
    mnemonic: "concert load couple harbor equip island argue ramp clarify fence smart topic",
    port: 8545,
    networkId: 50,
    default_balance_ether: 10000,
    gasPrice: 1,
    gasLimit: "0x1fffffffffffff",
    networkId: 50,
    network_id: 50,
    allowUnlimitedContractSize: true,
    logger: console
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

        const ganacheSubprovider = new GanacheSubprovider(this.options);

        this.providerEngine = new Web3ProviderEngine();
        this.providerEngine.addProvider(new FakeGasEstimateSubprovider(5 * (10 ** 6)));
        this.providerEngine.addProvider(ganacheSubprovider);

        console.log("Starting ganache with options...", this.options);
        return this.providerEngine.start();
    }

    stop () {
        console.log("Stopping ganache...");
        return this.providerEngine.stop();
    }
}
