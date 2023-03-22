[@rbxts/tina](modules.md) / lib/core

# lib/core

## Index

### Classes

- [default](lib_core.md#default)

## Classes

### default

#### Hierarchy

- [`EventEmitter`](lib_events.md#eventemitter)\<`CoreEvents`\>.**default**

#### Index

##### Constructors

- [constructor](lib_core.md#constructor)

##### Properties

- [events](lib_core.md#events)

##### Methods

- [emit](lib_core.md#emit)
- [when](lib_core.md#when)

#### Constructors

#### constructor()

##### Signature

```ts
new default(): default;
```

##### Returns

[`default`](lib_core.md#default)

Inherited from: [EventEmitter](lib_events.md#eventemitter).[constructor](lib_events.md#constructor)

#### Properties

##### events

> **`Protected`** **`Readonly`** `Record`\<`string`, [`EventListener`](lib_events.md#eventlistener)\<[]\>[]\> = `{}`

Inherited from: [EventEmitter](lib_events.md#eventemitter).[events](lib_events.md#events)

Defined in: [src/lib/events/index.ts:87](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L87)

#### Methods

##### emit()

Emits the event, either resuming the yeilded threads or invoking the do's chain.

###### Signature

```ts
emit<T, S>(token: T, ...args: S): void;
```

###### Type parameters

- `T` _extends_ `"player:added"`
- `S` _extends_ `unknown`[] & (`player`: `never`) => `void`

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

##### when()

Lets you listen to a specific event from your Events interface definition.

###### Signature

```ts
when<T, U>(token?: T): undefined | T extends void ? EventListener<never> : EventListener<U extends unknown[] ? U : never>;
```

###### Type parameters

- `T` _extends_ `"player:added"`
- `U` _extends_ (`player`: `never`) => `void`

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
when<T>(token: T): EventListener<ArrayOrNever<CoreEvents[T]>>;
```

###### Type parameters

- `T` _extends_ `"player:added"`

###### Parameters

| Name    | Type |
| :------ | :--- |
| `token` | `T`  |

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`ArrayOrNever`](lib_events_types.md#arrayornever)\<`CoreEvents`[`T`]\>\>

Inherited from: [EventEmitter](lib_events.md#eventemitter).[when](lib_events.md#when)

Defined in: [src/lib/events/index.ts:101](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L101)
