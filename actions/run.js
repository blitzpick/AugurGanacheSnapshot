import PrepAugur from "./prepAugur";
import BuildSnapshot from "./buildSnapshot";

export default {
    run
};

async function run() {
    await PrepAugur.execute();
    await BuildSnapshot.execute();
}