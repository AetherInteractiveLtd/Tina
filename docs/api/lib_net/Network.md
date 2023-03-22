[@rbxts/tina](../modules.md) / [lib/net](../lib_net.md) / Network

# Network

## Index

### Namespaces

- [Method](Network/Method.md)

### Functions

- [registerEndpoints](Network.md#registerendpoints)
- [repository](Network.md#repository)

## Functions

### registerEndpoints()

Creates a new router, which can be accessed later on to work with your endpoints. This method **SHOULD** be used once.

#### Signature

```ts
registerEndpoints<T>(endpoints: T): RouterDeclaration<T>;
```

#### Type parameters

- `T` _extends_ [`EndpointsDeclaration`](../lib_net_types.md#endpointsdeclaration)\<[`BaseEndpoints`](../lib_net_types.md#baseendpoints)\>

#### Parameters

| Name        | Type | Description                 |
| :---------- | :--- | :-------------------------- |
| `endpoints` | `T`  | your endpoints declaration. |

#### Returns

[`RouterDeclaration`](../lib_net_classes_router_types.md#routerdeclaration)\<`T`\>

Defined in: [src/lib/net/index.ts:51](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/index.ts#L51)

---

### repository()

Creates a new repository for structuring your endpoints.

#### Signature

```ts
repository<T>(repository: T): RepositoryImplementation<T>;
```

#### Type parameters

- `T` _extends_ [`BaseRepository`](../lib_net_classes_repository_types.md#baserepository)

#### Parameters

| Name         | Type | Description      |
| :----------- | :--- | :--------------- |
| `repository` | `T`  | your repository. |

#### Returns

[`RepositoryImplementation`](../lib_net_classes_repository_types.md#repositoryimplementation)\<`T`\>

Defined in: [src/lib/net/index.ts:62](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/index.ts#L62)
