import { Base } from "./part"
import { save_stl } from "./stl-util";

const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command("rectangular", "generate a recatgualr holder")
    .example("$0 rectangular -l 69 -w 47 -h 5",
            "create new rectangular holder")
        .option("l", {
            alias: "length",
            nargs: 1,
            describe: "length of the board",
            demandOption: "required",
            type: 'number'
        })
        .option("w", {
            alias: "width",
            nargs: 1,
            describe: "width of the board",
            demandOption: 'required',
            type: 'number'
        })
        .option("t", {
            alias: "height",
            nargs: 1,
            describe: "height of the board",
            demandOption: "required",
            type: 'number'
        })
        .option("s", {
            alias: "screwpins",
            default:true,
            type: 'boolean'
        })

    .help('h')
    .alias('h', 'help').argv;

let base = new Base([argv.length,argv.width,argv.height]);
let shape = base.generate()

save_stl(shape, "./output", "new_holder");