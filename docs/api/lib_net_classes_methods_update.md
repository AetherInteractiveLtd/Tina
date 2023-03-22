[@rbxts/tina](modules.md) / lib/net/classes/methods/update

# lib/net/classes/methods/update

## Index

### Classes

- [UpdateEndpoint](lib_net_classes_methods_update.md#updateendpoint)

## Classes

### UpdateEndpoint

#### Type parameters

- `T`

#### Hierarchy

- [`AbstractEndpoint`](lib_net_classes_methods_endpoint_endpoint.md#abstractendpoint).**UpdateEndpoint**

#### Implements

- [`UPDATEDeclaration`](lib_net_classes_methods_update_types.md#updatedeclaration)\<`T`\>

#### Index

##### Constructors

- [constructor](lib_net_classes_methods_update.md#constructor)

##### Properties

- [id](lib_net_classes_methods_update.md#id)

##### Methods

- [getIdentifier](lib_net_classes_methods_update.md#getidentifier)
- [send](lib_net_classes_methods_update.md#send)
- [sendAll](lib_net_classes_methods_update.md#sendall)
- [sendAllExcept](lib_net_classes_methods_update.md#sendallexcept)
- [when](lib_net_classes_methods_update.md#when)

#### Constructors

#### constructor()

##### Signature

```ts
new UpdateEndpoint<T>(): UpdateEndpoint<T>;
```

##### Type parameters

- `T`

##### Returns

[`UpdateEndpoint`](lib_net_classes_methods_update.md#updateendpoint)\<`T`\>

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
send(to: Player | AudienceDeclaration, toSend: T): void;
```

###### Parameters

| Name     | Type                                                                           |
| :------- | :----------------------------------------------------------------------------- |
| `to`     | `Player` \| [`AudienceDeclaration`](lib_audience_types.md#audiencedeclaration) |
| `toSend` | `T`                                                                            |

###### Returns

`void`

Implementation of: UPDATEDeclaration.send

Defined in: [src/lib/net/classes/methods/update/index.ts:17](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/update/index.ts#L17)

##### sendAll()

###### Signature

```ts
sendAll(value: T): void;
```

###### Parameters

| Name    | Type |
| :------ | :--- |
| `value` | `T`  |

###### Returns

`void`

Implementation of: UPDATEDeclaration.sendAll

Defined in: [src/lib/net/classes/methods/update/index.ts:25](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/update/index.ts#L25)

##### sendAllExcept()

###### Signature

```ts
sendAllExcept(blacklist: AudienceDeclaration, value: T): void;
```

###### Parameters

| Name        | Type                                                               |
| :---------- | :----------------------------------------------------------------- |
| `blacklist` | [`AudienceDeclaration`](lib_audience_types.md#audiencedeclaration) |
| `value`     | `T`                                                                |

###### Returns

`void`

Defined in: [src/lib/net/classes/methods/update/index.ts:29](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/update/index.ts#L29)

##### when()

###### Signature

```ts
when(): EventListener<[value: T]>;
```

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`value: T`]\>

Implementation of: UPDATEDeclaration.when

Defined in: [src/lib/net/classes/methods/update/index.ts:9](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/update/index.ts#L9)
