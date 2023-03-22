[@rbxts/tina](../modules.md) / [lib/container/data_actions](../lib_container_data_actions.md) / Data

# Data

## Index

### Variables

- [servicesAvailable](Data.md#servicesavailable)

### Functions

- [queueCall](Data.md#queuecall)
- [save](Data.md#save)

## Variables

### servicesAvailable

> `boolean` = `true`

Defined in: [src/lib/container/data_actions/index.ts:163](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/data_actions/index.ts#L163)

## Functions

### queueCall()

#### Signature

```ts
queueCall<T>(itemKey: string, bucketOn: BucketType<T>, methods: ItemMethodsDataStore): [DataSaved, DataStoreKeyInfo] | undefined;
```

#### Type parameters

- `T` _extends_ [`Template`](../lib_container_types.md#template) = [`Template`](../lib_container_types.md#template)

#### Parameters

| Name       | Type                                                                                  |
| :--------- | :------------------------------------------------------------------------------------ |
| `itemKey`  | `string`                                                                              |
| `bucketOn` | [`BucketType`](../lib_container_classes_bucket_types.md#buckettype)\<`T`\>            |
| `methods`  | [`ItemMethodsDataStore`](../lib_container_classes_item_types.md#itemmethodsdatastore) |

#### Returns

[[`DataSaved`](../lib_container_types.md#datasaved), `DataStoreKeyInfo`] \| `undefined`

Defined in: [src/lib/container/data_actions/index.ts:165](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/data_actions/index.ts#L165)

---

### save()

#### Signature

```ts
save(item: ItemDeclaration<Template>): void;
```

#### Parameters

| Name   | Type                                                                                                                            |
| :----- | :------------------------------------------------------------------------------------------------------------------------------ |
| `item` | [`ItemDeclaration`](../lib_container_classes_item_types.md#itemdeclaration)\<[`Template`](../lib_container_types.md#template)\> |

#### Returns

`void`

Defined in: [src/lib/container/data_actions/index.ts:251](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/data_actions/index.ts#L251)
