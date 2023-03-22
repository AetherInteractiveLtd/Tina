[@rbxts/tina](modules.md) / lib/events/types

# lib/events/types

## Index

### Interfaces

- [Default](lib_events_types.md#default)

### Type Aliases

- [ArrayOrNever](lib_events_types.md#arrayornever)
- [CondFunc](lib_events_types.md#condfunc)
- [EventNode](lib_events_types.md#eventnode)
- [StepFunc](lib_events_types.md#stepfunc)

## Interfaces

### Default

#### Index

##### Properties

- [\_default](lib_events_types.md#_default)

#### Properties

##### \_default

> `unknown`[]

Defined in: [src/lib/events/types.d.ts:15](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/types.d.ts#L15)

## Type Aliases

### ArrayOrNever

> \<`T`\> `T` _extends_ `unknown`[] ? `T` : `never`

#### Type parameters

- `T`

Defined in: [src/lib/events/types.d.ts:4](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/types.d.ts#L4)

---

### CondFunc

> [[`Condition`](lib_conditions_types.md#condition), [`COND`](lib_events.md#cond)]

Defined in: [src/lib/events/types.d.ts:6](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/types.d.ts#L6)

---

### EventNode

> `object`

```ts
{
  _next: EventNode;
  value: CondFunc | StepFunc;
}
```

#### Type declaration

| Member  | Type                                                                                     |
| :------ | :--------------------------------------------------------------------------------------- |
| `_next` | [`EventNode`](lib_events_types.md#eventnode)                                             |
| `value` | [`CondFunc`](lib_events_types.md#condfunc) \| [`StepFunc`](lib_events_types.md#stepfunc) |

Defined in: [src/lib/events/types.d.ts:9](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/types.d.ts#L9)

---

### StepFunc

> [`Callback`, [`DO`](lib_events.md#do)]

Defined in: [src/lib/events/types.d.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/events/types.d.ts#L7)
