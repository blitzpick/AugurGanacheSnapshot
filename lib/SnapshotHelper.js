import _ from "lodash";
import download from "download";
import fs from "fs-extra"
import path from "path";
import root from "root-path";
import tmp from "tmp";
import spawn from "./spawn";

const DEFAULT_OPTIONS = {
    spawn: {
        cwd: root()
    }
}

export default class SnapshotHelper {
    static create = (options) => {
        if (SnapshotHelper.instance) {
            console.log(SnapshotHelper.instance);
            throw new Error("SnapshotHelper instance is already started!");
        }

        SnapshotHelper.instance = new SnapshotHelper();

        SnapshotHelper.instance._init(options);

        return SnapshotHelper.instance;
    }

    _init(options) {
        this.options = _.defaults({}, options, DEFAULT_OPTIONS);
    }

    async getLatestZeroExGanacheSnapshot() {
        tmp.setGracefulCleanup();

        this.tmpPath = tmp.dirSync({
            unsafeCleanup: true
        }).name;

        const zeroExSnapshotPath = path.join(this.tmpPath, "0x_ganache_snapshot");
        this.snapshotPath = path.join(this.tmpPath, "0x-augur-ganache-snapshot");
        try {
            console.log("Downloading latest ganache snapshot...");
            await download("http://ganache-snapshots.0x.org.s3.amazonaws.com/0x_ganache_snapshot-latest.zip", this.tmpPath, {extract:true});
            fs.renameSync(zeroExSnapshotPath, this.snapshotPath);
            console.log("Download complete!");
            console.log(`Ganache snapshot now available at '${this.snapshotPath}.`);
        } catch (err) {
            this.tmpPath = undefined;
            this.snapshotPath = undefined;
            throw err;
        }
    }

    async createAugurZeroExGanacheSnapshot() {
        console.log("Creating new AugurZeroEx ganache snapshot...");

        fs.removeSync(root("0x-augur-ganache-snapshot.zip"));

        const args = [
            "-rm9T",
             root("0x-augur-ganache-snapshot.zip"),
             this.snapshotPath
        ];

        try {
            await spawn.spawn("zip", args, this.options.spawn);
        } catch (err) {
            console.log(err);
        }
    }
}
