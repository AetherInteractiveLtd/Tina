[@rbxts/tina](modules.md) / lib/process/scheduler

# lib/process/scheduler

## Index

### Classes

- [ProcessScheduler](lib_process_scheduler.md#processscheduler)

### Variables

- [default](lib_process_scheduler.md#default)

## Classes

### ProcessScheduler

#### Index

##### Constructors

- [constructor](lib_process_scheduler.md#constructor)

##### Methods

- [addProcess](lib_process_scheduler.md#addprocess)
- [getProcess](lib_process_scheduler.md#getprocess)
- [hasProcess](lib_process_scheduler.md#hasprocess)
- [removeProcess](lib_process_scheduler.md#removeprocess)
- [start](lib_process_scheduler.md#start)

#### Constructors

#### constructor()

##### Signature

```ts
new ProcessScheduler(): ProcessScheduler;
```

##### Returns

[`ProcessScheduler`](lib_process_scheduler.md#processscheduler)

Defined in: [src/lib/process/scheduler.ts:19](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/scheduler.ts#L19)

#### Methods

##### addProcess()

###### Signature

```ts
addProcess(process: Process): void;
```

###### Parameters

| Name      | Type                                        |
| :-------- | :------------------------------------------ |
| `process` | [`Process`](lib_process_process.md#process) |

###### Returns

`void`

Defined in: [src/lib/process/scheduler.ts:66](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/scheduler.ts#L66)

##### getProcess()

###### Signature

```ts
getProcess(name: string): undefined | Process;
```

###### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

###### Returns

`undefined` \| [`Process`](lib_process_process.md#process)

Defined in: [src/lib/process/scheduler.ts:91](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/scheduler.ts#L91)

##### hasProcess()

###### Signature

```ts
hasProcess(name: string): boolean;
```

###### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

###### Returns

`boolean`

Defined in: [src/lib/process/scheduler.ts:87](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/scheduler.ts#L87)

##### removeProcess()

###### Signature

```ts
removeProcess(process: Process): void;
```

###### Parameters

| Name      | Type                                        |
| :-------- | :------------------------------------------ |
| `process` | [`Process`](lib_process_process.md#process) |

###### Returns

`void`

Defined in: [src/lib/process/scheduler.ts:72](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/scheduler.ts#L72)

##### start()

###### Signature

```ts
start(): void;
```

###### Returns

`void`

Defined in: [src/lib/process/scheduler.ts:95](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/scheduler.ts#L95)

## Variables

### default

> **`Const`** [`ProcessScheduler`](lib_process_scheduler.md#processscheduler)

Defined in: [src/lib/process/scheduler.ts:111](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/process/scheduler.ts#L111)
