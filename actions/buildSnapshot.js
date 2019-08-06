import ZeroExHelper from "../lib/ZeroExHelper.js";
import GanacheHelper from "../lib/GanacheHelper.js";
import AugurHelper from "../lib/AugurHelper.js";

export default {
    execute
};

async function execute() {
    const zeroEx = ZeroExHelper.create();

    await zeroEx.getLatestSnapshot();

    const ganache = await GanacheHelper.start({db_path: zeroEx.snapshotPath});

    console.log(zeroEx.snapshotPath);

    const augur = await AugurHelper.create();
    await augur.runIntegrationTests();
    await ganache.stop();
}