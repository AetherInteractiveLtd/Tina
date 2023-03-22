[@rbxts/tina](modules.md) / lib/ecs/collections/archetype

# lib/ecs/collections/archetype

## Index

### Classes

- [Archetype](lib_ecs_collections_archetype.md#archetype)

## Classes

### Archetype

An archetype is a collection of components that are stored contiguously in
memory. Archetypes are used to optimize entity iteration.

Internally, the archetype stores any entity that has the same set of
components, e.g. all entities with both a position and a velocity component.
Entities that just have a position component will be stored in a different
archetype.

#### Index

##### Constructors

- [constructor](lib_ecs_collections_archetype.md#constructor)

##### Properties

- [change](lib_ecs_collections_archetype.md#change)
- [entities](lib_ecs_collections_archetype.md#entities)
- [mask](lib_ecs_collections_archetype.md#mask)
- [queries](lib_ecs_collections_archetype.md#queries)
- [sparseSet](lib_ecs_collections_archetype.md#sparseset)

##### Methods

- [has](lib_ecs_collections_archetype.md#has)

#### Constructors

#### constructor()

##### Signature

```ts
new Archetype(mask: number[]): Archetype;
```

##### Parameters

| Name   | Type       |
| :----- | :--------- |
| `mask` | `number`[] |

##### Returns

[`Archetype`](lib_ecs_collections_archetype.md#archetype)

Defined in: [src/lib/ecs/collections/archetype.ts:27](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/archetype.ts#L27)

#### Properties

##### change

> [`Archetype`](lib_ecs_collections_archetype.md#archetype)[] = `[]`

Defined in: [src/lib/ecs/collections/archetype.ts:19](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/archetype.ts#L19)

##### entities

> **`Readonly`** `number`[]

All entities that belong to this archetype.

Defined in: [src/lib/ecs/collections/archetype.ts:16](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/archetype.ts#L16)

##### mask

> `number`[]

The type of the archetype denoted by all its relevant components.

Defined in: [src/lib/ecs/collections/archetype.ts:23](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/archetype.ts#L23)

##### queries

> [`Query`](lib_ecs_query.md#query)[] = `[]`

All queries that are interested in this archetype.

Defined in: [src/lib/ecs/collections/archetype.ts:25](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/archetype.ts#L25)

##### sparseSet

> **`Readonly`** [`SparseSet`](lib_ecs_collections_sparse_set.md#sparseset)

Defined in: [src/lib/ecs/collections/archetype.ts:17](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/archetype.ts#L17)

#### Methods

##### has()

Checks if the archetype contains a given entityId

###### Signature

```ts
has(id: number): boolean;
```

###### Parameters

| Name | Type     | Description                   |
| :--- | :------- | :---------------------------- |
| `id` | `number` | The id of the entity to check |

###### Returns

`boolean`

True if the entity is in the archetype

Defined in: [src/lib/ecs/collections/archetype.ts:38](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/archetype.ts#L38)
