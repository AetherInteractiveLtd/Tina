[@rbxts/tina](modules.md) / lib/net/classes/router/types

# lib/net/classes/router/types

## Index

### Interfaces

- [RouterDeclaration](lib_net_classes_router_types.md#routerdeclaration)

## Interfaces

### RouterDeclaration

Router class implementation for bootstrapping

#### Type parameters

- `T` _extends_ [`BaseEndpoints`](lib_net_types.md#baseendpoints)

#### Index

##### Methods

- [dir](lib_net_classes_router_types.md#dir)

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

Defined in: [src/lib/net/classes/router/types.d.ts:18](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/router/types.d.ts#L18)
