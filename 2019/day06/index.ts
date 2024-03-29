interface IOrbitConfigutaion {
    readonly orbitted: string;
    readonly orbitting: string;
}

class OrbitConfiguration implements IOrbitConfigutaion {
    public readonly orbitted: string;
    public readonly orbitting: string;

    constructor(rawInput: string) {
        const parts = rawInput.split(')');

        if (parts.length !== 2) {
            throw new Error("Expected 2 parts for input " + rawInput + " actually received " + parts.length);
        }

        this.orbitted = parts[0];
        this.orbitting = parts[1];
    }
}

const orbitConfigurations: OrbitConfiguration[] = require('fs')
    .readFileSync('2019/day06/input.txt')
    .toString()
    .split("\n")
    .map((rawLine: string) => new OrbitConfiguration(rawLine));

console.log(orbitConfigurations[0]);

interface IObject {
    readonly level: number;

    addChild(child: IObject): void;
    setLevel(newLevel: number): void;
    setParent(parent: IObject): void;
}

class OrbitableObject implements IObject {
    private children: IObject[] = [];
    private parent: IObject = null;
    private _level: number | null = null;

    constructor(private readonly id: string) { }

    get level() {
        if (this._level === null) {
            throw new Error("Level was not set for " + this.id);
        }
        return this._level;
    }

    addChild(child: IObject) {
        child.setParent(this);
        this.children.push(child);
    }

    setLevel(level: number) {
        this._level = level;
        this.children.forEach(child => child.setLevel(level + 1));
    }

    setParent(parent: IObject) {
        if (this.parent !== null) {
            throw new Error("Parent has already been set for " + this.id);
        }
        this.parent = parent;
    }
}

const objectCache: Map<string, IObject> = new Map();

const safeGetFromCache = (id: string): IObject => {
    if (objectCache.has(id)) {
        return objectCache.get(id);
    }

    throw Error("Expected object with id " + id + " to be in cache");
}

const addToCacheIfNotExisting = (id: string) => {
    if (objectCache.has(id)) {
        return;
    }

    objectCache.set(id, new OrbitableObject(id));
};

orbitConfigurations.forEach(orbitConfiguration => {
    addToCacheIfNotExisting(orbitConfiguration.orbitting);
    addToCacheIfNotExisting(orbitConfiguration.orbitted);
});

console.log("There are " + objectCache.size + " unique orbitable objects");

orbitConfigurations.forEach(orbitConfiguration => {
    const orbittedObject = safeGetFromCache(orbitConfiguration.orbitted);
    const orbittingObject = safeGetFromCache(orbitConfiguration.orbitting);

    orbittedObject.addChild(orbittingObject);
});

safeGetFromCache("COM").setLevel(0);

let part1 = 0;
objectCache.forEach(object => {
    part1 = part1 + object.level;
})

console.log(part1);

export {};
