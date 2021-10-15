import { Base } from "./part"
import { save_stl } from "./stl-util";

const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command("rectangular", "generate a recatgualr holder")
    .example("$0 rectangular -l 69 -w 47 -d 5",
            "create new rectangular holder")
        .option("l", {
            alias: "length",
            nargs: 1,
            describe: "Length of the board",
            demandOption: "The the length of the board is required",
            type: 'number'
        })
        .option("w", {
            alias: "width",
            nargs: 1,
            describe: "Width of the board",
            demandOption: "The the width of the board is required",
            type: 'number'
        })
        .option("d", {
            alias: "depth",
            nargs: 1,
            describe: "Depth of the board",
            demandOption: "The the depth of the board is required",
            type: 'number'
        })
        .option("s", {
            alias: "screwpins",
            default:true,
            type: 'boolean'
        })

    .help('h')
    .alias('h', 'help').argv;

let base = new Base([argv.length,argv.width,argv.depth]);
let shape = base.generate()

save_stl(shape, "./output", "new_holder");