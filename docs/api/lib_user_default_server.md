[@rbxts/tina](modules.md) / lib/user/default/server

# lib/user/default/server

## Index

### Classes

- [ServerUser](lib_user_default_server.md#serveruser)

## Classes

### ServerUser

#### Implements

- [`ServerUserImplementation`](lib_user_default_server_types.md#serveruserimplementation)

#### Index

##### Constructors

- [constructor](lib_user_default_server.md#constructor)

##### Properties

- [player](lib_user_default_server.md#player)

##### Methods

- [friends](lib_user_default_server.md#friends)
- [friendsInServer](lib_user_default_server.md#friendsinserver)
- [teleport](lib_user_default_server.md#teleport)

#### Constructors

#### constructor()

##### Signature

```ts
new ServerUser(ref: number | Player): ServerUser;
```

##### Parameters

| Name  | Type                 |
| :---- | :------------------- |
| `ref` | `number` \| `Player` |

##### Returns

[`ServerUser`](lib_user_default_server.md#serveruser)

Defined in: [src/lib/user/default/server/index.ts:8](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/index.ts#L8)

#### Properties

##### player

> `Player`

Implementation of: [ServerUserImplementation](lib_user_default_server_types.md#serveruserimplementation).[player](lib_user_default_server_types.md#player)

Defined in: [src/lib/user/default/server/index.ts:6](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/index.ts#L6)

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

Implementation of: [ServerUserImplementation](lib_user_default_server_types.md#serveruserimplementation).[friends](lib_user_default_server_types.md#friends)

Defined in: [src/lib/user/default/server/index.ts:16](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/index.ts#L16)

##### friendsInServer()

Retrieves friends who are connected within the user's server.

###### Server

###### Signature

```ts
friendsInServer(): Promise<Map<string, FriendPage>>;
```

###### Returns

`Promise`\<`Map`\<`string`, [`FriendPage`](lib_user_default_server_types.md#friendpage)\>\>

Implementation of: [ServerUserImplementation](lib_user_default_server_types.md#serveruserimplementation).[friendsInServer](lib_user_default_server_types.md#friendsinserver)

Defined in: [src/lib/user/default/server/index.ts:46](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/index.ts#L46)

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

Implementation of: [ServerUserImplementation](lib_user_default_server_types.md#serveruserimplementation).[teleport](lib_user_default_server_types.md#teleport)

Defined in: [src/lib/user/default/server/index.ts:75](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/server/index.ts#L75)
