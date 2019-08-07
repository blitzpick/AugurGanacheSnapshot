import _ from "lodash";
import fs from "fs";
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

    buildAugurCoreSource() {
        console.log("Building Augur Core source...");
        const args = [
            "workspace",
            "@augurproject/core",
            "build:source"
        ];

        return spawn.spawn("yarn", args, this.options.spawn);
    }
}
