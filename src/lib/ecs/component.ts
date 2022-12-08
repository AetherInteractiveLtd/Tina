// // type Props = Partial<Omit<Component, keyof Component>>;

import { EntityId } from "../types/ecs";
import { UnimplementedWorld, World } from "./world";

export const enum ComponentTypes {
	Boolean,
	Custom,
	None,
	Number,
	String,
}

const x = {
	x: ComponentTypes.Number,
};

export class Component {
	/** @hidden */
	public _componentData: { world?: UnimplementedWorld; id?: number } = {
		world: undefined,
		id: undefined,
	};

	/** @hidden */
	public componentArray: ComponentArray = [];

	/** @hidden */
	public initialiseComponent(
		world: UnimplementedWorld,
		name: string,
		id: number,
		componentArray: ComponentArray,
	): void {
		this._componentData.world = world;
		this._componentData.id = id;
		this.componentArray = componentArray;
	}

	public update(entityId: EntityId, data: typeof x): void {}
}

export class Tag {
	public _componentData = {
		world: undefined as World | undefined,
		id: undefined as number | undefined,
	};

	/** @hidden */
	public initialiseTag(world: World, id: number): void {
		this._componentData.world = world;
		this._componentData.id = id;
	}
}

// TODO: create component array doesn't currently work, and the component array types are incorrect.

/**
 *
 * @param def
 * @param max
 * @returns
 */
export function createComponentArray<T extends Tree<ValidComponentData>>(def: T, max: number): ComponentArray<T> {
	if (type(def) === "table") {
		if ((def as Array<T>).size() > 0) {
			return [...new Array<T>(max)].map(def[0 as never]) as never;
		}
		return new Array<T>(max) as never;
	}

	const ret: ComponentArray = {};
	for (const i of def as Array<number>) {
		ret[i] = createComponentArray(def[i as never] as never, max);
	}
	return ret as never;
}

export type Tree<LeafType> = LeafType | { [key: string]: Tree<LeafType> };
type InitFunc = () => unknown;
export type ValidComponentData = ComponentTypes | ArrayConstructor | [InitFunc] | Array<unknown>;

export type ComponentArray<T extends Tree<ValidComponentData> = Tree<ValidComponentData>> = T extends [InitFunc]
	? Array<ReturnType<T[0]>>
	: T extends Array<unknown>
	? T
	: T extends ArrayConstructor
	? Array<ComponentTypes>
	: T extends Exclude<ValidComponentData, Array<ComponentTypes>>
	? InstanceType<T>
	: {
			[key in keyof T]: T[key] extends Tree<ValidComponentData> ? ComponentArray<T[key]> : never;
	  };
