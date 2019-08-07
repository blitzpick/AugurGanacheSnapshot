import ZeroExHelper from "../lib/ZeroExHelper.js";
import GanacheHelper from "../lib/GanacheHelper.js";
import Delay from "../lib/Delay.js";

export default {
    execute
};

async function execute() {
    process.env.ETHEREUM_PRIVATE_KEY = "0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d";
    console.log(`Currently using private key: '${process.env.ETHEREUM_PRIVATE_KEY}'`);

    const zeroEx = ZeroExHelper.create();

    await zeroEx.getLatestSnapshot();

    const ganache = await GanacheHelper.start({db_path: zeroEx.snapshotPath});

    try {
        const TestFixture = require("../node_modules/augur/packages/augur-core/build/tests-integration/TestFixture.js").TestFixture;

        const fixture = await TestFixture.create();
        await fixture.approveCentralAuthority();
    } catch(err) {
        console.log(err);
    }
        finally {
        await Delay.wait(600000);
        await ganache.stop();
    }
}