[@rbxts/tina](../modules.md) / [lib/events/tina_events](../lib_events_tina_events.md) / TinaEvents

# TinaEvents

## Index

### Functions

- [addEventListener](TinaEvents.md#addeventlistener)
- [fireEventListener](TinaEvents.md#fireeventlistener)

## Functions

### addEventListener()

Adds a listener to the specific event mentioned, approach as there can't be recursive
imports from a file to the root file (Tina namespace).

#### Signature

```ts
addEventListener<T>(to: T): EventListener<[...(T extends keyof TinaInternalEvents ? TinaInternalEvents[T] : Exposed[T])]>;
```

#### Type parameters

- `T` _extends_ `"user:added"` \| `"user:removing"`

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `to` | `T`  | Tina event  |

#### Returns

[`EventListener`](../lib_events.md#eventlistener)\<[`...(T extends keyof TinaInternalEvents ? TinaInternalEvents[T] : Exposed[T])`]\>

and EventListener

Defined in: [src/lib/events/tina_events/index.ts:23](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/tina_events/index.ts#L23)

---

### fireEventListener()

Invoke of the specified event.

#### Signature

```ts
fireEventListener<T>(to: T, ...args: [...TinaInternalEvents[T][]]): void;
```

#### Type parameters

- `T` _extends_ keyof [`TinaInternalEvents`](../lib_events_tina_events.md#tinainternalevents)

#### Parameters

| Name      | Type                           | Description                   |
| :-------- | :----------------------------- | :---------------------------- |
| `to`      | `T`                            | event to emit.                |
| `...args` | [`...TinaInternalEvents[T][]`] | the arguments for such event. |

#### Returns

`void`

Defined in: [src/lib/events/tina_events/index.ts:52](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/tina_events/index.ts#L52)
