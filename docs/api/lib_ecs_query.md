[@rbxts/tina](modules.md) / lib/ecs/query

# lib/ecs/query

## Index

### Classes

- [Query](lib_ecs_query.md#query)

### Type Aliases

- [RawQuery](lib_ecs_query.md#rawquery)

### Functions

- [ALL](lib_ecs_query.md#all)
- [ANY](lib_ecs_query.md#any)
- [NOT](lib_ecs_query.md#not)

## Classes

### Query

A query is used to filter entities from the world based on their components.

To create a query, use the World.createQuery method, which takes a
set of components, and will return a query that matches all the entities in
the owning world that have the given components.

Queries can be created using the helper functions [ALL](lib_ecs_query.md#all), [ANY](lib_ecs_query.md#any),
and [NOT](lib_ecs_query.md#not), which can be used to create complex queries.

#### Usage Example:

```ts
import { World, ALL, ANY, NOT } from "@rbxts/tina";
import { Position, Velocity, Acceleration } from "./components";

const world = Tina.createWorld({...});
const query = world.createQuery(Position, ANY(Velocity, NOT(Acceleration)));
for (const entityId of query.iter()) {
	// ...
};
```

#### Note

Order of iteration is not guaranteed.

#### Index

##### Properties

- [archetypes](lib_ecs_query.md#archetypes)
- [entered](lib_ecs_query.md#entered)
- [exited](lib_ecs_query.md#exited)
- [world](lib_ecs_query.md#world)

##### Methods

- [enteredQuery](lib_ecs_query.md#enteredquery)
- [exitedQuery](lib_ecs_query.md#exitedquery)
- [items](lib_ecs_query.md#items)
- [iter](lib_ecs_query.md#iter)
- [size](lib_ecs_query.md#size)

#### Properties

##### archetypes

> [`Archetype`](lib_ecs_collections_archetype.md#archetype)[] = `[]`

All the archetypes that match the given query.

Defined in: [src/lib/ecs/query.ts:119](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L119)

##### entered

> [`SparseSet`](lib_ecs_collections_sparse_set.md#sparseset)

Any entities that have moved into the query since the last time that
[enteredQuery](lib_ecs_query.md#enteredquery) was called. Any entity that leaves the query
will be added to [exitedQuery](lib_ecs_query.md#exitedquery) and removed from this set.

Defined in: [src/lib/ecs/query.ts:126](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L126)

##### exited

> [`SparseSet`](lib_ecs_collections_sparse_set.md#sparseset)

Any entities that have left the query since the last time that
[exitedQuery](lib_ecs_query.md#exitedquery) was called. Any entity that enters the query
will be added to [enteredQuery](lib_ecs_query.md#enteredquery) and removed from this set.

Defined in: [src/lib/ecs/query.ts:133](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L133)

##### world

> **`Readonly`** [`World`](lib_ecs_world.md#world)

The world that the query belongs to.

Defined in: [src/lib/ecs/query.ts:116](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L116)

#### Methods

##### enteredQuery()

Runs a callback for each entity that has been added to the query since
the last time this method was called.

If the callback returns `false`, the iteration will stop, and no other
entities in this query will be iterated over. Please note that this will
still flush the contents of the query, so the next call to this method
will not iterate over the same entities.

As this method flushes the contents of the query, it can only be used
once. If you need to iterate over the same entities multiple times,
although unconventional, you can use the `Query.entered.dense` array
directly instead.

###### Signature

```ts
enteredQuery(): Generator<number, void, unknown>;
```

###### Returns

`Generator`\<`number`, `void`, `unknown`\>

An iterator that yields the entity IDs of the entities that
have been added to the query since the last time this method was called.

Defined in: [src/lib/ecs/query.ts:203](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L203)

##### exitedQuery()

Runs a callback for each entity that has been removed from the query
since the last time this method was called.

If the callback returns `false`, the iteration will stop, and no other
entities in this query will be iterated over. Please note that this will
still flush the contents of the query, so the next call to this method
will not iterate over the same entities.

As this method flushes the contents of the query, it can only be used
once. If you need to iterate over the same entities multiple times,
although unconventional, you can use the `Query.exited.dense` array
directly instead.

###### Signature

```ts
exitedQuery(): Generator<number, void, unknown>;
```

###### Returns

`Generator`\<`number`, `void`, `unknown`\>

An iterator that yields the entity IDs of the entities that
have been removed from the query since the last time this method was
called.

Defined in: [src/lib/ecs/query.ts:229](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L229)

##### items()

###### Signature

```ts
items(): number[];
```

###### Returns

`number`[]

an array of all the entities that currently match the query.

Defined in: [src/lib/ecs/query.ts:240](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L240)

##### iter()

Runs a callback for each entity that matches the query.

###### Signature

```ts
iter(): Generator<number, void, unknown>;
```

###### Returns

`Generator`\<`number`, `void`, `unknown`\>

Defined in: [src/lib/ecs/query.ts:253](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L253)

##### size()

###### Signature

```ts
size(): number;
```

###### Returns

`number`

the number of entities that currently match the query.

Defined in: [src/lib/ecs/query.ts:266](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L266)

## Type Aliases

### RawQuery

> \{

    `dt`: ([`RawQuery`](lib_ecs_query.md#rawquery) \| [`AnyComponent`](lib_ecs_component.md#anycomponent) \| [`TagComponent`](lib_ecs_component.md#tagcomponent))[];
    `op`: *typeof* [`ALL`](lib_ecs_query.md#all) \| *typeof* [`ANY`](lib_ecs_query.md#any);

} \| \{
`dt`: [`RawQuery`](lib_ecs_query.md#rawquery) \| [`AnyComponent`](lib_ecs_component.md#anycomponent) \| [`TagComponent`](lib_ecs_component.md#tagcomponent);
`op`: _typeof_ [`NOT`](lib_ecs_query.md#not);
}

Defined in: [src/lib/ecs/query.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L7)

## Functions

### ALL()

A helper function that matches to all provided components.

This function should not be used outside of the World.createQuery
constructor.

#### Usage Example:

```ts
// An entity must have components A, B and C.
ALL(ComponentA, ComponentB, ComponentC);

// An entity must have component A, and either component B or C.
ALL(ComponentA, ANY(ComponentB, ComponentC));
```

#### Signature

```ts
ALL(...components: (AnyComponent | TagComponent | RawQuery)[]): RawQuery;
```

#### Parameters

| Name            | Type                                                                                                                                                      | Description                          |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------- |
| `...components` | ([`AnyComponent`](lib_ecs_component.md#anycomponent) \| [`TagComponent`](lib_ecs_component.md#tagcomponent) \| [`RawQuery`](lib_ecs_query.md#rawquery))[] | The components or query to match to. |

#### Returns

[`RawQuery`](lib_ecs_query.md#rawquery)

Defined in: [src/lib/ecs/query.ts:33](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L33)

---

### ANY()

A helper function that matches to any of the provided components.

This function should not be used outside of the World.createQuery
constructor.

#### Usage Example:

```ts
// An entity must have either components A, B or C.
ANY(ComponentA, ComponentB, ComponentC);

// An entity must have component A, or either both components B and C.
ANY(ComponentA, ALL(ComponentB, ComponentC));
```

#### Signature

```ts
ANY(...components: (AnyComponent | TagComponent | RawQuery)[]): RawQuery;
```

#### Parameters

| Name            | Type                                                                                                                                                      | Description                          |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------- |
| `...components` | ([`AnyComponent`](lib_ecs_component.md#anycomponent) \| [`TagComponent`](lib_ecs_component.md#tagcomponent) \| [`RawQuery`](lib_ecs_query.md#rawquery))[] | The components or query to match to. |

#### Returns

[`RawQuery`](lib_ecs_query.md#rawquery)

Defined in: [src/lib/ecs/query.ts:58](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L58)

---

### NOT()

A helper function that matches if the provided component is not present.

This function should not be used outside of the World.createQuery
constructor.

#### Usage Example:

```ts
// An entity must not have component A.
NOT(ComponentA);

// An entity must have component A, and must not have component B.
ALL(ComponentA, NOT(ComponentB));
```

#### Signature

```ts
NOT(components: AnyComponent | TagComponent | RawQuery): RawQuery;
```

#### Parameters

| Name         | Type                                                                                                                                                  | Description                          |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------- |
| `components` | [`AnyComponent`](lib_ecs_component.md#anycomponent) \| [`TagComponent`](lib_ecs_component.md#tagcomponent) \| [`RawQuery`](lib_ecs_query.md#rawquery) | The components or query to match to. |

#### Returns

[`RawQuery`](lib_ecs_query.md#rawquery)

Defined in: [src/lib/ecs/query.ts:83](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/query.ts#L83)
