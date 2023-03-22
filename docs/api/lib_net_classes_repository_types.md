[@rbxts/tina](modules.md) / lib/net/classes/repository/types

# lib/net/classes/repository/types

## Index

### Interfaces

- [BaseRepository](lib_net_classes_repository_types.md#baserepository)
- [RepositoryImplementation](lib_net_classes_repository_types.md#repositoryimplementation)

## Interfaces

### BaseRepository

---

### RepositoryImplementation

#### Type parameters

- `T` _extends_ [`BaseRepository`](lib_net_classes_repository_types.md#baserepository)

#### Index

##### Methods

- [path](lib_net_classes_repository_types.md#path)

#### Methods

##### path()

Navigates to the closest subdirectory with that name if it exists.

###### Signature

```ts
path<X>(event: X): T[X];
```

###### Type parameters

- `X` _extends_ `string` \| `number` \| `symbol`

###### Parameters

| Name    | Type |
| :------ | :--- |
| `event` | `X`  |

###### Returns

`T`[`X`]

it can be an Endpoint or another directory.

Defined in: [src/lib/net/classes/repository/types.d.ts:15](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/repository/types.d.ts#L15)
