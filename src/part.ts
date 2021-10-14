import Vec3 from "@jscad/modeling/src/maths/vec3/type";
import {cylinder, cuboid } from "@jscad/modeling/src/primitives";
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
        let z = 0;
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
        let screwPins = new ScrewPin(this.mySize, 4);
        const base = boolsubtract(this.generate_base(), this.generate_walls());
        let intShape = boolsubtract(base, screwPins.baseShape)
        const finalShape = union(intShape, screwPins.generate());
        return finalShape;
    }

    /**
     * Generate the base solid shape
     * @returns The base geometery
     */
    private generate_base(): Geom3 {
        let base = cuboid({size: [this.mySize[0] + (2 * this.wallThickness),
                                  this.mySize[1] + (2 * this.wallThickness),
                                  this.mySize[2] + (this.wallThickness)],
                           center:this.center}
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
        let walls = cuboid(
            {size:[
                this.mySize[0],
                this.mySize[1],
                this.mySize[2]
            ], center:[0,0, (this.mySize[2]/2)]
        }
        )
        return walls
    }
}

class ScrewPin extends Part
{
    public baseShape: Geom3;
    private centers: Vec3[] = new Array;
    private screws: number;

    public constructor(mySize: [number, number, number], screws: number){
        super(mySize);
        this.setCenters();
        this.screws = screws;
        this.baseShape = this.generateBase();
    }

    /**
     * Generate screw pins to add to the board holder geometery
     * @returns {Geom3} The 3D geomenetry of the screw pins
     */
    generate(): Geom3
    {
        this.setCenters();
        const screwPins = boolsubtract(this.baseShape, this.generateHoles());
        const allScrewPins = union(screwPins);
        return allScrewPins;
    }
    
    private generateBase(): Geom3
    {
        let baseShape: Geom3[] = new Array;
        for (let i = 0; i < this.screws; i ++)
        {
            baseShape[i] = cylinder({height: this.mySize[2] + this.wallThickness, radius: 2, center:this.centers[i]});
        }
        return union(baseShape);
    }

    private generateHoles(): Geom3
    {
        let holes: Geom3[] = new Array;
        for (let i = 0; i < this.screws; i ++)
        {
            holes[i] = cylinder({height: this.mySize[2] + this.wallThickness, radius: 1, center:this.centers[i]});
        }
        return union(holes);
    }

    private setCenters()
    {
        this.centers[0] = [this.mySize[0]/2+this.wallThickness,
                            this.mySize[1]/2+this.wallThickness,
                            0];
        this.centers[1] = [-this.mySize[0]/2-this.wallThickness,
                            -this.mySize[1]/2-this.wallThickness,
                            0];
        this.centers[2] = [-this.mySize[0]/2-this.wallThickness,
                            this.mySize[1]/2+this.wallThickness,
                            0];
        this.centers[3] = [this.mySize[0]/2+this.wallThickness,
                            -this.mySize[1]/2-this.wallThickness,
                            0];
    }
}
