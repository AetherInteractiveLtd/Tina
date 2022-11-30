// // type Props = Partial<Omit<Component, keyof Component>>;

import { EntityId } from "../types/ecs";
import { World } from "./world";

// // Component data needs to be easily serializable
// // Component data needs to be automatically replicated when marked as such

// const enum ComponentTypes {
// 	Boolean,
// 	Custom,
// 	None,
// 	Number,
// 	String,
// }

// export interface PropTypeDefinition<D> {
// 	name: string;
// 	default: D;
// }

// export interface PropType<D> extends PropTypeDefinition<D> {
// 	isType: true;
// }

// export type NumberPropType = PropType<number>;
// export type StringPropType = PropType<string>;
// export type BooleanPropType = PropType<boolean>;

// export const Types: {
// 	Number: NumberPropType;
// 	String: StringPropType;
// 	Boolean: BooleanPropType;
// };

export const enum ComponentTypes {
	Boolean,
	Custom,
	None,
	Number,
	String,
}

// abstract class ComponentType<T> {
// 	/** The id of the component */
// 	protected abstract _id: number;

// 	static boolean: ComponentType<boolean>;
// 	static number: ComponentType<number>;
// 	static string: ComponentType<string>;

// 	constructor(readonly defaultValue: T) {}
// }

// interface SchemaDef<T> {
// 	type: ComponentType<T>; // | (() => ComponentType<any>);
// 	default?: T;
// }

// interface Schema {
// 	[prop: string]: ComponentType<never> | (() => ComponentType<never>) | SchemaDef<never>;
// }

// class Component {
// 	schema: Schema;

// 	protected updateData(data: Partial<this>): void {}
// }

// interface IPosition {
// 	X: number;
// 	Y: number;
// 	Z: number;
// }

// class Position extends Component implements IPosition {
// 	data: undefined;

// 	constructor(data?: IPosition) {
// 		super();
// 	}
// }

// type OptionalKeys<T> = { [K in keyof T]: T[K] };

// type Id<T> = T;

// type PatchOverride<Base, Overrides> = Id<{
// 	[K in keyof Base | keyof Overrides]: K extends keyof Overrides
// 		? Overrides[K]
// 		: K extends keyof Base
// 		? Base[K]
// 		: never;
// }>;

// interface Schema {}

// // type SchemaEntry = {
// //     type:
// // }

// // string, number, boolean, table, nil, custom

// /**
//  * A component is a collection of data that is attached to an entity.
//  */
// export class Component<T extends object> {
// 	// static schema = {
// 	// 	name: string,
// 	// 	inter: number,
// 	// };

// 	static schema = {};

// 	private data: Partial<Omit<Component<T>, keyof Component<T>>>;

// 	constructor(props: T) {
// 		this.data = props;
// 	}

// 	// public updateData<U extends OptionalKeys<Partial<T>>>(
// 	// 	partialNewData: U,
// 	// ): Component<ExcludeMembers<PatchOverride<T, U>, Sift.None>> {
// 	// 	this.data = Sift.Dictionary.merge(this.data, partialNewData);
// 	// 	return this.data;
// 	// }
// }

// class ComponentA extends Component {
// 	schema = {};
// }

// const comp = new Component({ name: "test", inter: 1 });

// comp.updateData({ x: 5 });

// const x = comp.updateData({ inter: 2 }); // this needs to fail

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
	public initialiseComponent(world: World, id: number, componentArray: ComponentArray): void {
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

// export const _componentData = "_componentData";
// export type _componentData = typeof _componentData;

export type ComponentData = {
	_componentData: {
		world: World;
		id: number;
	};
};

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
	: T extends ComponentData
	? ComponentData
	: {
			[key in keyof T]: T[key] extends Tree<Type> ? ComponentArray<T[key]> : never;
	  };

// https://github.com/jprochazk/uecs ?
