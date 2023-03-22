[@rbxts/tina](modules.md) / lib/audience/types

# lib/audience/types

## Index

### Interfaces

- [AudienceDeclaration](lib_audience_types.md#audiencedeclaration)

## Interfaces

### AudienceDeclaration

#### Index

##### Methods

- [clean](lib_audience_types.md#clean)
- [get](lib_audience_types.md#get)
- [isEmpty](lib_audience_types.md#isempty)
- [list](lib_audience_types.md#list)

#### Methods

##### clean()

Cleans/empties the audience list.

###### Signature

```ts
clean(): AudienceDeclaration;
```

###### Returns

[`AudienceDeclaration`](lib_audience_types.md#audiencedeclaration)

Defined in: [src/lib/audience/types.d.ts:24](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/audience/types.d.ts#L24)

##### get()

Returns the listed players.

###### Signature

```ts
get(): Player[];
```

###### Returns

`Player`[]

Defined in: [src/lib/audience/types.d.ts:14](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/audience/types.d.ts#L14)

##### isEmpty()

Returns whether the list of users is empty or not.

###### Signature

```ts
isEmpty(): boolean;
```

###### Returns

`boolean`

Defined in: [src/lib/audience/types.d.ts:19](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/audience/types.d.ts#L19)

##### list()

Lists the given users/players to an audience.

###### Signature

```ts
list(users: Player[] | DefaultUserDeclaration[]): AudienceDeclaration;
```

###### Parameters

| Name    | Type                                                                                         | Description                 |
| :------ | :------------------------------------------------------------------------------------------- | :-------------------------- |
| `users` | `Player`[] \| [`DefaultUserDeclaration`](lib_user_default_types.md#defaultuserdeclaration)[] | a list of users or players. |

###### Returns

[`AudienceDeclaration`](lib_audience_types.md#audiencedeclaration)

Defined in: [src/lib/audience/types.d.ts:9](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/audience/types.d.ts#L9)
