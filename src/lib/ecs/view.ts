import { EntityId } from "../types/ecs";
import { Archetype } from "./collections/archetype";
import { Component } from "./component";
import { World } from "./world";

export type RawView =
	| { op: typeof ALL | typeof ANY; dt: Array<RawView | Component> }
	| { op: typeof NOT; dt: RawView | Component };

type MLeaf = { op: typeof ALL | typeof ANY; dt: Array<number> };
type Group = { op: typeof ALL | typeof ANY; dt: [MLeaf, ...Array<ViewMask>] };
type Not = { op: typeof NOT; dt: ViewMask };
type ViewMask = Group | Not | MLeaf;

/**
 * Aaa
 * @param components
 * @returns
 */
export function ALL(...components: Array<RawView | Component>): RawView {
	if (components.size() === 0) {
		throw error("ALL must have at least one component");
	}

	return { op: ALL, dt: components };
}

/**
 *
 * @param components
 * @returns
 */
export function NOT(components: RawView | Component): RawView {
	return { op: NOT, dt: typeOf((components as RawView).op) === "function" ? components : ALL(components) };
}

/**
 *
 * @param components
 * @returns
 */
export function ANY(...components: Array<RawView | Component>): RawView {
	if (components.size() === 0) {
		throw error("ANY must have at least one component");
	}

	return { op: ANY, dt: components };
}

/**
 *
 */
export class View {
	public a: Array<Archetype>;
	public archetypes: Array<Archetype>;
	public mask: ViewMask;
	public world: World;

	constructor(world: World, view?: RawView) {
		/**
		 *
		 * @param raw
		 * @returns
		 */
		const createView = (raw: RawView): ViewMask => {
			if (raw.op === NOT) {
				return { op: raw.op, dt: createView(raw.dt as RawView) } as ViewMask;
			}

			const numbers: Array<number> = [];
			const ret: [MLeaf, ...Array<ViewMask>] = [{ op: raw.op, dt: new Array<number>() }] as [MLeaf];
			for (const i of raw.dt as Array<RawView>) {
				if ("_componentData" in i) {
					if ((i as unknown as Component)._componentData.world === world) {
						numbers.push((i as unknown as Component)._componentData.id!);
					} else {
						throw error(
							`Component ${
								(i as unknown as Component)._componentData.id
							} does not belong to world ${tostring(world)}`,
						);
					}
				} else {
					ret.push(createView(i));
				}
			}

			ret[0].dt = new Array<number>(math.ceil((math.max(-1, ...numbers) + 1) / 32), 0);
			for (const i of numbers) {
				ret[0].dt[math.floor(i / 32)] |= 1 << i % 32;
			}

			return { op: raw.op, dt: ret } as ViewMask;
		};

		this.archetypes = new Array<Archetype>();
		this.a = this.archetypes;
		this.mask = view ? createView(view) : { op: ALL, dt: new Array<number>() };
		this.world = world;
	}

	/**
	 *
	 * @param callback
	 */
	public forEach(callback: (entityId: EntityId, world: World) => void): void {
		for (let i = 0; i < this.a.size(); i++) {
			const entities = this.archetypes[i].entities;
			for (let j = entities.size(); j > 0; j--) {
				callback(entities[j - 1], this.world);
			}
		}
		this.world.flush();
	}

	/**
	 *
	 * @param target
	 * @param mask
	 * @returns
	 */
	public static match(target: Array<number>, mask: ViewMask): boolean {
		if (typeOf((mask.dt as Array<number>)[0]) === "number") {
			return View.partial(target, mask as MLeaf);
		}

		if (mask.op === NOT) {
			return !View.match(target, mask.dt as ViewMask);
		}

		if (mask.op === ALL) {
			for (const view of (mask as Group).dt) {
				if (!View.match(target, view)) {
					return false;
				}
			}
			return true;
		}

		for (const view of (mask as Group).dt) {
			if (View.match(target, view)) {
				return true;
			}
		}

		return false;
	}

	/**
	 *
	 * @param target
	 * @param mask
	 * @returns
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
}
