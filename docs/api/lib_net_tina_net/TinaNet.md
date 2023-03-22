[@rbxts/tina](../modules.md) / [lib/net/tina_net](../lib_net_tina_net.md) / TinaNet

# TinaNet

## Index

### Functions

- [getExposed](TinaNet.md#getexposed)
- [getInternal](TinaNet.md#getinternal)
- [getRouter](TinaNet.md#getrouter)
- [setRouter](TinaNet.md#setrouter)

## Functions

### getExposed()

#### Signature

```ts
getExposed<T, U>(route: T): U;
```

#### Type parameters

- `T` _extends_ keyof [`Exposed`](../lib_net_tina_net_types.md#exposed)
- `U` _extends_ [`UPDATEServerObjectImplementation`](../lib_net_classes_methods_update_types.md#updateserverobjectimplementation)\<[`DefaultUserDeclaration`](../lib_user_default_types.md#defaultuserdeclaration), `U`\> & [`UPDATEClientObjectImplementation`](../lib_net_classes_methods_update_types.md#updateclientobjectimplementation)\<[`DefaultUserDeclaration`](../lib_user_default_types.md#defaultuserdeclaration), `U`\>

#### Parameters

| Name    | Type |
| :------ | :--- |
| `route` | `T`  |

#### Returns

`U`

Defined in: [src/lib/net/tina_net/index.ts:27](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/tina_net/index.ts#L27)

---

### getInternal()

#### Signature

```ts
getInternal<T, U>(route: T): U;
```

#### Type parameters

- `T` _extends_ `"user:get"`
- `U` _extends_ [`GETServerObjectImplementation`](../lib_net_classes_methods_get_types.md#getserverobjectimplementation)\<`undefined`, [`DefaultUserDeclaration`](../lib_user_default_types.md#defaultuserdeclaration), `U`\> & [`GETClientObjectImplementation`](../lib_net_classes_methods_get_types.md#getclientobjectimplementation)\<`undefined`, [`DefaultUserDeclaration`](../lib_user_default_types.md#defaultuserdeclaration), `U`\>

#### Parameters

| Name    | Type |
| :------ | :--- |
| `route` | `T`  |

#### Returns

`U`

Defined in: [src/lib/net/tina_net/index.ts:33](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/tina_net/index.ts#L33)

---

### getRouter()

#### Signature

```ts
getRouter<T>(routerType: T): T extends "internal" ? typeof internalRouter : typeof exposedRouter;
```

#### Type parameters

- `T` _extends_ `"internal"` \| `"exposed"`

#### Parameters

| Name         | Type |
| :----------- | :--- |
| `routerType` | `T`  |

#### Returns

`T` _extends_ `"internal"` ? _typeof_ `internalRouter` : _typeof_ `exposedRouter`

Defined in: [src/lib/net/tina_net/index.ts:21](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/tina_net/index.ts#L21)

---

### setRouter()

#### Signature

```ts
setRouter<T>(routerType: T, routerDesc: T extends "internal" ? InternalEndpoints : ExposedEndpoints): void;
```

#### Type parameters

- `T` _extends_ `"internal"` \| `"exposed"`

#### Parameters

| Name         | Type                                                                                                                                                                     |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `routerType` | `T`                                                                                                                                                                      |
| `routerDesc` | `T` _extends_ `"internal"` ? [`InternalEndpoints`](../lib_net_tina_net_types.md#internalendpoints) : [`ExposedEndpoints`](../lib_net_tina_net_types.md#exposedendpoints) |

#### Returns

`void`

Defined in: [src/lib/net/tina_net/index.ts:10](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/tina_net/index.ts#L10)
