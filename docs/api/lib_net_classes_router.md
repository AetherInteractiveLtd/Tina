[@rbxts/tina](modules.md) / lib/net/classes/router

# lib/net/classes/router

## Index

### Classes

- [Router](lib_net_classes_router.md#router)

## Classes

### Router

Router class implementation for bootstrapping

#### Type parameters

- `T` _extends_ [`EndpointsDeclaration`](lib_net_types.md#endpointsdeclaration)\<[`BaseEndpoints`](lib_net_types.md#baseendpoints)\>

#### Implements

- [`RouterDeclaration`](lib_net_classes_router_types.md#routerdeclaration)\<`T`\>

#### Index

##### Constructors

- [constructor](lib_net_classes_router.md#constructor)

##### Properties

- [endpoints](lib_net_classes_router.md#endpoints)

##### Methods

- [dir](lib_net_classes_router.md#dir)

#### Constructors

#### constructor()

##### Signature

```ts
new Router<T>(endpoints: T): Router<T>;
```

##### Type parameters

- `T` _extends_ [`EndpointsDeclaration`](lib_net_types.md#endpointsdeclaration)\<[`BaseEndpoints`](lib_net_types.md#baseendpoints)\>

##### Parameters

| Name        | Type |
| :---------- | :--- |
| `endpoints` | `T`  |

##### Returns

[`Router`](lib_net_classes_router.md#router)\<`T`\>

Defined in: [src/lib/net/classes/router/index.ts:5](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/router/index.ts#L5)

#### Properties

##### endpoints

> **`Readonly`** `T`

Implementation of: RouterDeclaration.endpoints

Defined in: [src/lib/net/classes/router/index.ts:5](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/router/index.ts#L5)

#### Methods

##### dir()

Returns whatever it was stored within the specified directory.

###### Signature

```ts
dir<X>(path: X): T[X];
```

###### Type parameters

- `X` _extends_ `string` \| `number` \| `symbol`

###### Parameters

| Name   | Type | Description                                                                                                     |
| :----- | :--- | :-------------------------------------------------------------------------------------------------------------- |
| `path` | `X`  | as keyof T, should be an acceptable key of the dictionary passed with all the endpoints on `registerEndpoints`. |

###### Returns

`T`[`X`]

a directory or a Remote.

Implementation of: [RouterDeclaration](lib_net_classes_router_types.md#routerdeclaration).[dir](lib_net_classes_router_types.md#dir)

Defined in: [src/lib/net/classes/router/index.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/router/index.ts#L7)
