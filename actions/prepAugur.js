import AugurHelper from "../lib/AugurHelper.js";

export default {
    execute
};

async function execute() {
    const augur = await AugurHelper.create();
    await augur.buildAugurCoreSource();
}