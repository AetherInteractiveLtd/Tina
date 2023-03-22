[@rbxts/tina](modules.md) / lib/net/classes/repository

# lib/net/classes/repository

## Index

### Classes

- [Repository](lib_net_classes_repository.md#repository)

## Classes

### Repository

#### Type parameters

- `T` _extends_ [`BaseRepository`](lib_net_classes_repository_types.md#baserepository)

#### Implements

- [`RepositoryImplementation`](lib_net_classes_repository_types.md#repositoryimplementation)\<`T`\>

#### Index

##### Constructors

- [constructor](lib_net_classes_repository.md#constructor)

##### Properties

- [repository](lib_net_classes_repository.md#repository)

##### Methods

- [developmentOnly](lib_net_classes_repository.md#developmentonly)
- [path](lib_net_classes_repository.md#path)

#### Constructors

#### constructor()

##### Signature

```ts
new Repository<T>(repository: T): Repository<T>;
```

##### Type parameters

- `T` _extends_ [`BaseRepository`](lib_net_classes_repository_types.md#baserepository)

##### Parameters

| Name         | Type |
| :----------- | :--- |
| `repository` | `T`  |

##### Returns

[`Repository`](lib_net_classes_repository.md#repository)\<`T`\>

Defined in: [src/lib/net/classes/repository/index.ts:4](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/repository/index.ts#L4)

#### Properties

##### repository

> **`Readonly`** `T`

Implementation of: RepositoryImplementation.repository

Defined in: [src/lib/net/classes/repository/index.ts:4](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/repository/index.ts#L4)

#### Methods

##### developmentOnly()

###### Signature

```ts
developmentOnly(): RepositoryImplementation<T>;
```

###### Returns

[`RepositoryImplementation`](lib_net_classes_repository_types.md#repositoryimplementation)\<`T`\>

Implementation of: RepositoryImplementation.developmentOnly

Defined in: [src/lib/net/classes/repository/index.ts:10](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/repository/index.ts#L10)

##### path()

Navigates to the closest subdirectory with that name if it exists.

###### Signature

```ts
path<X>(pathTo: X): T[X];
```

###### Type parameters

- `X` _extends_ `string` \| `number` \| `symbol`

###### Parameters

| Name     | Type |
| :------- | :--- |
| `pathTo` | `X`  |

###### Returns

`T`[`X`]

it can be an Endpoint or another directory.

Implementation of: [RepositoryImplementation](lib_net_classes_repository_types.md#repositoryimplementation).[path](lib_net_classes_repository_types.md#path)

Defined in: [src/lib/net/classes/repository/index.ts:6](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/repository/index.ts#L6)
