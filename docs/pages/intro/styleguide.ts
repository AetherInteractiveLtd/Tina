/* Constants are already `const`, there's no point hammering it in with SHEEP_MAX, especially not to IntelliSense. */
/* Constants use PascalCase, define their types if you wish or if human inferral seems too complicated. */
const HerdMax: number = 10;

/* Prefer Interfaces to Types, Interfaces use PascalCase */
export interface Animal {
    /* This is a complex interface where what has to occur with walk isn't really comprehensible, we use TSDoc */
    /**
     * Walks according to its current herd 
     * @returns
     */
    walk(): number;

    joinHerd(herd: AnimalHerd): this;
}

enum Noise {
    /* Even if we repeat the word in the Enum name and the Enum item, this is still the neatest practice. */
    SheepNoise = "baaaaaaa",
    /* Defining the value for an Enum item is absolutely mandatory. */
    CowNoise = "moooooo"
}

export class Sheep implements Animal {
    protected herd?: AnimalHerd; 

    // readonly class constants should be static and PascalCase
    public static readonly StepSize = 0;
    
    /* Methods are camelCase */
    /* Performing an action should be prefixed with an appropriate verb. */
    /* Access indicators (public/private/protected) are mandatory */
    public doNoise(): void { // Void returns matter and should be annotated as such.
        console.log(
            (Noise.SheepNoise)
                [Math.random() > 0.5 ? "toUpperCase" : "toLowerCase"]
                ()
        );
    }

    public walk(): number {
        if (Math.random() > 0.1) this.doNoise();

        return Sheep.StepSize;
    }

    /* It's nice to return `this` when we're performing a modifier action on something */
    public joinHerd(herd: AnimalHerd): this {
        this.herd = herd;

        return this;
    }
}

export class AnimalHerd {
    /* Array<Type> is used for Types whilst [] is used for Definitions. */
    public readonly animals: Array<Animal> = [];

    protected addAnimal(animal: Animal): void {
        /* We leave a TODO: when we haven't done something yet. */
        if (this.animals.length >= HerdMax) return; // TODO: Add error/notify failure.

        this.animals.push(animal);
    }
}

class FooCake {}

export namespace Foo {
    export const Cake = FooCake;
}
