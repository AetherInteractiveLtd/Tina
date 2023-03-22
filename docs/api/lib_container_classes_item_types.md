[@rbxts/tina](modules.md) / lib/container/classes/item/types

# lib/container/classes/item/types

## Index

### Interfaces

- [ItemDeclaration](lib_container_classes_item_types.md#itemdeclaration)
- [ItemEvents](lib_container_classes_item_types.md#itemevents)
- [ItemImplementation](lib_container_classes_item_types.md#itemimplementation)
- [ItemLoaderJob](lib_container_classes_item_types.md#itemloaderjob)
- [ItemMethodsDataStore](lib_container_classes_item_types.md#itemmethodsdatastore)

### Type Aliases

- [ItemType](lib_container_classes_item_types.md#itemtype)

## Interfaces

### ItemDeclaration

#### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

#### Index

##### Properties

- [bucketOn](lib_container_classes_item_types.md#bucketon)
- [data](lib_container_classes_item_types.md#data)
- [key](lib_container_classes_item_types.md#key)
- [keyInfo](lib_container_classes_item_types.md#keyinfo)
- [metadata](lib_container_classes_item_types.md#metadata)
- [userIds](lib_container_classes_item_types.md#userids)

#### Properties

##### bucketOn

> [`BucketType`](lib_container_classes_bucket_types.md#buckettype)\<`T`\>

Defined in: [src/lib/container/classes/item/types.d.ts:29](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L29)

##### data

> `T`

Defined in: [src/lib/container/classes/item/types.d.ts:25](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L25)

##### key

> `string`

Defined in: [src/lib/container/classes/item/types.d.ts:22](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L22)

##### keyInfo

> `DataStoreKeyInfo`

Defined in: [src/lib/container/classes/item/types.d.ts:23](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L23)

##### metadata

> [`Metadata`](lib_container_types.md#metadata)

Defined in: [src/lib/container/classes/item/types.d.ts:26](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L26)

##### userIds

> `number`[]

Defined in: [src/lib/container/classes/item/types.d.ts:28](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L28)

---

### ItemEvents

#### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

#### Index

##### Properties

- [item:loaded](lib_container_classes_item_types.md#item:loaded)
- [item:loading](lib_container_classes_item_types.md#item:loading)
- [item:releasing](lib_container_classes_item_types.md#item:releasing)

#### Properties

##### item:loaded

> `Function`

###### Type declaration

####### Signature

```ts
<T>(savedData: T): void;
```

####### Type parameters

- `T` _extends_ [`DataSaved`](lib_container_types.md#datasaved)

####### Parameters

| Name        | Type |
| :---------- | :--- |
| `savedData` | `T`  |

####### Returns

`void`

Defined in: [src/lib/container/classes/item/types.d.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L7)

##### item:loading

> `Function`

###### Type declaration

####### Signature

```ts
(alreadyLoaded: boolean): void;
```

####### Parameters

| Name            | Type      |
| :-------------- | :-------- |
| `alreadyLoaded` | `boolean` |

####### Returns

`void`

Defined in: [src/lib/container/classes/item/types.d.ts:6](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L6)

##### item:releasing

> `Function`

###### Type declaration

####### Signature

```ts
(item: ItemDeclaration<T>): void;
```

####### Parameters

| Name   | Type                                                                            |
| :----- | :------------------------------------------------------------------------------ |
| `item` | [`ItemDeclaration`](lib_container_classes_item_types.md#itemdeclaration)\<`T`\> |

####### Returns

`void`

Defined in: [src/lib/container/classes/item/types.d.ts:5](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L5)

---

### ItemImplementation

#### Index

##### Methods

- [addUserId](lib_container_classes_item_types.md#adduserid)
- [lose](lib_container_classes_item_types.md#lose)
- [reconcile](lib_container_classes_item_types.md#reconcile)
- [removeUserId](lib_container_classes_item_types.md#removeuserid)

#### Methods

##### addUserId()

GDPR compliances.

###### Signature

```ts
addUserId(userId: number): void;
```

###### Parameters

| Name     | Type     | Description                               |
| :------- | :------- | :---------------------------------------- |
| `userId` | `number` | a number describing the player's user id. |

###### Returns

`void`

Defined in: [src/lib/container/classes/item/types.d.ts:38](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L38)

##### lose()

Used to lose the current item and unlock the session from it

###### Signature

```ts
lose(): void;
```

###### Returns

`void`

Defined in: [src/lib/container/classes/item/types.d.ts:55](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L55)

##### reconcile()

Used reconcile the table with the template

###### Signature

```ts
reconcile(): void;
```

###### Returns

`void`

Defined in: [src/lib/container/classes/item/types.d.ts:50](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L50)

##### removeUserId()

GDPR compliances within deleting a player's data.

###### Signature

```ts
removeUserId(userId: number): void;
```

###### Parameters

| Name     | Type     | Description                               |
| :------- | :------- | :---------------------------------------- |
| `userId` | `number` | a number describing the player's user id. |

###### Returns

`void`

Defined in: [src/lib/container/classes/item/types.d.ts:45](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L45)

---

### ItemLoaderJob

#### Index

##### Properties

- [cleanup](lib_container_classes_item_types.md#cleanup)
- [lastWrite](lib_container_classes_item_types.md#lastwrite)
- [queue](lib_container_classes_item_types.md#queue)

#### Properties

##### cleanup

> `undefined` \| `RBXScriptConnection`

Defined in: [src/lib/container/classes/item/types.d.ts:16](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L16)

##### lastWrite

> `number`

Defined in: [src/lib/container/classes/item/types.d.ts:17](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L17)

##### queue

> `Callback`[]

Defined in: [src/lib/container/classes/item/types.d.ts:18](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L18)

---

### ItemMethodsDataStore

#### Index

##### Properties

- [missingItem](lib_container_classes_item_types.md#missingitem)
- [setItem](lib_container_classes_item_types.md#setitem)

#### Properties

##### missingItem?

> `Function`

###### Type declaration

####### Signature

```ts
<T>(object: T): void;
```

####### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

####### Parameters

| Name     | Type |
| :------- | :--- |
| `object` | `T`  |

####### Returns

`void`

Defined in: [src/lib/container/classes/item/types.d.ts:11](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L11)

##### setItem?

> `Function`

###### Type declaration

####### Signature

```ts
<T>(object: T, keyInfo: DataStoreKeyInfo): void;
```

####### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

####### Parameters

| Name      | Type               |
| :-------- | :----------------- |
| `object`  | `T`                |
| `keyInfo` | `DataStoreKeyInfo` |

####### Returns

`void`

Defined in: [src/lib/container/classes/item/types.d.ts:12](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L12)

## Type Aliases

### ItemType

> \<`T`\> [`ItemDeclaration`](lib_container_classes_item_types.md#itemdeclaration)\<`T`\> & [`ItemImplementation`](lib_container_classes_item_types.md#itemimplementation)

#### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

Defined in: [src/lib/container/classes/item/types.d.ts:58](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/types.d.ts#L58)
