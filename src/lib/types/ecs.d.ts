import { ComponentMethods, FlyweightMethods } from "../ecs/component";
import { Immutable } from "./readonly";

export type EntityId = number;
export type ComponentId = number;

export declare type PartialComponentToKeys<T extends ComponentData> = {
	[K in keyof T]?: T[K][EntityId];
};

export declare type GetComponentSchema<C> = C extends Component<infer T> ? T : never;

export declare type AllComponentTypes<T = unknown> =
	| AnyComponent<T>
	| AnyFlyweight<T>
	| TagComponent;

export declare type ComponentData = Record<string, Array<unknown>>;
export declare type FlyweightData = Record<string, unknown>;

export declare type Component<T extends ComponentData> = T & ComponentMethods<T>;
export declare type Flyweight<T extends FlyweightData> = Immutable<T> & FlyweightMethods<T>;
export declare type TagComponent = object & {
	[index: string]: never;
};

export declare type AnyComponent<T = unknown> = T extends ComponentData
	? Component<T>
	: Component<{}>;
export declare type AnyFlyweight<T = unknown> = T extends FlyweightData
	? Flyweight<T>
	: Flyweight<{}>;
