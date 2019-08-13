import _ from "lodash";
import root from "root-path"
import spawn from "./spawn.js"

const DEFAULT_OPTIONS = {
    spawn: {
        cwd: root("node_modules/augur")
    }
}

export default class AugurHelper {
    static create = async (options) => {
        if (AugurHelper.instance) {
            console.log(AugurHelper.instance);
            throw new Error("AugurHelper instance is already started!");
        }

        AugurHelper.instance = new AugurHelper();

        await AugurHelper.instance._init(options);

        return AugurHelper.instance;
    }

    async _init(options) {
        this.options = _.defaults({}, options, DEFAULT_OPTIONS);

        await this._installAugurYarnDependencies();
        await this._installAugurCoreYarnDependencies();
    }

    _installAugurYarnDependencies() {
        console.log("Ensuring Augur dependencies...");
        const args = [];


        return spawn.spawn("yarn", args, this.options.spawn);
    }

    _installAugurCoreYarnDependencies() {
        console.log("Ensuring Augur-Core dependencies...");
        const args = [];

        return spawn.spawn("yarn", args, {
            cwd: root("node_modules/augur/packages/augur-core")
        });
    }

    async buildAugurCoreSource() {
        console.log("Building Augur source...");
        const args = [
            "build"
        ];

        try {
            await spawn.spawn("yarn", args, this.options.spawn);
        } catch (err) {
            console.log(err);
        }
    }
}
