// // type Props = Partial<Omit<Component, keyof Component>>;

import { EntityId } from "../types/ecs";
import { World } from "./world";

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
	public _componentData = {
		world: undefined as World | undefined,
		id: undefined as number | undefined,
	};

	/** @hidden */
	public componentArray: ComponentArray = [];

	/** @hidden */
	public initializeComponent(world: World, id: number, componentArray: ComponentArray): void {
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
	public initializeTag(world: World, id: number): void {
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
export function createComponentArray<T extends Tree<Type>>(def: T, max: number): ComponentArray<T> {
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
export type Type = ComponentTypes | ArrayConstructor | [InitFunc] | Array<unknown>;

export type ComponentArray<T extends Tree<Type> = Tree<Type>> = T extends [InitFunc]
	? Array<ReturnType<T[0]>>
	: T extends Array<unknown>
	? T
	: T extends ArrayConstructor
	? Array<ComponentTypes>
	: T extends Exclude<Type, Array<ComponentTypes>>
	? InstanceType<T>
	: {
			[key in keyof T]: T[key] extends Tree<Type> ? ComponentArray<T[key]> : never;
	  };
