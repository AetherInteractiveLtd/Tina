import { EntityId } from "../types/ecs";
import { Archetype } from "./collections/archetype";
import { AnyComponent, AnyComponentInternal } from "./component";
import { World } from "./world";

export type RawQuery =
    | { op: typeof ALL | typeof ANY; dt: Array<RawQuery | AnyComponent> }
    | { op: typeof NOT; dt: RawQuery | AnyComponent };

type MLeaf = { op: typeof ALL | typeof ANY; dt: Array<number> };
type Group = { op: typeof ALL | typeof ANY; dt: [MLeaf, ...Array<QueryMask>] };
type Not = { op: typeof NOT; dt: QueryMask };
type QueryMask = Group | Not | MLeaf;

/**
 * A helper function that matches to all provided components.
 *
 * This function should not be used outside of the {@link World.createQuery}
 * constructor.
 *
 * #### Usage Example:
 * ```ts
 * // An entity must have components A, B and C.
 * ALL(ComponentA, ComponentB, ComponentC)
 *
 * // An entity must have component A, and either component B or C.
 * ALL(ComponentA, ANY(ComponentB, ComponentC))
 * ```
 *
 * @param components The components or query to match to.
 */
export function ALL(...components: Array<RawQuery | AnyComponent>): RawQuery {
    if (components.size() === 0) {
        throw error("ALL must have at least one component");
    }

    return { op: ALL, dt: components };
}

/**
 * A helper function that matches to any of the provided components.
 *
 * This function should not be used outside of the {@link World.createQuery}
 * constructor.
 *
 * #### Usage Example:
 * ```ts
 * // An entity must have either components A, B or C.
 * ANY(ComponentA, ComponentB, ComponentC)
 *
 * // An entity must have component A, or either both components B and C.
 * ANY(ComponentA, ALL(ComponentB, ComponentC))
 * ```
 *
 * @param components The components or query to match to.
 */
export function ANY(...components: Array<RawQuery | AnyComponent>): RawQuery {
    if (components.size() === 0) {
        throw error("ANY must have at least one component");
    }

    return { op: ANY, dt: components };
}

/**
 * A helper function that matches if the provided component is not present.
 *
 * This function should not be used outside of the {@link World.createQuery}
 * constructor.
 *
 * #### Usage Example:
 * ```ts
 * // An entity must not have component A.
 * NOT(ComponentA)
 *
 * // An entity must have component A, and must not have component B.
 * ALL(ComponentA, NOT(ComponentB))
 * ```
 *
 * @param components The components or query to match to.
 */
export function NOT(components: RawQuery | AnyComponent): RawQuery {
    return {
        op: NOT,
        dt: typeOf((components as RawQuery).op) === "function" ? components : ALL(components),
    };
}

/**
 * A query is used to filter entities based on their components.
 *
 * To create a query, use the {@link World.createQuery} method, which takes a
 * list of components, and will return a query that matches all the entities in
 * the given world that have the given components.
 *
 * Queries can be created using the helper functions {@link ALL}, {@link ANY},
 * and {@link NOT}, which can be used to create complex queries.
 *
 * #### Usage Example:
 * ```ts
 * import { World, ALL, ANY, NOT } from "@rbxts/tina";
 * import { Position, Velocity, Acceleration } from "./components";
 *
 * const world = new World();
 * const query = world.createQuery(Position, ANY(Velocity, NOT(Acceleration)));
 * query.forEach((entity) => {
 * 	// ...
 * });
 * ```
 *
 * @note Order of iteration is not guaranteed.
 */
export class Query {
    /** The world that the query belongs to. */
    public readonly world: World;

    public archetypes: Array<Archetype>;
    public mask: QueryMask;

    constructor(world: World, query?: RawQuery) {
        this.archetypes = [];
        this.mask = query ? this.createQuery(query) : { op: ALL, dt: [] };
        this.world = world;
    }

    /**
     * Traverses the query mask, and returns true if the archetype mask
     * matches the given query.
     *
     * This function should not be used directly, and instead is used
     * internally by {@link World.createQuery}.
     *
     * @param target The archetype mask to match to.
     * @param mask The query mask to match with.
     * @returns True if the archetype mask matches the query mask.
     */
    public static match(target: Array<number>, mask: QueryMask): boolean {
        if (typeOf((mask.dt as Array<number>)[0]) === "number") {
            return Query.partial(target, mask as MLeaf);
        }

        if (mask.op === NOT) {
            return !Query.match(target, mask.dt as QueryMask);
        }

        if (mask.op === ALL) {
            for (const query of (mask as Group).dt) {
                if (!Query.match(target, query)) {
                    return false;
                }
            }

            return true;
        }

        for (const query of (mask as Group).dt) {
            if (Query.match(target, query)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Runs a callback for each entity that matches the given query.
     *
     * If the callback returns `false`, the iteration will stop, and no other
     * entities in this query will be iterated over.
     *
     * #### Usage Example:
     * ```ts
     * query.forEach((entity) => {
     * 	// ...
     * });
     * ```
     *
     * Once the iteration is complete, any deferred changes made during the
     * query (such as {@link Entity.removeComponent}) will be applied.
     *
     * @param callback The callback to run for each entity.
     */
    public forEach(callback: (entityId: EntityId) => boolean | void): void {
        if (this.archetypes.size() === 0) {
            return;
        }

        for (let i = 0; i < this.archetypes.size(); i++) {
            const entities = this.archetypes[i].entities;
            for (let j = entities.size(); j > 0; j--) {
                if (!callback(entities[j - 1])) {
                    break;
                }
            }
        }

        this.world.flush();
    }

    /**
     * Called when a leaf node is reached in the query mask.
     *
     * @param target The current remaining mask.
     * @param mask The leaf node to match with.
     * @returns True if the mask matches the query mask.
     */
    private static partial(target: Array<number>, mask: MLeaf): boolean {
        if (mask.op === ALL) {
            for (let i = 0; i < mask.dt.size(); i++) {
                if ((target[i] & mask.dt[i]) < mask.dt[i]) {
                    return false;
                }
            }
            return true;
        }

        for (let i = 0; i < mask.dt.size(); i++) {
            if ((target[i] & mask.dt[i]) > 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Creates a decision tree from a given query.
     * @param raw The raw data to create the decision tree from.
     */
    private createQuery = (raw: RawQuery): QueryMask => {
        if (raw.op === NOT) {
            return { op: raw.op, dt: this.createQuery(raw.dt as RawQuery) } as QueryMask;
        }

        const numbers: Array<number> = [];
        const ret: [MLeaf, ...Array<QueryMask>] = [{ op: raw.op, dt: [] }] as [MLeaf];
        for (const i of raw.dt as Array<RawQuery>) {
            if ("componentId" in i) {
                const componentId = (i as unknown as AnyComponentInternal).componentId;
                if (componentId !== undefined) {
                    numbers.push(componentId);
                } else {
                    // TODO: Better error message
                    throw error(`A Component has not been initialized properly.`);
                }
            } else {
                ret.push(this.createQuery(i));
            }
        }

        ret[0].dt = new Array<number>(math.ceil((math.max(-1, ...numbers) + 1) / 32), 0);
        for (const i of numbers) {
            ret[0].dt[math.floor(i / 32)] |= 1 << i % 32;
        }

        return { op: raw.op, dt: ret } as QueryMask;
    };
}
