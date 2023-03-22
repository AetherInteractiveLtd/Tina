[@rbxts/tina](modules.md) / lib/net/classes/methods/post/types

# lib/net/classes/methods/post/types

## Index

### Interfaces

- [POSTClientObjectImplementation](lib_net_classes_methods_post_types.md#postclientobjectimplementation)
- [POSTServerObjectImplementation](lib_net_classes_methods_post_types.md#postserverobjectimplementation)

### Type Aliases

- [POSTDeclaration](lib_net_classes_methods_post_types.md#postdeclaration)

## Interfaces

### POSTClientObjectImplementation

#### Type parameters

- `T`

#### Index

##### Methods

- [send](lib_net_classes_methods_post_types.md#send)

#### Methods

##### send()

POST is a one-way method, which lets client send requests of change to the server, server won't be able to send any data back.

###### Client

###### Signature

```ts
send(toSend: T): void;
```

###### Parameters

| Name     | Type | Description                                                              |
| :------- | :--- | :----------------------------------------------------------------------- |
| `toSend` | `T`  | should be the arguments described before hand when creating the objects. |

###### Returns

`void`

Defined in: [src/lib/net/classes/methods/post/types.d.ts:21](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/post/types.d.ts#L21)

---

### POSTServerObjectImplementation

#### Type parameters

- `T`

#### Index

##### Methods

- [when](lib_net_classes_methods_post_types.md#when)

#### Methods

##### when()

when returns an event listener used to bind actions to be called.

###### Server

###### Signature

```ts
when(): EventListener<[user: never, value: T]>;
```

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`user: never`, `value: T`]\>

an EventListener with the first parameter being the user and the args passed to the declaration.

Defined in: [src/lib/net/classes/methods/post/types.d.ts:11](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/post/types.d.ts#L11)

## Type Aliases

### POSTDeclaration

> \<`T`\> [`POSTServerObjectImplementation`](lib_net_classes_methods_post_types.md#postserverobjectimplementation)\<`T`\> & [`POSTClientObjectImplementation`](lib_net_classes_methods_post_types.md#postclientobjectimplementation)\<`T`\>

#### Type parameters

- `T`

Defined in: [src/lib/net/classes/methods/post/types.d.ts:24](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/post/types.d.ts#L24)
