[@rbxts/tina](modules.md) / lib/net/classes/methods/get/types

# lib/net/classes/methods/get/types

## Index

### Interfaces

- [GETClientObjectImplementation](lib_net_classes_methods_get_types.md#getclientobjectimplementation)
- [GETServerObjectImplementation](lib_net_classes_methods_get_types.md#getserverobjectimplementation)

### Type Aliases

- [GETDeclaration](lib_net_classes_methods_get_types.md#getdeclaration)

## Interfaces

### GETClientObjectImplementation

#### Type parameters

- `S`
- `R`

#### Index

##### Methods

- [get](lib_net_classes_methods_get_types.md#get)
- [send](lib_net_classes_methods_get_types.md#send)
- [when](lib_net_classes_methods_get_types.md#when)

#### Methods

##### get()

Used to retrieve data without caring about any data required to be sent.

###### Example

```
NET.get("core").path("networkObject").get(); // The events emit is done here.
```

###### Client

###### Signature

```ts
get(): void;
```

###### Returns

`void`

Defined in: [src/lib/net/classes/methods/get/types.d.ts:43](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/get/types.d.ts#L43)

##### send()

You can send data for the server to manipulate it/use it, and send it back if needed with `.send()`. If you just want to retrieve data, use `.get()` instead.

###### Example

```
NET.get("core").path("networkObject").send(value: S); // The events emit is done here.
```

###### Client

###### Signature

```ts
send(toSend: S): void;
```

###### Parameters

| Name     | Type | Description                                |
| :------- | :--- | :----------------------------------------- |
| `toSend` | `S`  | should be the value to send to the server. |

###### Returns

`void`

Defined in: [src/lib/net/classes/methods/get/types.d.ts:31](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/get/types.d.ts#L31)

##### when()

Returns an event listener used to bind actions to be called. When used on a GETTER, the functions binded are invoked whenever `.get()` or `.send()`
are invoked as well. The returning value from the reply bind (if there's any), will be the first parameter of the do's functions.

###### Example

```
NET.get("core").path("networkObject).when().do((value: R) => { ... });
```

###### Client

###### Signature

```ts
when(): EventListener<[value: R]>;
```

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`value: R`]\>

an EventListener.

Defined in: [src/lib/net/classes/methods/get/types.d.ts:57](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/get/types.d.ts#L57)

---

### GETServerObjectImplementation

#### Type parameters

- `R`
- `S`

#### Index

##### Methods

- [reply](lib_net_classes_methods_get_types.md#reply)

#### Methods

##### reply()

Should be the callback defined on the declaration.

###### Example

```
NET.get("core").path("networkObject").reply((user: never, ...args: [n: number]) => { ... });
```

###### Server

###### Signature

```ts
reply(func: Function): void;
```

###### Parameters

| Name   | Type                                                                                                        | Description                                                                                                                          |
| :----- | :---------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `func` | (`user`: [`DefaultUserDeclaration`](lib_user_default_types.md#defaultuserdeclaration), `value`: `R`) => `S` | should describe the listener function to add as a callback for the reply, the return type is the expected type at the receiving end. |

###### Returns

`void`

Defined in: [src/lib/net/classes/methods/get/types.d.ts:16](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/get/types.d.ts#L16)

## Type Aliases

### GETDeclaration

> \<`S`, `R`\> [`GETServerObjectImplementation`](lib_net_classes_methods_get_types.md#getserverobjectimplementation)\<`S`, `R`\> & [`GETClientObjectImplementation`](lib_net_classes_methods_get_types.md#getclientobjectimplementation)\<`S`, `R`\>

#### Type parameters

- `S`
- `R`

Defined in: [src/lib/net/classes/methods/get/types.d.ts:60](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/get/types.d.ts#L60)
