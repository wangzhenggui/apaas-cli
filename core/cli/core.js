'use strict';
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const arg = hideBin(process.argv);
const cli = yargs(arg);
cli
    .options({
        info: {
            defaultDescription: "info",
            describe: "日志打印级别",
            type: "string",
            alias: "i"
        }
    })
    .usage("Usage: $0 <command> [options]")
    .recommendCommands()
    .demandCommand(1, "A command is required. Pass --help to see all available commands and options.")
    .strict()
    .alias("h", "help")
    .alias("v", "version")
    .wrap(cli.terminalWidth())
    .epilogue('欢迎大家使用')
    .argv