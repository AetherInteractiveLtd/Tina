[@rbxts/tina](modules.md) / lib/net/utilities/client

# lib/net/utilities/client

## Index

### Interfaces

- [export=](lib_net_utilities_client.md#export=)

### Variables

- [export=](lib_net_utilities_client.md#export=)

## Interfaces

### export=

#### Index

##### Properties

- [listen](lib_net_utilities_client.md#listen)
- [send](lib_net_utilities_client.md#send)

#### Properties

##### listen

> `Function`

###### Type declaration

Binds a callback for server's request.

####### Signature

```ts
(id: string, callback: Function): string;
```

####### Parameters

| Name       | Type                         | Description                                        |
| :--------- | :--------------------------- | :------------------------------------------------- |
| `id`       | `string`                     | endpoint's id.                                     |
| `callback` | (`value`: `never`) => `void` | being a function of type `(value: never) => void`. |

####### Returns

`string`

Defined in: [src/lib/net/utilities/client.d.ts:8](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/utilities/client.d.ts#L8)

##### send

> `Function`

###### Type declaration

Sends data over the network to the server.

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

Defined in: [src/lib/net/utilities/client.d.ts:16](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/utilities/client.d.ts#L16)

## Variables

### export=

> [`export=`](lib_net_utilities_client.md#export=)

Defined in: [src/lib/net/utilities/client.d.ts:1](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/utilities/client.d.ts#L1) [src/lib/net/utilities/client.d.ts:24](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/utilities/client.d.ts#L24)
