[@rbxts/tina](modules.md) / lib/process/process

# lib/process/process

## Index

### Classes

- [Process](lib_process_process.md#process)

## Classes

### Process

#### Hierarchy

- [`EventEmitter`](lib_events.md#eventemitter)\<`Events`\>.**Process**

#### Index

##### Constructors

- [constructor](lib_process_process.md#constructor)

##### Properties

- [events](lib_process_process.md#events)
- [isSuspended](lib_process_process.md#issuspended)
- [name](lib_process_process.md#name)
- [suspensionTime](lib_process_process.md#suspensiontime)
- [processes](lib_process_process.md#processes)

##### Methods

- [emit](lib_process_process.md#emit)
- [resume](lib_process_process.md#resume)
- [suspend](lib_process_process.md#suspend)
- [when](lib_process_process.md#when)

#### Constructors

#### constructor()

##### Signature

```ts
new Process(name: string, ticker: ProcessScheduler): Process;
```

##### Parameters

| Name     | Type                                                            |
| :------- | :-------------------------------------------------------------- |
| `name`   | `string`                                                        |
| `ticker` | [`ProcessScheduler`](lib_process_scheduler.md#processscheduler) |

##### Returns

[`Process`](lib_process_process.md#process)

Overrides: [EventEmitter](lib_events.md#eventemitter).[constructor](lib_events.md#constructor)

Defined in: [src/lib/process/process.ts:18](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/process.ts#L18)

#### Properties

##### events

> **`Protected`** **`Readonly`** `Record`\<`string`, [`EventListener`](lib_events.md#eventlistener)\<[]\>[]\> = `{}`

Inherited from: [EventEmitter](lib_events.md#eventemitter).[events](lib_events.md#events)

Defined in: [src/lib/events/index.ts:87](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L87)

##### isSuspended

> `boolean` = `false`

Defined in: [src/lib/process/process.ts:13](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/process.ts#L13)

##### name

> `string`

Defined in: [src/lib/process/process.ts:12](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/process.ts#L12)

##### suspensionTime

> `number` = `-1`

Defined in: [src/lib/process/process.ts:14](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/process.ts#L14)

##### processes

> **`Static`** `Map`\<`string`, [`Process`](lib_process_process.md#process)\>

Defined in: [src/lib/process/process.ts:10](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/process.ts#L10)

#### Methods

##### emit()

Emits the event, either resuming the yeilded threads or invoking the do's chain.

###### Signature

```ts
emit<T, S>(token: T, ...args: S): void;
```

###### Type parameters

- `T` _extends_ `"_default"`
- `S` _extends_ [`dt: number`]

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

##### resume()

###### Signature

```ts
resume(): void;
```

###### Returns

`void`

Defined in: [src/lib/process/process.ts:28](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/process.ts#L28)

##### suspend()

###### Signature

```ts
suspend(ticks: number = 1): void;
```

###### Parameters

| Name    | Type     | Default value |
| :------ | :------- | :------------ |
| `ticks` | `number` | `1`           |

###### Returns

`void`

Defined in: [src/lib/process/process.ts:33](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/process.ts#L33)

##### when()

Lets you listen to a specific event from your Events interface definition.

###### Signature

```ts
when<T, U>(token?: T): undefined | T extends void ? EventListener<[dt: number]> : EventListener<U extends unknown[] ? U : never>;
```

###### Type parameters

- `T` _extends_ `"_default"`
- `U` _extends_ [`dt: number`]

###### Parameters

| Name     | Type | Description                                   |
| :------- | :--- | :-------------------------------------------- |
| `token?` | `T`  | as string, should be the event to connect to. |

###### Returns

`undefined` \| `T` _extends_ `void` ? [`EventListener`](lib_events.md#eventlistener)\<[`dt: number`]\> : [`EventListener`](lib_events.md#eventlistener)\<`U` _extends_ `unknown`[] ? `U` : `never`\>

an EventListener of type T which are the parameters passed to the function.

Inherited from: [EventEmitter](lib_events.md#eventemitter).[when](lib_events.md#when)

Defined in: [src/lib/events/index.ts:95](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L95)

###### Signature

```ts
when<T>(token: T): EventListener<ArrayOrNever<Events[T]>>;
```

###### Type parameters

- `T` _extends_ `"_default"`

###### Parameters

| Name    | Type |
| :------ | :--- |
| `token` | `T`  |

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`ArrayOrNever`](lib_events_types.md#arrayornever)\<`Events`[`T`]\>\>

Inherited from: [EventEmitter](lib_events.md#eventemitter).[when](lib_events.md#when)

Defined in: [src/lib/events/index.ts:101](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L101)
