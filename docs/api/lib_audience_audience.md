[@rbxts/tina](modules.md) / lib/audience/audience

# lib/audience/audience

## Index

### Classes

- [Audience](lib_audience_audience.md#audience)

## Classes

### Audience

#### Implements

- [`AudienceDeclaration`](lib_audience_types.md#audiencedeclaration)

#### Index

##### Constructors

- [constructor](lib_audience_audience.md#constructor)

##### Methods

- [clean](lib_audience_audience.md#clean)
- [get](lib_audience_audience.md#get)
- [isEmpty](lib_audience_audience.md#isempty)
- [list](lib_audience_audience.md#list)

#### Constructors

#### constructor()

##### Signature

```ts
new Audience(): Audience;
```

##### Returns

[`Audience`](lib_audience_audience.md#audience)

#### Methods

##### clean()

Cleans/empties the audience list.

###### Signature

```ts
clean(): AudienceDeclaration;
```

###### Returns

[`AudienceDeclaration`](lib_audience_types.md#audiencedeclaration)

Implementation of: [AudienceDeclaration](lib_audience_types.md#audiencedeclaration).[clean](lib_audience_types.md#clean)

Defined in: [src/lib/audience/audience.ts:27](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/audience/audience.ts#L27)

##### get()

Returns the listed players.

###### Signature

```ts
get(): Player[];
```

###### Returns

`Player`[]

Implementation of: [AudienceDeclaration](lib_audience_types.md#audiencedeclaration).[get](lib_audience_types.md#get)

Defined in: [src/lib/audience/audience.ts:19](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/audience/audience.ts#L19)

##### isEmpty()

Returns whether the list of users is empty or not.

###### Signature

```ts
isEmpty(): boolean;
```

###### Returns

`boolean`

Implementation of: [AudienceDeclaration](lib_audience_types.md#audiencedeclaration).[isEmpty](lib_audience_types.md#isempty)

Defined in: [src/lib/audience/audience.ts:23](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/audience/audience.ts#L23)

##### list()

Lists the given users/players to an audience.

###### Signature

```ts
list(audience: Player[] | DefaultUserDeclaration[]): AudienceDeclaration;
```

###### Parameters

| Name       | Type                                                                                         | Description                 |
| :--------- | :------------------------------------------------------------------------------------------- | :-------------------------- |
| `audience` | `Player`[] \| [`DefaultUserDeclaration`](lib_user_default_types.md#defaultuserdeclaration)[] | a list of users or players. |

###### Returns

[`AudienceDeclaration`](lib_audience_types.md#audiencedeclaration)

Implementation of: [AudienceDeclaration](lib_audience_types.md#audiencedeclaration).[list](lib_audience_types.md#list)

Defined in: [src/lib/audience/audience.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/audience/audience.ts#L7)
