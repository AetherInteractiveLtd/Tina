[@rbxts/tina](modules.md) / lib/net/utilities/server

# lib/net/utilities/server

## Index

### Interfaces

- [export=](lib_net_utilities_server.md#export=)

### Variables

- [export=](lib_net_utilities_server.md#export=)

## Interfaces

### export=

#### Index

##### Properties

- [listen](lib_net_utilities_server.md#listen)
- [send](lib_net_utilities_server.md#send)
- [sendAll](lib_net_utilities_server.md#sendall)
- [sendAllExcept](lib_net_utilities_server.md#sendallexcept)

#### Properties

##### listen

> `Function`

###### Type declaration

Binds a callback for client's request.

####### Signature

```ts
(id: string, callback: Function): string;
```

####### Parameters

| Name       | Type                                             | Description                                                        |
| :--------- | :----------------------------------------------- | :----------------------------------------------------------------- |
| `id`       | `string`                                         | endpoint's id.                                                     |
| `callback` | (`player`: `Player`, `value`: `never`) => `void` | being a function of type `(player: Player, value: never) => void`. |

####### Returns

`string`

Defined in: [src/lib/net/utilities/server.d.ts:8](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/utilities/server.d.ts#L8)

##### send

> `Function`

###### Type declaration

Sends data over the network to the client.

####### Signature

```ts
<T>(id: string, to: Player[], contents: T): void;
```

####### Type parameters

- `T` _extends_ \{}

####### Parameters

| Name       | Type       | Description    |
| :--------- | :--------- | :------------- |
| `id`       | `string`   | endpoint's id. |
| `to`       | `Player`[] | -              |
| `contents` | `T`        | -              |

####### Returns

`void`

Defined in: [src/lib/net/utilities/server.d.ts:16](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/utilities/server.d.ts#L16)

##### sendAll

> `Function`

###### Type declaration

Sends data over the network to all the connected clients.

####### Signature

```ts
<T>(id: string, value: T): void;
```

####### Type parameters

- `T`

####### Parameters

| Name    | Type     | Description                                      |
| :------ | :------- | :----------------------------------------------- |
| `id`    | `string` | endpoint's id.                                   |
| `value` | `T`      | of type `T` described previously on declaration. |

####### Returns

`void`

Defined in: [src/lib/net/utilities/server.d.ts:24](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/utilities/server.d.ts#L24)

##### sendAllExcept

> `Function`

###### Type declaration

Sends data over the network to all the non-blacklisted clients.

####### Signature

```ts
<T>(id: string, blacklist: Player[], value: T): void;
```

####### Type parameters

- `T`

####### Parameters

| Name        | Type       | Description                                      |
| :---------- | :--------- | :----------------------------------------------- |
| `id`        | `string`   | endpoint's id.                                   |
| `blacklist` | `Player`[] | should be an array of players to blacklist.      |
| `value`     | `T`        | of type `T` described previously on declaration. |

####### Returns

`void`

Defined in: [src/lib/net/utilities/server.d.ts:33](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/utilities/server.d.ts#L33)

## Variables

### export=

> [`export=`](lib_net_utilities_server.md#export=)

Defined in: [src/lib/net/utilities/server.d.ts:1](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/utilities/server.d.ts#L1) [src/lib/net/utilities/server.d.ts:41](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/utilities/server.d.ts#L41)
