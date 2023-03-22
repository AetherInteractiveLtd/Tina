[@rbxts/tina](modules.md) / lib/net/classes/methods/endpoint/endpoint

# lib/net/classes/methods/endpoint/endpoint

## Index

### Classes

- [AbstractEndpoint](lib_net_classes_methods_endpoint_endpoint.md#abstractendpoint)

## Classes

### AbstractEndpoint

#### Hierarchy

- [`GetEndpoint`](lib_net_classes_methods_get.md#getendpoint)
- [`PostEndpoint`](lib_net_classes_methods_post.md#postendpoint)
- [`UpdateEndpoint`](lib_net_classes_methods_update.md#updateendpoint)

#### Implements

- [`AbstractEndpointImplementation`](lib_net_classes_methods_endpoint_types.md#abstractendpointimplementation)

#### Index

##### Constructors

- [constructor](lib_net_classes_methods_endpoint_endpoint.md#constructor)

##### Properties

- [id](lib_net_classes_methods_endpoint_endpoint.md#id)

##### Methods

- [getIdentifier](lib_net_classes_methods_endpoint_endpoint.md#getidentifier)

#### Constructors

#### constructor()

##### Signature

```ts
new AbstractEndpoint(): AbstractEndpoint;
```

##### Returns

[`AbstractEndpoint`](lib_net_classes_methods_endpoint_endpoint.md#abstractendpoint)

Defined in: [src/lib/net/classes/methods/endpoint/endpoint.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/endpoint/endpoint.ts#L7)

#### Properties

##### id

> **`Protected`** **`Readonly`** `string`

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

Implementation of: [AbstractEndpointImplementation](lib_net_classes_methods_endpoint_types.md#abstractendpointimplementation).[getIdentifier](lib_net_classes_methods_endpoint_types.md#getidentifier)

Defined in: [src/lib/net/classes/methods/endpoint/endpoint.ts:11](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/classes/methods/endpoint/endpoint.ts#L11)
