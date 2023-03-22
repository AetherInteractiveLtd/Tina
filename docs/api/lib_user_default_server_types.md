[@rbxts/tina](modules.md) / lib/user/default/server/types

# lib/user/default/server/types

## Index

### Interfaces

- [FriendPage](lib_user_default_server_types.md#friendpage)
- [ServerUserImplementation](lib_user_default_server_types.md#serveruserimplementation)

## Interfaces

### FriendPage

#### Index

##### Properties

- [AvatarFinal](lib_user_default_server_types.md#avatarfinal)
- [AvatarUri](lib_user_default_server_types.md#avataruri)
- [Id](lib_user_default_server_types.md#id)
- [IsOnline](lib_user_default_server_types.md#isonline)
- [Username](lib_user_default_server_types.md#username)

#### Properties

##### AvatarFinal

> `boolean`

Defined in: [src/lib/user/default/server/types.d.ts:2](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/types.d.ts#L2)

##### AvatarUri

> `string`

Defined in: [src/lib/user/default/server/types.d.ts:3](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/types.d.ts#L3)

##### Id

> `number`

Defined in: [src/lib/user/default/server/types.d.ts:4](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/types.d.ts#L4)

##### IsOnline

> `boolean`

Defined in: [src/lib/user/default/server/types.d.ts:6](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/types.d.ts#L6)

##### Username

> `string`

Defined in: [src/lib/user/default/server/types.d.ts:5](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/types.d.ts#L5)

---

### ServerUserImplementation

#### Index

##### Properties

- [player](lib_user_default_server_types.md#player)

##### Methods

- [friends](lib_user_default_server_types.md#friends)
- [friendsInServer](lib_user_default_server_types.md#friendsinserver)
- [teleport](lib_user_default_server_types.md#teleport)

#### Properties

##### player

> `Player`

Defined in: [src/lib/user/default/server/types.d.ts:10](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/types.d.ts#L10)

#### Methods

##### friends()

Retrieves a user's friends.

###### Server

###### Signature

```ts
friends(onlineOnly?: boolean): Promise<Map<string, FriendPage>>;
```

###### Parameters

| Name          | Type      | Description                                      |
| :------------ | :-------- | :----------------------------------------------- |
| `onlineOnly?` | `boolean` | if set to true, will only return friends online. |

###### Returns

`Promise`\<`Map`\<`string`, [`FriendPage`](lib_user_default_server_types.md#friendpage)\>\>

Defined in: [src/lib/user/default/server/types.d.ts:19](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/types.d.ts#L19)

##### friendsInServer()

Retrieves friends who are connected within the user's server.

###### Server

###### Signature

```ts
friendsInServer(): Promise<Map<string, FriendPage>>;
```

###### Returns

`Promise`\<`Map`\<`string`, [`FriendPage`](lib_user_default_server_types.md#friendpage)\>\>

Defined in: [src/lib/user/default/server/types.d.ts:26](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/types.d.ts#L26)

##### teleport()

Teleports a user to the given place id.

###### Server

###### Signature

```ts
teleport(placeId: number, options?: TeleportOptions): Promise<TeleportAsyncResult>;
```

###### Parameters

| Name       | Type              | Description                               |
| :--------- | :---------------- | :---------------------------------------- |
| `placeId`  | `number`          | the place id.                             |
| `options?` | `TeleportOptions` | TeleportOptions, optional (pun intended). |

###### Returns

`Promise`\<`TeleportAsyncResult`\>

Defined in: [src/lib/user/default/server/types.d.ts:37](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/types.d.ts#L37)
