[@rbxts/tina](modules.md) / lib/user/default/client

# lib/user/default/client

## Index

### Classes

- [ClientUser](lib_user_default_client.md#clientuser)

## Classes

### ClientUser

#### Implements

- [`ClientUserImplementation`](lib_user_default_client_types.md#clientuserimplementation)

#### Index

##### Constructors

- [constructor](lib_user_default_client.md#constructor)

##### Properties

- [player](lib_user_default_client.md#player)

##### Methods

- [move](lib_user_default_client.md#move)

#### Constructors

#### constructor()

##### Signature

```ts
new ClientUser(player: Player = Players.LocalPlayer): ClientUser;
```

##### Parameters

| Name     | Type     | Default value         |
| :------- | :------- | :-------------------- |
| `player` | `Player` | `Players.LocalPlayer` |

##### Returns

[`ClientUser`](lib_user_default_client.md#clientuser)

Defined in: [src/lib/user/default/client/index.ts:6](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/client/index.ts#L6)

#### Properties

##### player

> `Player` = `Players.LocalPlayer`

Implementation of: [ClientUserImplementation](lib_user_default_client_types.md#clientuserimplementation).[player](lib_user_default_client_types.md#player)

Defined in: [src/lib/user/default/client/index.ts:6](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/client/index.ts#L6)

#### Methods

##### move()

Sets a character CFrame to the provided CFrame/BasePart's CFrame.

###### Client

###### Signature

```ts
move(to: CFrame | BasePart): void;
```

###### Parameters

| Name | Type                   | Description                                                    |
| :--- | :--------------------- | :------------------------------------------------------------- |
| `to` | `CFrame` \| `BasePart` | the CFrame or BasePart where the character should be moved to. |

###### Returns

`void`

Implementation of: [ClientUserImplementation](lib_user_default_client_types.md#clientuserimplementation).[move](lib_user_default_client_types.md#move)

Defined in: [src/lib/user/default/client/index.ts:8](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/client/index.ts#L8)
