[@rbxts/tina](modules.md) / lib/net/classes/methods/post

# lib/net/classes/methods/post

## Index

### Classes

- [PostEndpoint](lib_net_classes_methods_post.md#postendpoint)

## Classes

### PostEndpoint

#### Type parameters

- `T`

#### Hierarchy

- [`AbstractEndpoint`](lib_net_classes_methods_endpoint_endpoint.md#abstractendpoint).**PostEndpoint**

#### Implements

- [`POSTDeclaration`](lib_net_classes_methods_post_types.md#postdeclaration)\<`T`\>

#### Index

##### Constructors

- [constructor](lib_net_classes_methods_post.md#constructor)

##### Properties

- [id](lib_net_classes_methods_post.md#id)

##### Methods

- [getIdentifier](lib_net_classes_methods_post.md#getidentifier)
- [send](lib_net_classes_methods_post.md#send)
- [when](lib_net_classes_methods_post.md#when)

#### Constructors

#### constructor()

##### Signature

```ts
new PostEndpoint<T>(): PostEndpoint<T>;
```

##### Type parameters

- `T`

##### Returns

[`PostEndpoint`](lib_net_classes_methods_post.md#postendpoint)\<`T`\>

Inherited from: [AbstractEndpoint](lib_net_classes_methods_endpoint_endpoint.md#abstractendpoint).[constructor](lib_net_classes_methods_endpoint_endpoint.md#constructor)

Defined in: [src/lib/net/classes/methods/endpoint/endpoint.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/endpoint/endpoint.ts#L7)

#### Properties

##### id

> **`Protected`** **`Readonly`** `string`

Inherited from: [AbstractEndpoint](lib_net_classes_methods_endpoint_endpoint.md#abstractendpoint).[id](lib_net_classes_methods_endpoint_endpoint.md#id)

Defined in: [src/lib/net/classes/methods/endpoint/endpoint.ts:5](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/endpoint/endpoint.ts#L5)

#### Methods

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

##### send()

###### Signature

```ts
send(toSend: T): void;
```

###### Parameters

| Name     | Type |
| :------- | :--- |
| `toSend` | `T`  |

###### Returns

`void`

Implementation of: POSTDeclaration.send

Defined in: [src/lib/net/classes/methods/post/index.ts:20](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/post/index.ts#L20)

##### when()

###### Signature

```ts
when(): EventListener<[user: never, value: T]>;
```

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`user: never`, `value: T`]\>

Implementation of: POSTDeclaration.when

Defined in: [src/lib/net/classes/methods/post/index.ts:10](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/post/index.ts#L10)
