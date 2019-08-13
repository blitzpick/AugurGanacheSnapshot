import fs from "fs-extra";
import root from "root-path";
import SnapshotHelper from "../lib/SnapshotHelper.js";
import GanacheHelper from "../lib/GanacheHelper.js";

export default {
    execute
};

async function execute() {
    process.env.ETHEREUM_PRIVATE_KEY = "0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d";
    console.log(`Currently using private key: '${process.env.ETHEREUM_PRIVATE_KEY}'`);

    const snapshot = SnapshotHelper.create();

    await snapshot.getLatestZeroExGanacheSnapshot();

    const ganache = await GanacheHelper.start({db_path: snapshot.snapshotPath});

    try {
        const TestFixture = require("../node_modules/augur/packages/augur-core/build/tests-integration/TestFixture.js").TestFixture;

        // for this to properly work, augur-core/src/ContractDeployer.ts needs to be changed to
        /*

          private async uploadAllContracts(): Promise<void> {
            console.log('Uploading contracts...');
            for (let contract of this.contracts) {
            await this.upload(contract);
            }
          }

         */
        const fixture = await TestFixture.create();
        await fixture.approveCentralAuthority();

        await ganache.stop();

        await snapshot.createAugurZeroExGanacheSnapshot();

        fs.copySync(root("node_modules/augur/packages/augur-core/output/contracts"), root("artifacts"), {overwrite: true})

    } catch(err) {
        console.log(err);
    }
        finally {
        await ganache.stop();
    }
}