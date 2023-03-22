[@rbxts/tina](modules.md) / lib/util/array-utils

# lib/util/array-utils

## Index

### Functions

- [insertionSort](lib_util_array_utils.md#insertionsort)
- [slice](lib_util_array_utils.md#slice)

## Functions

### insertionSort()

#### Signature

```ts
insertionSort<T>(array: T[], comparisonFn: Function): T[];
```

#### Type parameters

- `T`

#### Parameters

| Name           | Type                              |
| :------------- | :-------------------------------- |
| `array`        | `T`[]                             |
| `comparisonFn` | (`a`: `T`, `b`: `T`) => `boolean` |

#### Returns

`T`[]

Defined in: [src/lib/util/array-utils.ts:33](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/util/array-utils.ts#L33)

---

### slice()

Creates a slice of an array, similar to JavaScript's `Array.slice`

#### Signature

```ts
slice<TValue>(array: readonly TValue[], start?: number, endPos?: number): TValue[];
```

#### Type parameters

- `TValue` _extends_ `defined`

#### Parameters

| Name      | Type                | Description      |
| :-------- | :------------------ | :--------------- |
| `array`   | readonly `TValue`[] | The array.       |
| `start?`  | `number`            | The start index. |
| `endPos?` | `number`            | The end index.   |

#### Returns

`TValue`[]

Defined in: [src/lib/util/array-utils.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/util/array-utils.ts#L7)
