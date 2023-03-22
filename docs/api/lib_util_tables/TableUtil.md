[@rbxts/tina](../modules.md) / [lib/util/tables](../lib_util_tables.md) / TableUtil

# TableUtil

Offers a variety of table utility methods that can be used to interact, modify or anything really
that has to do with tables.

Some of the most usefuls are `.filter()` and `.deepCopy()`.

## Index

### Functions

- [deepCopy](TableUtil.md#deepcopy)
- [filter](TableUtil.md#filter)
- [reconcile](TableUtil.md#reconcile)

## Functions

### deepCopy()

#### Signature

```ts
deepCopy(t: object): typeof t;
```

#### Parameters

| Name | Type |
| :--- | :--- |
| `t`  | \{}  |

#### Returns

_typeof_ `t`

Defined in: [src/lib/util/tables.ts:8](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/util/tables.ts#L8)

---

### filter()

#### Signature

```ts
filter(t: {} | Map<string, unknown>, filterFunc: Function): typeof t;
```

#### Parameters

| Name         | Type                                |
| :----------- | :---------------------------------- |
| `t`          | \{} \| `Map`\<`string`, `unknown`\> |
| `filterFunc` | (`item`: `unknown`) => `boolean`    |

#### Returns

_typeof_ `t`

Defined in: [src/lib/util/tables.ts:36](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/util/tables.ts#L36)

---

### reconcile()

#### Signature

```ts
reconcile(t: object, template: object): void;
```

#### Parameters

| Name       | Type |
| :--------- | :--- |
| `t`        | \{}  |
| `template` | \{}  |

#### Returns

`void`

Defined in: [src/lib/util/tables.ts:22](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/util/tables.ts#L22)
