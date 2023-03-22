[@rbxts/tina](modules.md) / lib/container/classes/item

# lib/container/classes/item

## Index

### Classes

- [Item](lib_container_classes_item.md#item)

## Classes

### Item

#### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

#### Hierarchy

- [`EventEmitter`](lib_events.md#eventemitter)\<[`ItemEvents`](lib_container_classes_item_types.md#itemevents)\<`T`\>\>.**Item**

#### Implements

- [`ItemImplementation`](lib_container_classes_item_types.md#itemimplementation)

#### Index

##### Constructors

- [constructor](lib_container_classes_item.md#constructor)

##### Properties

- [bucketOn](lib_container_classes_item.md#bucketon)
- [data](lib_container_classes_item.md#data)
- [events](lib_container_classes_item.md#events)
- [key](lib_container_classes_item.md#key)
- [keyInfo](lib_container_classes_item.md#keyinfo)
- [metadata](lib_container_classes_item.md#metadata)
- [userIds](lib_container_classes_item.md#userids)

##### Methods

- [addUserId](lib_container_classes_item.md#adduserid)
- [emit](lib_container_classes_item.md#emit)
- [lose](lib_container_classes_item.md#lose)
- [reconcile](lib_container_classes_item.md#reconcile)
- [removeUserId](lib_container_classes_item.md#removeuserid)
- [when](lib_container_classes_item.md#when)

#### Constructors

#### constructor()

##### Signature

```ts
new Item<T>(«destructured»: ItemDeclaration<T>): Item<T>;
```

##### Type parameters

- `T` _extends_ [`Template`](lib_container_types.md#template)

##### Parameters

| Name             | Type                                                                            |
| :--------------- | :------------------------------------------------------------------------------ |
| `«destructured»` | [`ItemDeclaration`](lib_container_classes_item_types.md#itemdeclaration)\<`T`\> |

##### Returns

[`Item`](lib_container_classes_item.md#item)\<`T`\>

Overrides: [EventEmitter](lib_events.md#eventemitter).[constructor](lib_events.md#constructor)

Defined in: [src/lib/container/classes/item/index.ts:20](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L20)

#### Properties

##### bucketOn

> [`BucketType`](lib_container_classes_bucket_types.md#buckettype)\<`T`\>

Defined in: [src/lib/container/classes/item/index.ts:18](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L18)

##### data

> `T`

Defined in: [src/lib/container/classes/item/index.ts:15](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L15)

##### events

> **`Protected`** **`Readonly`** `Record`\<`string`, [`EventListener`](lib_events.md#eventlistener)\<[]\>[]\> = `{}`

Inherited from: [EventEmitter](lib_events.md#eventemitter).[events](lib_events.md#events)

Defined in: [src/lib/events/index.ts:87](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L87)

##### key

> `string`

Defined in: [src/lib/container/classes/item/index.ts:13](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L13)

##### keyInfo

> `DataStoreKeyInfo`

Defined in: [src/lib/container/classes/item/index.ts:14](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L14)

##### metadata

> [`Metadata`](lib_container_types.md#metadata)

Defined in: [src/lib/container/classes/item/index.ts:16](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L16)

##### userIds

> `number`[]

Defined in: [src/lib/container/classes/item/index.ts:17](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L17)

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

Implementation of: [ItemImplementation](lib_container_classes_item_types.md#itemimplementation).[addUserId](lib_container_classes_item_types.md#adduserid)

Defined in: [src/lib/container/classes/item/index.ts:33](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L33)

##### emit()

Emits the event, either resuming the yeilded threads or invoking the do's chain.

###### Signature

```ts
emit<T, S>(token: T, ...args: S): void;
```

###### Type parameters

- `T` _extends_ keyof [`ItemEvents`](lib_container_classes_item_types.md#itemevents)\<`T`\>
- `S` _extends_ `Object`

###### Parameters

| Name      | Type | Description                                                           |
| :-------- | :--- | :-------------------------------------------------------------------- |
| `token`   | `T`  | event to emit.                                                        |
| `...args` | `S`  | of type T which are the parameters passed to the function definition. |

###### Returns

`void`

a promise.

Inherited from: [EventEmitter](lib_events.md#eventemitter).[emit](lib_events.md#emit)

Defined in: [src/lib/events/index.ts:128](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L128)

##### lose()

Used to lose the current item and unlock the session from it

###### Signature

```ts
lose(): void;
```

###### Returns

`void`

Implementation of: [ItemImplementation](lib_container_classes_item_types.md#itemimplementation).[lose](lib_container_classes_item_types.md#lose)

Defined in: [src/lib/container/classes/item/index.ts:57](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L57)

##### reconcile()

Used reconcile the table with the template

###### Signature

```ts
reconcile(): void;
```

###### Returns

`void`

Implementation of: [ItemImplementation](lib_container_classes_item_types.md#itemimplementation).[reconcile](lib_container_classes_item_types.md#reconcile)

Defined in: [src/lib/container/classes/item/index.ts:53](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L53)

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

Implementation of: [ItemImplementation](lib_container_classes_item_types.md#itemimplementation).[removeUserId](lib_container_classes_item_types.md#removeuserid)

Defined in: [src/lib/container/classes/item/index.ts:41](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/container/classes/item/index.ts#L41)

##### when()

Lets you listen to a specific event from your Events interface definition.

###### Signature

```ts
when<T, U>(token?: T): undefined | T extends void ? EventListener<never> : EventListener<U extends unknown[] ? U : never>;
```

###### Type parameters

- `T` _extends_ keyof [`ItemEvents`](lib_container_classes_item_types.md#itemevents)\<`T`\>
- `U` _extends_ (`alreadyLoaded`: `boolean`) => `void` \| \<T\>(`savedData`: `T`) => `void` \| (`item`: [`ItemDeclaration`](lib_container_classes_item_types.md#itemdeclaration)\<`T`\>) => `void`

###### Parameters

| Name     | Type | Description                                   |
| :------- | :--- | :-------------------------------------------- |
| `token?` | `T`  | as string, should be the event to connect to. |

###### Returns

`undefined` \| `T` _extends_ `void` ? [`EventListener`](lib_events.md#eventlistener)\<`never`\> : [`EventListener`](lib_events.md#eventlistener)\<`U` _extends_ `unknown`[] ? `U` : `never`\>

an EventListener of type T which are the parameters passed to the function.

Inherited from: [EventEmitter](lib_events.md#eventemitter).[when](lib_events.md#when)

Defined in: [src/lib/events/index.ts:95](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L95)

###### Signature

```ts
when<T>(token: T): EventListener<ArrayOrNever<ItemEvents<T>[T]>>;
```

###### Type parameters

- `T` _extends_ keyof [`ItemEvents`](lib_container_classes_item_types.md#itemevents)\<`T`\>

###### Parameters

| Name    | Type |
| :------ | :--- |
| `token` | `T`  |

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`ArrayOrNever`](lib_events_types.md#arrayornever)\<[`ItemEvents`](lib_container_classes_item_types.md#itemevents)\<`T`\>[`T`]\>\>

Inherited from: [EventEmitter](lib_events.md#eventemitter).[when](lib_events.md#when)

Defined in: [src/lib/events/index.ts:101](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L101)
