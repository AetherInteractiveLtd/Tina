[@rbxts/tina](modules.md) / lib/container/classes/bucket

# lib/container/classes/bucket

## Index

### Classes

- [Bucket](lib_container_classes_bucket.md#bucket)

## Classes

### Bucket

#### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

#### Implements

- [`BucketImplementation`](lib_container_classes_bucket_types.md#bucketimplementation)\<`T`\>

#### Index

##### Constructors

- [constructor](lib_container_classes_bucket.md#constructor)

##### Properties

- [\_globalDataStore](lib_container_classes_bucket.md#_globaldatastore)
- [bucket_metadata](lib_container_classes_bucket.md#bucket_metadata)
- [key](lib_container_classes_bucket.md#key)
- [template](lib_container_classes_bucket.md#template)

##### Methods

- [getItem](lib_container_classes_bucket.md#getitem)
- [getMetadata](lib_container_classes_bucket.md#getmetadata)

#### Constructors

#### constructor()

##### Signature

```ts
new Bucket<T>(key: string, template: T): Bucket<T>;
```

##### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

##### Parameters

| Name       | Type     |
| :--------- | :------- |
| `key`      | `string` |
| `template` | `T`      |

##### Returns

[`Bucket`](lib_container_classes_bucket.md#bucket)\<`T`\>

Defined in: [src/lib/container/classes/bucket/index.ts:22](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/index.ts#L22)

#### Properties

##### \_globalDataStore

> `DataStore`

Defined in: [src/lib/container/classes/bucket/index.ts:12](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/index.ts#L12)

##### bucket_metadata

> **`Readonly`** `object` = `{}`

###### Type declaration

Defined in: [src/lib/container/classes/bucket/index.ts:11](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/index.ts#L11)

##### key

> `string`

Defined in: [src/lib/container/classes/bucket/index.ts:22](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/index.ts#L22)

##### template

> `T`

Defined in: [src/lib/container/classes/bucket/index.ts:22](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/index.ts#L22)

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

Implementation of: [BucketImplementation](lib_container_classes_bucket_types.md#bucketimplementation).[getItem](lib_container_classes_bucket_types.md#getitem)

Defined in: [src/lib/container/classes/bucket/index.ts:26](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/index.ts#L26)

##### getMetadata()

Returns the metadata linked to an existing bucket, if not, will return nil.

###### Signature

```ts
getMetadata(): BucketMetadata;
```

###### Returns

[`BucketMetadata`](lib_container_classes_bucket_types.md#bucketmetadata)

metadata or nil.

Implementation of: [BucketImplementation](lib_container_classes_bucket_types.md#bucketimplementation).[getMetadata](lib_container_classes_bucket_types.md#getmetadata)

Defined in: [src/lib/container/classes/bucket/index.ts:109](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/bucket/index.ts#L109)
