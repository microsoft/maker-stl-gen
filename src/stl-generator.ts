import { argv0 } from "process";
import { Base, Lid } from "./part"
import { save_stl } from "./stl-util";

const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command("rectangular", "generate a recatgualr holder", {
                length: {
                    alias: "l",
                    nargs: 1,
                    describe: "Length of the board",
                    demandOption: "The the length of the board is required",
                    type: "number"
                },
                width: {
                    alias: "w",
                    nargs: 1,
                    describe: "Width of the board",
                    demandOption: "The the width of the board is required",
                    type: "number"
                },
                depth: {
                    alias: "d",
                    nargs: 1,
                    describe: "Depth of the board",
                    demandOption: "The the depth of the board is required",
                    type: "number"

                },
                screwpins: {
                    alias: "s",
                    default: true,
                    type: "boolean"
                },
                lid: {
                    alias: "i",
                    default: false,
                    type: "boolean"
                }
            })
    .example("$0 rectangular -l 69 -w 47 -d 5",
            "create new rectangular holder")
    .help('h')
    .alias('h', 'help').argv;

console.log(argv)
if (argv.lid){
    let lid = new Lid([argv.length,argv.width,argv.depth]);
    let shape = lid.generate()
    save_stl(shape, "./output", "new_lid");
}
let base = new Base([argv.length,argv.width,argv.depth]);
let shape = base.generate()

save_stl(shape, "./output", "new_holder");