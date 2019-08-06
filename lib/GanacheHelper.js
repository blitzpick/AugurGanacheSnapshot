import _ from "lodash";
import {
    Web3ProviderEngine,
    GanacheSubprovider,
    FakeGasEstimateSubprovider
} from "@0x/subproviders";

const DEFAULT_OPTIONS = {
    mnemonic: "concert load couple harbor equip island argue ramp clarify fence smart topic",
    networkId: 50,
    gasLimit: "0x6691b70",
    networkId: 50,
    network_id: 50
}

export default class GanacheHelper {
    static start = async (options) => {
        if (GanacheHelper.instance) {
            throw new Error("GanacheHelper instance is already started!");
        }

        GanacheHelper.instance = new GanacheHelper();

        await instance._start(options);

        return instance;
    }

    async _start(options) {

        const ganacheOptions = _.defaults({}, options, DEFAULT_OPTIONS);

        const ganacheSubprovider = new GanacheSubprovider(ganacheOptions);

        this.providerEngine = new Web3ProviderEngine();
        this.providerEngine.addProvider(new FakeGasEstimateSubprovider(5 * (10 ** 6)));
        this.providerEngine.addProvider(revertTraceSubprovider);
        this.providerEngine.addProvider(ganacheSubprovider);

        await this.providerEngine.start();
    }

    static async shutdown () {
        return this.providerEngine.stop();
    }
}
