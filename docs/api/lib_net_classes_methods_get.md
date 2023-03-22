[@rbxts/tina](modules.md) / lib/net/classes/methods/get

# lib/net/classes/methods/get

## Index

### Classes

- [GetEndpoint](lib_net_classes_methods_get.md#getendpoint)

## Classes

### GetEndpoint

#### Type parameters

- `S`
- `R`

#### Hierarchy

- [`AbstractEndpoint`](lib_net_classes_methods_endpoint_endpoint.md#abstractendpoint).**GetEndpoint**

#### Implements

- [`GETDeclaration`](lib_net_classes_methods_get_types.md#getdeclaration)\<`S`, `R`\>

#### Index

##### Constructors

- [constructor](lib_net_classes_methods_get.md#constructor)

##### Properties

- [id](lib_net_classes_methods_get.md#id)

##### Methods

- [get](lib_net_classes_methods_get.md#get)
- [getIdentifier](lib_net_classes_methods_get.md#getidentifier)
- [reply](lib_net_classes_methods_get.md#reply)
- [send](lib_net_classes_methods_get.md#send)
- [when](lib_net_classes_methods_get.md#when)

#### Constructors

#### constructor()

##### Signature

```ts
new GetEndpoint<S, R>(): GetEndpoint<S, R>;
```

##### Type parameters

- `S`
- `R`

##### Returns

[`GetEndpoint`](lib_net_classes_methods_get.md#getendpoint)\<`S`, `R`\>

Inherited from: [AbstractEndpoint](lib_net_classes_methods_endpoint_endpoint.md#abstractendpoint).[constructor](lib_net_classes_methods_endpoint_endpoint.md#constructor)

Defined in: [src/lib/net/classes/methods/endpoint/endpoint.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/endpoint/endpoint.ts#L7)

#### Properties

##### id

> **`Protected`** **`Readonly`** `string`

Inherited from: [AbstractEndpoint](lib_net_classes_methods_endpoint_endpoint.md#abstractendpoint).[id](lib_net_classes_methods_endpoint_endpoint.md#id)

Defined in: [src/lib/net/classes/methods/endpoint/endpoint.ts:5](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/endpoint/endpoint.ts#L5)

#### Methods

##### get()

###### Signature

```ts
get(): void;
```

###### Returns

`void`

Implementation of: GETDeclaration.get

Defined in: [src/lib/net/classes/methods/get/index.ts:28](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/get/index.ts#L28)

##### getIdentifier()

Returns the complete non-compressed identifiers attached to the endpoint.

###### Signature

```ts
getIdentifier(): string;
```

###### Returns

`string`

Inherited from: [AbstractEndpoint](lib_net_classes_methods_endpoint_endpoint.md#abstractendpoint).[getIdentifier](lib_net_classes_methods_endpoint_endpoint.md#getidentifier)

Defined in: [src/lib/net/classes/methods/endpoint/endpoint.ts:11](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/endpoint/endpoint.ts#L11)

##### reply()

###### Signature

```ts
reply(func: Function): void;
```

###### Parameters

| Name   | Type                                                                                                        |
| :----- | :---------------------------------------------------------------------------------------------------------- |
| `func` | (`user`: [`DefaultUserDeclaration`](lib_user_default_types.md#defaultuserdeclaration), `value`: `S`) => `R` |

###### Returns

`void`

Implementation of: GETDeclaration.reply

Defined in: [src/lib/net/classes/methods/get/index.ts:18](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/get/index.ts#L18)

##### send()

###### Signature

```ts
send(toSend: S): void;
```

###### Parameters

| Name     | Type |
| :------- | :--- |
| `toSend` | `S`  |

###### Returns

`void`

Implementation of: GETDeclaration.send

Defined in: [src/lib/net/classes/methods/get/index.ts:24](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/get/index.ts#L24)

##### when()

###### Signature

```ts
when(): EventListener<[R]>;
```

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`R`]\>

Implementation of: GETDeclaration.when

Defined in: [src/lib/net/classes/methods/get/index.ts:10](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/get/index.ts#L10)
