import ZeroExHelper from "../lib/ZeroExHelper.js";

export default {
    execute
};

async function execute() {
    const zeroEx = ZeroExHelper.create();

    await zeroEx.getLatestSnapshot();

    console.log(zeroEx.snapshotPath);
}