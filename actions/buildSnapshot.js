import ZeroExHelper from "../lib/ZeroExHelper.js";
import GanacheHelper from "../lib/GanacheHelper.js";

export default {
    execute
};

async function execute() {
    const zeroEx = ZeroExHelper.create();

    await zeroEx.getLatestSnapshot();

    const ganache = await GanacheHelper.start({db_path: zeroEx.snapshotPath});
    try {
        const TestFixture =require("../node_modules/augur/packages/augur-core/build/tests-integration/TestFixture.js").TestFixture;

        const fixture = await TestFixture.create();
        await fixture.approveCentralAuthority();
    } finally {
        await ganache.stop();
    }
}