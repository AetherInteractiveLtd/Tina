import Sift, { None } from "@rbxts/sift";
import { t } from "@rbxts/t";

import { ComponentId, EntityId } from "../types/ecs";
import { Immutable } from "../types/readonly";
import { getNextComponentId } from "./entity-manager";

export type AnyComponent = Component<Tree<Type>>;
export type AnyComponentInternal = ComponentInternal<Tree<Type>>;

export type GetComponentSchema<C> = C extends Component<infer T> ? T : never;

export type ComponentInstance<T extends Tree<Type> = Tree<Type>> = Immutable<{
    readonly componentId: ComponentId;
    readonly data: T;
}>;

export type ComponentData<T extends Tree<Type>> = T extends Array<infer U> ? Array<U> : T;

export type OptionalKeys<T> = { [K in keyof T]: (T[K] extends Array<infer U> ? U : never) | None };

type ComponentIdField = { readonly componentId: ComponentId };

export type Component<T extends Tree<Type>> = {
    set<U extends Partial<OptionalKeys<T>>>(entityId: EntityId, data: U): void;
};

export type ComponentInternal<T extends Tree<Type>> = Component<T> &
    ComponentIdField &
    ComponentArray<T>;

export const ComponentTypes = {
    number: [0],
    string: [""],
    boolean: [false],
};

export type TagComponent = {
    [index: string]: never;
};

export type TagComponentInternal = ComponentIdField & {
    [index: string]: never;
};

/**
 * Creates a component that matches the given schema.
 *
 * Internally this creates an array for each property in the schema, where the
 * index of the array matches an entity id. This allows for fast lookups of
 * component data.
 *
 * The array is pre-allocated to the given size, so it is important to ensure
 * that you do not access the component data for an entity that does not exist,
 * or that does not have the component. This is because the array could hold
 * data for a given entity, despite the fact that the entity would be invalid.
 *
 * Components are singletons, and should be created once per component type.
 * Components also persist between worlds, therefore you do not need more than
 * one component per world. EntityIds are also global, therefore the index of
 * a given entity will always match the index of the component data.
 *
 * @param schema The properties of the component.
 *
 * @returns A single component instance.
 */
export function createComponent<T extends Tree<Type>>(schema: T): Component<T>;
export function createComponent<T extends Tree<Type>>(schema: Tree<Type> = {}): Component<T> {
    const componentData = createComponentArray(schema, 10000);
    return Sift.Dictionary.merge(componentData, {
        componentId: getNextComponentId(),

        set<U extends Partial<OptionalKeys<T>>>(entityId: EntityId, data: U): void {
            // eslint-disable-next-line roblox-ts/no-array-pairs
            for (const [key, value] of pairs(data)) {
                componentData[key as never][entityId as never] = value as never;
            }
        },
    });
}

/**
 * Creates a tag component; a component that has no data.
 *
 * Tags are useful for marking entities as having a certain property, without
 * the overhead of storing any data. For example, you could use a tag component
 * to mark an entity as being a player, and then use a system to query for all
 * entities that have the player tag.
 *
 * Tags are singletons, and should be created once per component type. Tags
 * also persist between worlds, therefore you do not need more than one Tag per
 * world.
 *
 * @returns A tag component.
 */
export function createTag(): TagComponent {
    return {
        componentId: getNextComponentId(),
    } as TagComponentInternal;
}

/**
 *
 * @param def
 * @param max
 * @returns
 */
function createComponentArray<T extends Tree<Type>>(def: T, max: number): ComponentArray<T> {
    if (type(def) === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (def as any)(max);
    }

    if (t.array(t.any)(def) === true) {
        if ((def as Array<T>).size() > 0) {
            // return [...new Array<T>(max)].map(def[0 as never]) as never;
            return new Array<T>(max, (def as Array<T>)[0 as never]) as never;
        }
        return new Array<T>(max) as never;
    }

    const ret: ComponentArray = {};

    // eslint-disable-next-line roblox-ts/no-array-pairs
    for (const [key, value] of pairs(def)) {
        ret[key as never] = createComponentArray(value as never, max);
    }
    return ret as never;
}

export type Tree<LeafType> = LeafType | { [key: string]: Tree<LeafType> };

export type Type = ArrayConstructor | Array<unknown>;

export type ComponentArray<T extends Tree<Type> = Tree<Type>> = T extends Array<unknown>
    ? T
    : T extends ArrayConstructor
    ? Array<typeof ComponentTypes>
    : T extends Exclude<Type, Array<unknown>>
    ? InstanceType<T>
    : {
          [key in keyof T]: T[key] extends Tree<Type> ? ComponentArray<T[key]> : never;
      };
