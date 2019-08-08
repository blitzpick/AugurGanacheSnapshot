import tmp from "tmp";
import fs from "fs"
import path from "path";
import download from "download";

export default class ZeroExHelper {
    static create = (options) => {
        if (ZeroExHelper.instance) {
            console.log(ZeroExHelper.instance);
            throw new Error("ZeroExHelper instance is already started!");
        }

        ZeroExHelper.instance = new ZeroExHelper();

        ZeroExHelper.instance._init(options);

        return ZeroExHelper.instance;
    }

    _init(options) {

        this.options = options;
    }

    async getLatestZeroExGanacheSnapshot() {
        tmp.setGracefulCleanup();

        this.tmpPath = tmp.dirSync({
            unsafeCleanup: true
        }).name;

        this.snapshotPath = path.join(this.tmpPath, "0x_ganache_snapshot");
        try {
            console.log("Downloading latest ganache snapshot...");
            await download("http://ganache-snapshots.0x.org.s3.amazonaws.com/0x_ganache_snapshot-latest.zip", this.tmpPath, {extract:true});
            console.log("Download complete!");
            console.log(`Ganache snapshot now available at '${this.snapshotPath}.`);
        } catch (err) {
            this.tmpPath = undefined;
            this.snapshotPath = undefined;
            throw err;
        }
    }

    async getLatestZeroExGanacheSnapshot() {
        tmp.setGracefulCleanup();

        this.tmpPath = tmp.dirSync({
            unsafeCleanup: true
        }).name;

        const zeroExSnapshotPath = path.join(this.tmpPath, "0x_ganache_snapshot");
        this.snapshotPath = path.join(this.tmpPath, "augur_0x_ganache_snapshot");
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
        const args = [
            "-rm",
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
