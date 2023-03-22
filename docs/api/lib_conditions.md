[@rbxts/tina](modules.md) / lib/conditions

# lib/conditions

## Index

### Classes

- [COND](lib_conditions.md#cond)

## Classes

### COND

#### Index

##### Constructors

- [constructor](lib_conditions.md#constructor)

##### Methods

- [AND](lib_conditions.md#and)
- [NAND](lib_conditions.md#nand)
- [NOR](lib_conditions.md#nor)
- [NOT](lib_conditions.md#not)
- [OR](lib_conditions.md#or)
- [XNOR](lib_conditions.md#xnor)
- [XOR](lib_conditions.md#xor)
- [create](lib_conditions.md#create)
- [eval](lib_conditions.md#eval)

#### Constructors

#### constructor()

##### Signature

```ts
new COND(): COND;
```

##### Returns

[`COND`](lib_conditions.md#cond)

#### Methods

##### AND()

###### Signature

```ts
Static AND(first: Condition<unknown[]>, second: Condition<unknown[]>): Condition<unknown[]>;
```

###### Parameters

| Name     | Type                                                            |
| :------- | :-------------------------------------------------------------- |
| `first`  | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |
| `second` | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |

###### Returns

[`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\>

Defined in: [src/lib/conditions/index.ts:13](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/index.ts#L13)

##### NAND()

###### Signature

```ts
Static NAND(first: Condition<unknown[]>, second: Condition<unknown[]>): Condition<unknown[]>;
```

###### Parameters

| Name     | Type                                                            |
| :------- | :-------------------------------------------------------------- |
| `first`  | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |
| `second` | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |

###### Returns

[`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\>

Defined in: [src/lib/conditions/index.ts:33](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/index.ts#L33)

##### NOR()

###### Signature

```ts
Static NOR(first: Condition<unknown[]>, second: Condition<unknown[]>): Condition<unknown[]>;
```

###### Parameters

| Name     | Type                                                            |
| :------- | :-------------------------------------------------------------- |
| `first`  | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |
| `second` | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |

###### Returns

[`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\>

Defined in: [src/lib/conditions/index.ts:40](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/index.ts#L40)

##### NOT()

###### Signature

```ts
Static NOT(value: Condition<unknown[]>): Condition<unknown[]>;
```

###### Parameters

| Name    | Type                                                            |
| :------ | :-------------------------------------------------------------- |
| `value` | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |

###### Returns

[`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\>

Defined in: [src/lib/conditions/index.ts:27](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/index.ts#L27)

##### OR()

###### Signature

```ts
Static OR(first: Condition<unknown[]>, second: Condition<unknown[]>): Condition<unknown[]>;
```

###### Parameters

| Name     | Type                                                            |
| :------- | :-------------------------------------------------------------- |
| `first`  | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |
| `second` | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |

###### Returns

[`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\>

Defined in: [src/lib/conditions/index.ts:20](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/index.ts#L20)

##### XNOR()

###### Signature

```ts
Static XNOR(first: Condition<unknown[]>, second: Condition<unknown[]>): Condition<unknown[]>;
```

###### Parameters

| Name     | Type                                                            |
| :------- | :-------------------------------------------------------------- |
| `first`  | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |
| `second` | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |

###### Returns

[`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\>

Defined in: [src/lib/conditions/index.ts:54](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/index.ts#L54)

##### XOR()

###### Signature

```ts
Static XOR(first: Condition<unknown[]>, second: Condition<unknown[]>): Condition<unknown[]>;
```

###### Parameters

| Name     | Type                                                            |
| :------- | :-------------------------------------------------------------- |
| `first`  | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |
| `second` | [`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\> |

###### Returns

[`Condition`](lib_conditions_types.md#condition)\<`unknown`[]\>

Defined in: [src/lib/conditions/index.ts:47](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/index.ts#L47)

##### create()

###### Signature

```ts
Static create(callback: ConditionCallback<unknown[]>): ConditionCallback<unknown[]>;
```

###### Parameters

| Name       | Type                                                                            |
| :--------- | :------------------------------------------------------------------------------ |
| `callback` | [`ConditionCallback`](lib_conditions_types.md#conditioncallback)\<`unknown`[]\> |

###### Returns

[`ConditionCallback`](lib_conditions_types.md#conditioncallback)\<`unknown`[]\>

Defined in: [src/lib/conditions/index.ts:5](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/index.ts#L5)

##### eval()

###### Signature

```ts
Static eval<T>(condition: Condition<T>, ...args: T): boolean;
```

###### Type parameters

- `T` _extends_ `unknown`[]

###### Parameters

| Name        | Type                                                    |
| :---------- | :------------------------------------------------------ |
| `condition` | [`Condition`](lib_conditions_types.md#condition)\<`T`\> |
| `...args`   | `T`                                                     |

###### Returns

`boolean`

Defined in: [src/lib/conditions/index.ts:9](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/conditions/index.ts#L9)
