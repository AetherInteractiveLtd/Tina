[@rbxts/tina](modules.md) / lib/net/classes/methods/update/types

# lib/net/classes/methods/update/types

## Index

### Interfaces

- [UPDATEClientObjectImplementation](lib_net_classes_methods_update_types.md#updateclientobjectimplementation)
- [UPDATEServerObjectImplementation](lib_net_classes_methods_update_types.md#updateserverobjectimplementation)

### Type Aliases

- [UPDATEDeclaration](lib_net_classes_methods_update_types.md#updatedeclaration)

## Interfaces

### UPDATEClientObjectImplementation

#### Type parameters

- `T`

#### Index

##### Methods

- [when](lib_net_classes_methods_update_types.md#when)

#### Methods

##### when()

when returns an event listener used to bind actions to be called.

###### Client

###### Signature

```ts
when(): EventListener<[value: T]>;
```

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`value: T`]\>

an EventListener.

Defined in: [src/lib/net/classes/methods/update/types.d.ts:35](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/update/types.d.ts#L35)

---

### UPDATEServerObjectImplementation

#### Type parameters

- `T`

#### Index

##### Methods

- [send](lib_net_classes_methods_update_types.md#send)
- [sendAll](lib_net_classes_methods_update_types.md#sendall)

#### Methods

##### send()

UPDATE is a one-way method, which lets client listen for changes request from the server, client can't send any data back or send any packet at all.

###### Example

```
NET.get("core").path("networkObject").send(...);
```

###### Server

###### Signature

```ts
send(to: Player | AudienceDeclaration, toSend: T): void;
```

###### Parameters

| Name     | Type                                                                           | Description                                                 |
| :------- | :----------------------------------------------------------------------------- | :---------------------------------------------------------- |
| `to`     | `Player` \| [`AudienceDeclaration`](lib_audience_types.md#audiencedeclaration) | should be an audience with listed users, or a player array. |
| `toSend` | `T`                                                                            | should be the value described when declaring the method.    |

###### Returns

`void`

Defined in: [src/lib/net/classes/methods/update/types.d.ts:17](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/update/types.d.ts#L17)

##### sendAll()

Used as a short-hand for sending to all players.

###### Server

###### Signature

```ts
sendAll(value: T): void;
```

###### Parameters

| Name    | Type | Description                                              |
| :------ | :--- | :------------------------------------------------------- |
| `value` | `T`  | should be the value described when declaring the method. |

###### Returns

`void`

Defined in: [src/lib/net/classes/methods/update/types.d.ts:25](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/update/types.d.ts#L25)

## Type Aliases

### UPDATEDeclaration

> \<`T`\> [`UPDATEServerObjectImplementation`](lib_net_classes_methods_update_types.md#updateserverobjectimplementation)\<`T`\> & [`UPDATEClientObjectImplementation`](lib_net_classes_methods_update_types.md#updateclientobjectimplementation)\<`T`\>

#### Type parameters

- `T`

Defined in: [src/lib/net/classes/methods/update/types.d.ts:38](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/update/types.d.ts#L38)
