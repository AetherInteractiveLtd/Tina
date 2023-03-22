[@rbxts/tina](modules.md) / lib/container/classes/bucket/types

# lib/container/classes/bucket/types

## Index

### Interfaces

- [BucketDeclaration](lib_container_classes_bucket_types.md#bucketdeclaration)
- [BucketImplementation](lib_container_classes_bucket_types.md#bucketimplementation)
- [BucketMetadata](lib_container_classes_bucket_types.md#bucketmetadata)

### Type Aliases

- [BucketType](lib_container_classes_bucket_types.md#buckettype)

## Interfaces

### BucketDeclaration

#### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

#### Index

##### Properties

- [key](lib_container_classes_bucket_types.md#key)

#### Properties

##### key

> `string`

Defined in: [src/lib/container/classes/bucket/types.d.ts:9](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/types.d.ts#L9)

---

### BucketImplementation

#### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

#### Index

##### Methods

- [getItem](lib_container_classes_bucket_types.md#getitem)
- [getMetadata](lib_container_classes_bucket_types.md#getmetadata)

#### Methods

##### getItem()

Returns a construction of an Item.

###### Signature

```ts
getItem(itemKey: string): undefined | ItemType<T>;
```

###### Parameters

| Name      | Type     | Description                                                                |
| :-------- | :------- | :------------------------------------------------------------------------- |
| `itemKey` | `string` | the key of an item which either already exists or doesn't within a bucket. |

###### Returns

`undefined` \| [`ItemType`](lib_container_classes_item_types.md#itemtype)\<`T`\>

Defined in: [src/lib/container/classes/bucket/types.d.ts:27](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/types.d.ts#L27)

##### getMetadata()

Returns the metadata linked to an existing bucket, if not, will return nil.

###### Signature

```ts
getMetadata(bucketKey: string): BucketMetadata;
```

###### Parameters

| Name        | Type     | Description                                               |
| :---------- | :------- | :-------------------------------------------------------- |
| `bucketKey` | `string` | should be the key of an existing bucket in the Container. |

###### Returns

[`BucketMetadata`](lib_container_classes_bucket_types.md#bucketmetadata)

metadata or nil.

Defined in: [src/lib/container/classes/bucket/types.d.ts:35](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/types.d.ts#L35)

---

### BucketMetadata

## Type Aliases

### BucketType

> \<`T`\> [`BucketImplementation`](lib_container_classes_bucket_types.md#bucketimplementation)\<`T`\> & [`BucketDeclaration`](lib_container_classes_bucket_types.md#bucketdeclaration)\<`T`\>

#### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

Defined in: [src/lib/container/classes/bucket/types.d.ts:38](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/types.d.ts#L38)
