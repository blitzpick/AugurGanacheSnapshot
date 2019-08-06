import _ from "lodash";
import root from "root-path"
import spawn from "./spawn.js"

const DEFAULT_OPTIONS = {
    spawn: {
        cwd: root("node_modules/augur"),
        env: {
            KOVAN_PRIVATE_KEY: "0xa003e511ec9e1cf17d96091a25a106703450ba0be79315ccc9ede99961c62c99"
        }
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

        await this._installYarnDependencies();
    }

    _installYarnDependencies() {
        console.log("Ensuring Augur dependencies...");
        const args = [];


        return spawn.spawn("yarn", args, {
            cwd: root("node_modules/augur")
        });
    }

    runIntegrationTests() {
        console.log("Running integration tests...");
        const args = [
            "workspace",
            "@augurproject/core",
            "build"
        ];


        return spawn.spawn("yarn", args, this.options.spawn);
    }
}
