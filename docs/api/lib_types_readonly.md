[@rbxts/tina](modules.md) / lib/types/readonly

# lib/types/readonly

## Index

### Type Aliases

- [Immutable](lib_types_readonly.md#immutable)
- [ImmutableArray](lib_types_readonly.md#immutablearray)
- [ImmutableMap](lib_types_readonly.md#immutablemap)
- [ImmutableObject](lib_types_readonly.md#immutableobject)
- [ImmutablePrimitive](lib_types_readonly.md#immutableprimitive)
- [ImmutableSet](lib_types_readonly.md#immutableset)

## Type Aliases

### Immutable

> \<`T`\> `T` _extends_ [`ImmutablePrimitive`](lib_types_readonly.md#immutableprimitive) ? `T` : `T` _extends_ infer U[] ? [`ImmutableArray`](lib_types_readonly.md#immutablearray)\<`U`\> : `T` _extends_ `Map`\<infer K, infer V\> ? [`ImmutableMap`](lib_types_readonly.md#immutablemap)\<`K`, `V`\> : `T` _extends_ `Set`\<infer M\> ? [`ImmutableSet`](lib_types_readonly.md#immutableset)\<`M`\> : [`ImmutableObject`](lib_types_readonly.md#immutableobject)\<`T`\>

#### Type parameters

- `T`

Defined in: [src/lib/types/readonly.d.ts:3](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/readonly.d.ts#L3)

---

### ImmutableArray

> \<`T`\> `ReadonlyArray`\<[`Immutable`](lib_types_readonly.md#immutable)\<`T`\>\>

#### Type parameters

- `T`

Defined in: [src/lib/types/readonly.d.ts:13](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/readonly.d.ts#L13)

---

### ImmutableMap

> \<`K`, `V`\> `ReadonlyMap`\<[`Immutable`](lib_types_readonly.md#immutable)\<`K`\>, [`Immutable`](lib_types_readonly.md#immutable)\<`V`\>\>

#### Type parameters

- `K`
- `V`

Defined in: [src/lib/types/readonly.d.ts:14](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/readonly.d.ts#L14)

---

### ImmutableObject

> \<`T`\> `{ readonly [K in keyof T]: Immutable<T[K]> }`

#### Type parameters

- `T`

Defined in: [src/lib/types/readonly.d.ts:16](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/readonly.d.ts#L16)

---

### ImmutablePrimitive

> `undefined` \| `boolean` \| `string` \| `number`

Defined in: [src/lib/types/readonly.d.ts:1](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/readonly.d.ts#L1)

---

### ImmutableSet

> \<`T`\> `ReadonlySet`\<[`Immutable`](lib_types_readonly.md#immutable)\<`T`\>\>

#### Type parameters

- `T`

Defined in: [src/lib/types/readonly.d.ts:15](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/readonly.d.ts#L15)
