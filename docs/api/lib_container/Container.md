[@rbxts/tina](../modules.md) / [lib/container](../lib_container.md) / Container

# Container

## Index

### Functions

- [getBucket](Container.md#getbucket)
- [getBucketMetadata](Container.md#getbucketmetadata)

## Functions

### getBucket()

#### Signature

```ts
getBucket<T>(bucketKey: string, template?: T): BucketType<T>;
```

#### Type parameters

- `T` _extends_ [`Template`](../lib_container_types.md#template)

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `bucketKey` | `string` |
| `template?` | `T`      |

#### Returns

[`BucketType`](../lib_container_classes_bucket_types.md#buckettype)\<`T`\>

Defined in: [src/lib/container/index.ts:9](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/index.ts#L9)

---

### getBucketMetadata()

#### Signature

```ts
getBucketMetadata(bucketKey: string): BucketMetadata | undefined;
```

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `bucketKey` | `string` |

#### Returns

[`BucketMetadata`](../lib_container_classes_bucket_types.md#bucketmetadata) \| `undefined`

Defined in: [src/lib/container/index.ts:26](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/index.ts#L26)
