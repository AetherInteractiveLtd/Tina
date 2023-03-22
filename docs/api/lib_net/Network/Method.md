[@rbxts/tina](../../modules.md) / [lib/net](../../lib_net.md) / [Network](../Network.md) / Method

# Method

A namespace holding all the possible method for the networking interaction.

## Index

### Functions

- [GET](Method.md#get)
- [POST](Method.md#post)
- [UPDATE](Method.md#update)

## Functions

### GET()

GET is used to send and receive data from the client. You can imagine it as `client -> server -> client`.

#### Signature

```ts
GET<S, R>(): GETDeclaration<S, R>;
```

#### Type parameters

- `S`
- `R`

#### Returns

[`GETDeclaration`](../../lib_net_classes_methods_get_types.md#getdeclaration)\<`S`, `R`\>

Defined in: [src/lib/net/index.ts:41](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/index.ts#L41)

---

### POST()

POST is used to send data such as `client -> server`.

#### Signature

```ts
POST<T>(): POSTDeclaration<T>;
```

#### Type parameters

- `T`

#### Returns

[`POSTDeclaration`](../../lib_net_classes_methods_post_types.md#postdeclaration)\<`T`\>

Defined in: [src/lib/net/index.ts:23](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/index.ts#L23)

---

### UPDATE()

UPDATE is a network method which lets you send data to the client, this doesn't expect anything back.

#### Signature

```ts
UPDATE<T>(): UPDATEDeclaration<T>;
```

#### Type parameters

- `T`

#### Returns

[`UPDATEDeclaration`](../../lib_net_classes_methods_update_types.md#updatedeclaration)\<`T`\>

Defined in: [src/lib/net/index.ts:32](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/index.ts#L32)
