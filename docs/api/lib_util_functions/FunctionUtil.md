[@rbxts/tina](../modules.md) / [lib/util/functions](../lib_util_functions.md) / FunctionUtil

# FunctionUtil

Offers a variety of methods for functions, most checkers or runners.

## Index

### Functions

- [isFunction](FunctionUtil.md#isfunction)
- [runOnFreeThread](FunctionUtil.md#runonfreethread)

## Functions

### isFunction()

Checks if the passed value is a Callback.

#### Signature

```ts
isFunction(func: unknown): func is Callback;
```

#### Parameters

| Name   | Type      | Description                                        |
| :----- | :-------- | :------------------------------------------------- |
| `func` | `unknown` | anything that you want to check what is a function |

#### Returns

`func is Callback`

a boolean (as a type, it returns a check that is a Callback)

Defined in: [src/lib/util/functions.ts:35](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/util/functions.ts#L35)

---

### runOnFreeThread()

Used to run asynchronous tasks in a free thread.

#### Signature

```ts
runOnFreeThread(func: Callback, ...args: unknown[]): void;
```

#### Parameters

| Name      | Type        | Description                              |
| :-------- | :---------- | :--------------------------------------- |
| `func`    | `Callback`  | a function to run.                       |
| `...args` | `unknown`[] | arguments passed to the function to run. |

#### Returns

`void`

Defined in: [src/lib/util/functions.ts:45](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/util/functions.ts#L45)
