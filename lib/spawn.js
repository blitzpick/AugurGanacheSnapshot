import _ from "lodash";
import cp from "child_process";

const runningProcesses = [];

export default {
    spawn,
    continueAfterOutput
};

function spawn(cmd, args, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedArgs = _.compact(_.split(args.join(" "), /\s/));
        const child = cp.spawn(cmd, parsedArgs, {
            stdio: "inherit",
            ...options,
            env: {
                ...process.env,
                ...options.env
            }
        });

        runningProcesses.push(child);

        child.on("error", reject);

        child.on("exit", (code) => {
            if (code === 0) {
                resolve();
            } else {
                const err = new Error(`child exited with code ${code}`);
                err.code = code;
                reject(err);
            }
        });
    });
}

function continueAfterOutput(doneText, cmd, args, options = {}) {
    return new Promise((resolve, _reject) => {
        const child = cp.exec(`${cmd} ${args.join(" ")}`, {
            ...options,
            env: {
                ...process.env,
                ...options.env
            }
        });
        let childout;
        let childerr = "";

        child.stdout.on("data", (data) => {
            console.info(data); // eslint-disable-line no-console
            childout += data;
            if (childout.includes(doneText)) {
                resolve(childout);
            }
        });
        child.stderr.on("data", (data) => {
            console.error(data); // eslint-disable-line no-console
            childerr += data;
            if (childerr.includes(doneText)) {
                resolve(childerr);
            }
        });
        child.on("close", (code) => {
            console.info(cmd, `closing code: ${code}`); // eslint-disable-line no-console
        });
        child.on("exit", (code) => {
            console.info(cmd, `exit code: ${code}`); // eslint-disable-line no-console
        });
        runningProcesses.push(child);
    });
}

async function closeAll() {
    runningProcesses.forEach(p => p.kill());

    return true;
}

process.on("SIGINT", closeAll); // catch ctrl-c
process.on("SIGTERM", closeAll); // catch kill
