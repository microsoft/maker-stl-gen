import Vec3 from "@jscad/modeling/src/maths/vec3/type";
import {cylinder, roundedCuboid } from "@jscad/modeling/src/primitives";
import { subtract as boolsubtract, union } from "@jscad/modeling/src/operations/booleans";
import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { add } from "@jscad/modeling/src/maths/vec3";


export abstract class Part{
    mySize: Vec3;
    wallThickness: number;
    center: Vec3 = [0,0,0];
    
    /**
     * @constructor
     * @param {Vec3} size The size of geometery to be generated
     */
    public constructor (size: Vec3){
        this.mySize = size;
        this.wallThickness = 1;
    }

    public abstract generate(): void;

    /**
     * Sets the center for the geometery to be generated
     */
    public setCenter(): void {
        let x = 0;
        let y = 0;
        let z = this.wallThickness;
        this.center = [x,y,z];
        
    }
}

export class Base extends Part{
    public constructor(mySize: [number, number, number]){
        super(mySize);
        this.setCenter();
    }

    /**
     * Generates all the compenents of the final geometry and joins them together
     * @returns {Geom3} The final 3D geometery
     */
    generate(): Geom3 {
        const base = boolsubtract(this.generate_base(), this.generate_walls());
        const finalShape = union(base, this.screwPin(4));
        return finalShape;
    }

    /**
     * Generate the base solid shape
     * @returns The base geometery
     */
    private generate_base(): Geom3 {
        let base = roundedCuboid({size: [this.mySize[0] + (2 * this.wallThickness),
                                         this.mySize[1] + (2 * this.wallThickness),
                                         this.mySize[2] + (this.wallThickness)],
                           center:this.center,
                           roundRadius: 1}
        )
        return base
    }

    /**
     * Generate the a cuboid the size of the internal space of the holder.
     * Calucualted by taking the size of the holder and substracting the wall thinkness.
     * @returns {Geom3} The intrior wall solid geometery
     */
    private generate_walls(): Geom3 {
        let adjustedCenter = this.center;
        add(adjustedCenter, this.center, [0,0,this.wallThickness]) 
        let walls = roundedCuboid(
            {size:[
                this.mySize[0],
                this.mySize[1],
                this.mySize[2]
            ], center:[0,0, (this.mySize[2]/2) + this.wallThickness],
            roundRadius: 1}
        )
        return walls
    }

    /**
     * Generate screw pins to add to the board holder geometery
     * @param {number} screws number of screw pins to generate
     * @returns {Geom3} The 3D geomenetry of the screw pins
     */
    private screwPin(screws: number): Geom3 {
        let screwPins:Geom3[] = new Array();
        let centers:Vec3[] = new Array();

        centers[0] = [this.mySize[0]/2+this.wallThickness,
                      this.mySize[1]/2+this.wallThickness,
                      this.wallThickness];
        centers[1] = [-this.mySize[0]/2-this.wallThickness,
                      -this.mySize[1]/2-this.wallThickness,
                      this.wallThickness];
        centers[2] = [-this.mySize[0]/2-this.wallThickness,
                      this.mySize[1]/2+this.wallThickness,
                      this.wallThickness];
        centers[3] = [this.mySize[0]/2+this.wallThickness,
                      -this.mySize[1]/2-this.wallThickness,
                      this.wallThickness];

        for (let i = 0; i < screws; i++)
        {
            let outerCylinder = cylinder({height: this.mySize[2] + this.wallThickness, radius: 2, center:centers[i]});
            let innercylinder = cylinder({height: this.mySize[2] + this.wallThickness, radius: 1, center:centers[i]});
            screwPins[i] = boolsubtract(outerCylinder, innercylinder);
        }
        let allPins = union(screwPins);
        return allPins;
    }
}