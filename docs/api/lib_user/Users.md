[@rbxts/tina](../modules.md) / [lib/user](../lib_user.md) / Users

# Users

## Index

### Variables

- [tina_user_class](Users.md#tina_user_class)

### Functions

- [get](Users.md#get)
- [set](Users.md#set)

## Variables

### tina_user_class

> `Function`

#### Type declaration

##### Signature

```ts
(ref: Player | number): DefaultUserDeclaration;
```

##### Parameters

| Name  | Type                 |
| :---- | :------------------- |
| `ref` | `Player` \| `number` |

##### Returns

[`DefaultUserDeclaration`](../lib_user_default_types.md#defaultuserdeclaration)

Defined in: [src/lib/user/index.ts:9](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/index.ts#L9)

## Functions

### get()

Used to retrieve a player's user, in-game at that moment.

#### Signature

```ts
get(from: number | Player): DefaultUserDeclaration;
```

#### Parameters

| Name   | Type                 | Description                                              |
| :----- | :------------------- | :------------------------------------------------------- |
| `from` | `number` \| `Player` | a player or a number used to retrieve the player's user. |

#### Returns

[`DefaultUserDeclaration`](../lib_user_default_types.md#defaultuserdeclaration)

a User object constructed from your defined User class.

Defined in: [src/lib/user/index.ts:29](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/index.ts#L29)

---

### set()

Used to add user-created Users.

#### Signature

```ts
set(player: Player, user: DefaultUserDeclaration): void;
```

#### Parameters

| Name     | Type                                                                            | Description        |
| :------- | :------------------------------------------------------------------------------ | :----------------- |
| `player` | `Player`                                                                        | a Player Instance. |
| `user`   | [`DefaultUserDeclaration`](../lib_user_default_types.md#defaultuserdeclaration) | a User object.     |

#### Returns

`void`

Defined in: [src/lib/user/index.ts:59](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/index.ts#L59)
