[@rbxts/tina](modules.md) / lib/ecs/collections/sparse-set

# lib/ecs/collections/sparse-set

## Index

### Classes

- [SparseSet](lib_ecs_collections_sparse_set.md#sparseset)

## Classes

### SparseSet

A sparse set is a specialized data structure for representing a set of
integers. It can be useful in some very narrow and specific cases, namely
when the universe of possible values is very large but used very sparingly
and the set is iterated often or cleared often.

The sparse set will grow as needed to accommodate any values added.

#### Index

##### Constructors

- [constructor](lib_ecs_collections_sparse_set.md#constructor)

##### Properties

- [dense](lib_ecs_collections_sparse_set.md#dense)
- [sparse](lib_ecs_collections_sparse_set.md#sparse)

##### Methods

- [add](lib_ecs_collections_sparse_set.md#add)
- [has](lib_ecs_collections_sparse_set.md#has)
- [remove](lib_ecs_collections_sparse_set.md#remove)

#### Constructors

#### constructor()

##### Signature

```ts
new SparseSet(): SparseSet;
```

##### Returns

[`SparseSet`](lib_ecs_collections_sparse_set.md#sparseset)

#### Properties

##### dense

> `number`[] = `[]`

The elements stored in the sparse set.

Defined in: [src/lib/ecs/collections/sparse-set.ts:11](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/sparse-set.ts#L11)

##### sparse

> `number`[] = `[]`

An array that maps the set's items to their indices in the dense.

Defined in: [src/lib/ecs/collections/sparse-set.ts:13](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/sparse-set.ts#L13)

#### Methods

##### add()

Adds the given element to the set.

###### Signature

```ts
add(x: number): void;
```

###### Parameters

| Name | Type     | Description         |
| :--- | :------- | :------------------ |
| `x`  | `number` | The element to add. |

###### Returns

`void`

Defined in: [src/lib/ecs/collections/sparse-set.ts:19](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/sparse-set.ts#L19)

##### has()

Checks if the given element is in the set.

###### Signature

```ts
has(x: number): boolean;
```

###### Parameters

| Name | Type     | Description           |
| :--- | :------- | :-------------------- |
| `x`  | `number` | The element to check. |

###### Returns

`boolean`

`true` if the element is in the set

Defined in: [src/lib/ecs/collections/sparse-set.ts:34](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/sparse-set.ts#L34)

##### remove()

Removes the given element from the set.

###### Signature

```ts
remove(x: number): void;
```

###### Parameters

| Name | Type     | Description            |
| :--- | :------- | :--------------------- |
| `x`  | `number` | The element to remove. |

###### Returns

`void`

Defined in: [src/lib/ecs/collections/sparse-set.ts:43](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/collections/sparse-set.ts#L43)
