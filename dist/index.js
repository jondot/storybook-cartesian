#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const lodash_1 = __importDefault(require("lodash"));
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const yargs_parser_1 = __importDefault(require("yargs-parser"));
const help = `Please specify a package to add.

$ hygen-add PACKAGE [--name NAME] [--prefix PREFIX] 

  PACKAGE: npm module or Git repository
           - note: for an npm module named 'hygen-react', PACKAGE is 'react'
   --name: package name for a Git repo when cannot infer from repo URL (optional)
 --prefix: prefix added generators, avoids clashing names (optional)
`;
const tmpl = x => path_1.default.join('_templates', x);
const resolvePackage = (pkg, opts) => {
    if (pkg.match(/^http/)) {
        if (opts.name) {
            return { name: opts.name, isUrl: true };
        }
        return { name: lodash_1.default.last(url_1.default.parse(pkg).path.split('/')), isUrl: true };
    }
    return { name: `hygen-${pkg}`, isUrl: false };
};
const main = () => __awaiter(this, void 0, void 0, function* () {
    const { red, green, yellow } = chalk_1.default;
    const args = yargs_parser_1.default(process.argv.slice(2));
    const [pkg] = args._;
    if (!pkg) {
        console.log(help);
        process.exit(1);
    }
    const { name, isUrl } = resolvePackage(pkg, args);
    const spinner = ora_1.default(`Adding: ${name}`).start();
    try {
        yield execa_1.default.shell(`${path_1.default.join(__dirname, '../node_modules/.bin/')}yarn add --dev ${isUrl ? pkg : name}`);
        const templatePath = path_1.default.join('./node_modules', name, '_templates');
        const exists = yield fs_extra_1.default.pathExists(templatePath);
        yield fs_extra_1.default.mkdirp('_templates');
        spinner.stop();
        for (const g of yield fs_extra_1.default.readdir(templatePath)) {
            const maybePrefixed = args.prefix ? `${args.prefix}-${g}` : g;
            const wantedTargetPath = tmpl(maybePrefixed);
            const sourcePath = path_1.default.join(templatePath, g);
            if (yield fs_extra_1.default.pathExists(wantedTargetPath)) {
                if (!(yield inquirer_1.default
                    .prompt([
                    {
                        message: `'${maybePrefixed}' already exists. Overwrite? (Y/n): `,
                        name: 'overwrite',
                        prefix: '      🤔 :',
                        type: 'confirm'
                    }
                ])
                    .then(({ overwrite }) => overwrite))) {
                    console.log(yellow(` skipped: ${maybePrefixed}`));
                    continue;
                }
            }
            yield fs_extra_1.default.copy(sourcePath, wantedTargetPath, {
                recursive: true
            });
            console.log(green(`   added: ${maybePrefixed}`));
        }
    }
    catch (ex) {
        console.log(red(`\n\nCan't add ${name}${isUrl ? ` (source: ${pkg})` : ''}\n\n`), ex);
    }
});
main();
//# sourceMappingURL=index.js.map