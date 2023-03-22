[@rbxts/tina](modules.md) / lib/events

# lib/events

## Index

### Enumerations

- [EAction](lib_events.md#eaction)

### Classes

- [EventEmitter](lib_events.md#eventemitter)
- [EventListener](lib_events.md#eventlistener)

## Enumerations

### EAction

#### Index

##### Enumeration Members

- [COND](lib_events.md#cond)
- [DO](lib_events.md#do)

#### Enumeration Members

##### COND

> `"c"`

Defined in: [src/lib/events/index.ts:6](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L6)

##### DO

> `"d"`

Defined in: [src/lib/events/index.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L7)

## Classes

### EventEmitter

#### Type parameters

- `Events` _extends_ [`Default`](lib_events_types.md#default) \| \{}

#### Hierarchy

- [`Item`](lib_container_classes_item.md#item)
- [`default`](lib_core.md#default)
- [`Process`](lib_process_process.md#process)

#### Index

##### Constructors

- [constructor](lib_events.md#constructor)

##### Properties

- [events](lib_events.md#events)

##### Methods

- [emit](lib_events.md#emit)
- [when](lib_events.md#when)

#### Constructors

#### constructor()

##### Signature

```ts
new EventEmitter<Events>(): EventEmitter<Events>;
```

##### Type parameters

- `Events` _extends_ \{} \| [`Default`](lib_events_types.md#default)

##### Returns

[`EventEmitter`](lib_events.md#eventemitter)\<`Events`\>

#### Properties

##### events

> **`Protected`** **`Readonly`** `Record`\<`string`, [`EventListener`](lib_events.md#eventlistener)\<[]\>[]\> = `{}`

Defined in: [src/lib/events/index.ts:87](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L87)

#### Methods

##### emit()

Emits the event, either resuming the yeilded threads or invoking the do's chain.

###### Signature

```ts
emit<T, S>(token: T, ...args: S): void;
```

###### Type parameters

- `T` _extends_ `string` \| `number` \| `symbol`
- `S` _extends_ `unknown`[]

###### Parameters

| Name      | Type | Description                                                           |
| :-------- | :--- | :-------------------------------------------------------------------- |
| `token`   | `T`  | event to emit.                                                        |
| `...args` | `S`  | of type T which are the parameters passed to the function definition. |

###### Returns

`void`

a promise.

Defined in: [src/lib/events/index.ts:128](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L128)

##### when()

Lets you listen to a specific event from your Events interface definition.

###### Signature

```ts
when<T, U>(token?: T): undefined | T extends void ? EventListener<Events extends Default ? Events["_default"] : never> : EventListener<U extends unknown[] ? U : never>;
```

###### Type parameters

- `T` _extends_ `string` \| `number` \| `symbol`
- `U`

###### Parameters

| Name     | Type | Description                                   |
| :------- | :--- | :-------------------------------------------- |
| `token?` | `T`  | as string, should be the event to connect to. |

###### Returns

`undefined` \| `T` _extends_ `void` ? [`EventListener`](lib_events.md#eventlistener)\<`Events` _extends_ [`Default`](lib_events_types.md#default) ? `Events`[`"_default"`] : `never`\> : [`EventListener`](lib_events.md#eventlistener)\<`U` _extends_ `unknown`[] ? `U` : `never`\>

an EventListener of type T which are the parameters passed to the function.

Defined in: [src/lib/events/index.ts:95](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L95)

###### Signature

```ts
when<T>(token: T): EventListener<ArrayOrNever<Events[T]>>;
```

###### Type parameters

- `T` _extends_ `string` \| `number` \| `symbol`

###### Parameters

| Name    | Type |
| :------ | :--- |
| `token` | `T`  |

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`ArrayOrNever`](lib_events_types.md#arrayornever)\<`Events`[`T`]\>\>

Defined in: [src/lib/events/index.ts:101](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L101)

---

### EventListener

#### Type parameters

- `T` _extends_ `unknown`[] = `unknown`[]

#### Index

##### Constructors

- [constructor](lib_events.md#constructor)

##### Properties

- [yieldThreads](lib_events.md#yieldthreads)

##### Methods

- [await](lib_events.md#await)
- [condition](lib_events.md#condition)
- [do](lib_events.md#do)

#### Constructors

#### constructor()

##### Signature

```ts
new EventListener<T>(): EventListener<T>;
```

##### Type parameters

- `T` _extends_ `unknown`[] = `unknown`[]

##### Returns

[`EventListener`](lib_events.md#eventlistener)\<`T`\>

#### Properties

##### yieldThreads

> **`Protected`** **`Readonly`** `thread`[] = `[]`

Defined in: [src/lib/events/index.ts:13](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L13)

#### Methods

##### await()

Yields current thread until resumption (emit call).

###### Signature

```ts
await(): LuaTuple<unknown[]>;
```

###### Returns

`LuaTuple`\<`unknown`[]\>

Defined in: [src/lib/events/index.ts:49](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L49)

##### condition()

Conditions the next do after it, if a callback is passed to it, the callback may hold reference to the data being passed before the condition.

###### Signature

```ts
condition(condition: Condition<T>): EventListener<T>;
```

###### Parameters

| Name        | Type                                                    |
| :---------- | :------------------------------------------------------ |
| `condition` | [`Condition`](lib_conditions_types.md#condition)\<`T`\> |

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<`T`\>

The same EventListener chain, any following functions will receive as parameters whatever the last do function returned.

Defined in: [src/lib/events/index.ts:37](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L37)

##### do()

Respond to an emitted event.

_NOTE: Carefully check that your parameter types are correct; for example if you have used `Tina.setUserClass`, any `player` is **purposefully** of type `never` so that you may replace it with your custom user class_

###### Signature

```ts
do<X>(func: Function): EventListener<[X]>;
```

###### Type parameters

- `X`

###### Parameters

| Name   | Type                           |
| :----- | :----------------------------- |
| `func` | (...`args`: [`...T[]`]) => `X` |

###### Returns

[`EventListener`](lib_events.md#eventlistener)\<[`X`]\>

The same EventListener chain, any following functions will receive as parameters whatever this function returned.

Defined in: [src/lib/events/index.ts:23](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/index.ts#L23)
