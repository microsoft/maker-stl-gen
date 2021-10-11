import * as fs from 'fs'
import * as path from 'path'
import { Geom3 } from "@jscad/modeling/src/geometries/types";
const stlSerializer = require('@jscad/stl-serializer')

/**
 * Save a 3D geometery as an STL
 * @param {Geom3} shape The 3D geometery to save as an STL
 * @param {string} outDir The directory to save the file to
 * @param {string} outFile The name of the file
 */
export function save_stl(shape: Geom3, outDir: string, outFile: string)
{
    const rawData:[] = stlSerializer.serialize({binary: false}, shape)

    fs.mkdirSync(outDir, {recursive: true});

    rawData.forEach(element => {
        fs.writeFileSync(path.join(outDir, outFile + '.stl'), element, 'utf-8')
    });
}