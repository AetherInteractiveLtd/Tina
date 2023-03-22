[@rbxts/tina](modules.md) / lib/net/tina_net/types

# lib/net/tina_net/types

## Index

### Interfaces

- [Exposed](lib_net_tina_net_types.md#exposed)
- [ExposedEndpoints](lib_net_tina_net_types.md#exposedendpoints)
- [InternalEndpoints](lib_net_tina_net_types.md#internalendpoints)
- [Internals](lib_net_tina_net_types.md#internals)

## Interfaces

### Exposed

Exposed net events that can be used within Tina.when(""), goes

#### Index

##### Properties

- [user:added](lib_net_tina_net_types.md#user:added)
- [user:removing](lib_net_tina_net_types.md#user:removing)

#### Properties

##### user:added

> [`DefaultUserDeclaration`](lib_user_default_types.md#defaultuserdeclaration)

Defined in: [src/lib/net/tina_net/types.d.ts:14](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/tina_net/types.d.ts#L14)

##### user:removing

> [`DefaultUserDeclaration`](lib_user_default_types.md#defaultuserdeclaration)

Defined in: [src/lib/net/tina_net/types.d.ts:15](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/tina_net/types.d.ts#L15)

---

### ExposedEndpoints

#### Index

##### Properties

- [user:added](lib_net_tina_net_types.md#user:added)
- [user:removing](lib_net_tina_net_types.md#user:removing)

#### Properties

##### user:added

> [`UPDATEDeclaration`](lib_net_classes_methods_update_types.md#updatedeclaration)\<[`DefaultUserDeclaration`](lib_user_default_types.md#defaultuserdeclaration)\>

Defined in: [src/lib/net/tina_net/types.d.ts:6](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/tina_net/types.d.ts#L6)

##### user:removing

> [`UPDATEDeclaration`](lib_net_classes_methods_update_types.md#updatedeclaration)\<[`DefaultUserDeclaration`](lib_user_default_types.md#defaultuserdeclaration)\>

Defined in: [src/lib/net/tina_net/types.d.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/tina_net/types.d.ts#L7)

---

### InternalEndpoints

#### Index

##### Properties

- [user:get](lib_net_tina_net_types.md#user:get)

#### Properties

##### user:get

> [`GETDeclaration`](lib_net_classes_methods_get_types.md#getdeclaration)\<`undefined`, [`DefaultUserDeclaration`](lib_user_default_types.md#defaultuserdeclaration)\>

Defined in: [src/lib/net/tina_net/types.d.ts:19](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/tina_net/types.d.ts#L19)

---

### Internals

Internal events such as users retrieve, replication of state, goes here.

#### Index

##### Properties

- [user:get](lib_net_tina_net_types.md#user:get)

#### Properties

##### user:get

> `Player`

Defined in: [src/lib/net/tina_net/types.d.ts:26](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/net/tina_net/types.d.ts#L26)
