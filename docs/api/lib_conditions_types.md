[@rbxts/tina](modules.md) / lib/conditions/types

# lib/conditions/types

## Index

### Type Aliases

- [Condition](lib_conditions_types.md#condition)
- [ConditionCallback](lib_conditions_types.md#conditioncallback)

## Type Aliases

### Condition

> \<`T`\> [`ConditionCallback`](lib_conditions_types.md#conditioncallback)\<`T`\> \| `boolean`

#### Type parameters

- `T` _extends_ `unknown`[] = `unknown`[]

Defined in: [src/lib/conditions/types.d.ts:1](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/types.d.ts#L1)

---

### ConditionCallback

> \<`T`\> `Function`

#### Type parameters

- `T` _extends_ `unknown`[] = `unknown`[]

#### Type declaration

##### Signature

```ts
(...args: [...T]): boolean;
```

##### Parameters

| Name      | Type     |
| :-------- | :------- |
| `...args` | [`...T`] |

##### Returns

`boolean`

Defined in: [src/lib/conditions/types.d.ts:4](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/types.d.ts#L4)
