[@rbxts/tina](modules.md) / lib/container/types

# lib/container/types

## Index

### Interfaces

- [DataSaved](lib_container_types.md#datasaved)

### Type Aliases

- [Metadata](lib_container_types.md#metadata)
- [Template](lib_container_types.md#template)

## Interfaces

### DataSaved

#### Indexable

\[`x`: `string`\]: `unknown`

#### Index

##### Properties

- [data](lib_container_types.md#data)
- [key](lib_container_types.md#key)
- [metadata](lib_container_types.md#metadata)
- [userIds](lib_container_types.md#userids)

#### Properties

##### data

> [`Template`](lib_container_types.md#template)

Defined in: [src/lib/container/types.d.ts:17](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/types.d.ts#L17)

##### key

> `string`

Defined in: [src/lib/container/types.d.ts:16](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/types.d.ts#L16)

##### metadata

> [`Metadata`](lib_container_types.md#metadata)

Defined in: [src/lib/container/types.d.ts:18](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/types.d.ts#L18)

##### userIds

> `number`[]

Defined in: [src/lib/container/types.d.ts:20](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/types.d.ts#L20)

## Type Aliases

### Metadata

> `object`

```ts
{
  is_first_session: boolean;
  last_bucket_on: string;
  last_connection_timestamp: number;
  load_timestamp: number;
  version: string;
}
```

#### Type declaration

| Member                      | Type      |
| :-------------------------- | :-------- |
| `is_first_session`          | `boolean` |
| `last_bucket_on`            | `string`  |
| `last_connection_timestamp` | `number`  |
| `load_timestamp`            | `number`  |
| `version`                   | `string`  |

Defined in: [src/lib/container/types.d.ts:4](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/types.d.ts#L4)

---

### Template

> `object`

#### Index signature

\[`x`: `string`\]: `any`

#### Type declaration

Defined in: [src/lib/container/types.d.ts:2](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/types.d.ts#L2)
