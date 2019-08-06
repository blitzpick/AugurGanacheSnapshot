import tmp from "tmp";
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

    async getLatestSnapshot() {
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
}
