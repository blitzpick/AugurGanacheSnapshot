import fs from "fs-extra";
import root from "root-path";
import SnapshotHelper from "../lib/SnapshotHelper.js";
import GanacheHelper from "../lib/GanacheHelper.js";

export default {
    execute,
    _patchContractDeployer
};

async function execute() {
    process.env.ETHEREUM_PRIVATE_KEY = "0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d";
    console.log(`Currently using private key: '${process.env.ETHEREUM_PRIVATE_KEY}'`);

    const snapshot = SnapshotHelper.create();

    await snapshot.getLatestZeroExGanacheSnapshot();

    const ganache = await GanacheHelper.start({db_path: snapshot.snapshotPath});

    try {
        this._patchContractDeployer();

        const TestFixture = require("../node_modules/augur/packages/augur-core/build/tests-integration/TestFixture.js").TestFixture;
        const fixture = await TestFixture.create();
        await fixture.approveCentralAuthority();

        await ganache.stop();

        fs.copySync(root("node_modules/augur/packages/augur-core/output/contracts"), root("artifacts"), {overwrite: true})

        await snapshot.createAugurZeroExGanacheSnapshot();

    } catch(err) {
        console.log(err);
    }
        finally {
        await ganache.stop();
    }
}



function _patchContractDeployer() {
    // for this to properly work, augur-core/src/ContractDeployer.ts needs to be changed to
    /*

        private async uploadAllContracts(): Promise<void> {
        console.log('Uploading contracts...');
        for (let contract of this.contracts) {
        await this.upload(contract);
        }
        }

        */
    var __awaiter = function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __values = (this && this.__values) || function (o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    };

    console.log(`Patching ContractDeployer...`);

    const ContractDeployer = require("../node_modules/augur/packages/augur-core/build/libraries/ContractDeployer.js").ContractDeployer;

    ContractDeployer.prototype.uploadAllContracts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, _a, _b, _c, contract, e_2_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log('Uploading contracts...');
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _b = __values(this.contracts), _c = _b.next();
                        _d.label = 2;
                    case 2:
                        if (!!_c.done) return [3 /*break*/, 5];
                        contract = _c.value;
                        return [4 /*yield*/, this.upload(contract)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _c = _b.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
}

