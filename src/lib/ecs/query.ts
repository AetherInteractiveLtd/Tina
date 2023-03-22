import { ComponentId, EntityId } from "../types/ecs";
import { Archetype } from "./collections/archetype";
import { SparseSet } from "./collections/sparse-set";
import { AnyComponent, AnyComponentInternal, TagComponent } from "./component";
import { World } from "./world";

export type RawQuery =
	| { op: typeof ALL | typeof ANY; dt: Array<RawQuery | AnyComponent | TagComponent> }
	| { op: typeof NOT; dt: RawQuery | AnyComponent | TagComponent };

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
export function ALL(...components: Array<RawQuery | AnyComponent | TagComponent>): RawQuery {
	if (components.size() === 0) {
		throw "ALL must have at least one component";
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
export function ANY(...components: Array<RawQuery | AnyComponent | TagComponent>): RawQuery {
	if (components.size() === 0) {
		throw "ANY must have at least one component";
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
export function NOT(components: RawQuery | AnyComponent | TagComponent): RawQuery {
	return {
		op: NOT,
		dt: typeOf((components as RawQuery).op) === "function" ? components : ALL(components),
	};
}

/**
 * A query is used to filter entities from the world based on their components.
 *
 * To create a query, use the {@link World.createQuery} method, which takes a
 * set of components, and will return a query that matches all the entities in
 * the owning world that have the given components.
 *
 * Queries can be created using the helper functions {@link ALL}, {@link ANY},
 * and {@link NOT}, which can be used to create complex queries.
 *
 * #### Usage Example:
 * ```ts
 * import { World, ALL, ANY, NOT } from "@rbxts/tina";
 * import { Position, Velocity, Acceleration } from "./components";
 *
 * const world = Tina.createWorld({...});
 * const query = world.createQuery(Position, ANY(Velocity, NOT(Acceleration)));
 * for (const entityId of query.iter()) {
 * 	// ...
 * };
 * ```
 *
 * @note Order of iteration is not guaranteed.
 */
export class Query {
	/** The world that the query belongs to. */
	public readonly world: World;

	/** All the archetypes that match the given query. */
	public archetypes: Array<Archetype> = [];

	/**
	 * Any entities that have moved into the query since the last time that
	 * {@link Query.enteredQuery} was called. Any entity that leaves the query
	 * will be added to {@link Query.exitedQuery} and removed from this set.
	 */
	public entered: SparseSet = new SparseSet();

	/**
	 * Any entities that have left the query since the last time that
	 * {@link Query.exitedQuery} was called. Any entity that enters the query
	 * will be added to {@link Query.enteredQuery} and removed from this set.
	 */
	public exited: SparseSet = new SparseSet();

	/** @internal */
	public mask: QueryMask;

	/** @internal */
	constructor(world: World, query?: RawQuery) {
		this.mask = query ? this.createQuery(query) : { op: ALL, dt: [] };
		this.world = world;
	}

	/**
	 * @internal
	 *
	 * Traverses the query mask, and returns true if the archetype mask
	 * matches the given query.
	 *
	 * This function should not be used directly, and instead is used
	 * internally by {@link World.createQuery}.
	 *
	 * @param target The archetype mask to match against.
	 * @param mask The query mask to match against.
	 *
	 * @returns True if the query mask matches the archetype mask.
	 */
	public static match(target: Array<ComponentId>, mask: QueryMask): boolean {
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
	 * Runs a callback for each entity that has been added to the query since
	 * the last time this method was called.
	 *
	 * If the callback returns `false`, the iteration will stop, and no other
	 * entities in this query will be iterated over. Please note that this will
	 * still flush the contents of the query, so the next call to this method
	 * will not iterate over the same entities.
	 *
	 * As this method flushes the contents of the query, it can only be used
	 * once. If you need to iterate over the same entities multiple times,
	 * although unconventional, you can use the `Query.entered.dense` array
	 * directly instead.
	 *
	 * @returns An iterator that yields the entity IDs of the entities that
	 * have been added to the query since the last time this method was called.
	 */
	public *enteredQuery(): Generator<EntityId> {
		for (const entityId of this.entered.dense) {
			yield entityId;
		}

		this.entered = new SparseSet();
	}

	/**
	 * Runs a callback for each entity that has been removed from the query
	 * since the last time this method was called.
	 *
	 * If the callback returns `false`, the iteration will stop, and no other
	 * entities in this query will be iterated over. Please note that this will
	 * still flush the contents of the query, so the next call to this method
	 * will not iterate over the same entities.
	 *
	 * As this method flushes the contents of the query, it can only be used
	 * once. If you need to iterate over the same entities multiple times,
	 * although unconventional, you can use the `Query.exited.dense` array
	 * directly instead.
	 *
	 * @returns An iterator that yields the entity IDs of the entities that
	 * have been removed from the query since the last time this method was
	 * called.
	 */
	public *exitedQuery(): Generator<EntityId> {
		for (const entityId of this.exited.dense) {
			yield entityId;
		}

		this.exited = new SparseSet();
	}

	/**
	 * @returns an array of all the entities that currently match the query.
	 */
	public items(): Array<EntityId> {
		const newArray = new Array<number>(this.size());
		for (const i of $range(0, this.archetypes.size() - 1)) {
			const archetype = this.archetypes[i].entities;
			archetype.move(0, archetype.size(), newArray.size(), newArray);
		}

		return newArray;
	}

	/**
	 * Runs a callback for each entity that matches the query.
	 */
	public *iter(): Generator<EntityId> {
		// TODO: This should be turned into a *[Symbol.iterator] method whenever
		// that is supported.
		for (const archetype of this.archetypes) {
			for (const entityId of archetype.entities) {
				yield entityId;
			}
		}
	}

	/**
	 * @returns the number of entities that currently match the query.
	 */
	public size(): number {
		let size = 0;

		for (const archetype of this.archetypes) {
			size += archetype.entities.size();
		}

		return size;
	}

	/**
	 * Called when a leaf node is reached in the query mask.
	 *
	 * @param target The current remaining mask.
	 * @param mask The leaf node to match with.
	 *
	 * @returns True if the mask matches the query mask.
	 */
	private static partial(target: Array<number>, mask: MLeaf): boolean {
		if (mask.op === ALL) {
			for (const i of $range(0, mask.dt.size() - 1)) {
				if ((target[i] & mask.dt[i]) < mask.dt[i]) {
					return false;
				}
			}
			return true;
		}

		for (const i of $range(0, mask.dt.size() - 1)) {
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
					throw `A Component has not been initialized properly.`;
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
