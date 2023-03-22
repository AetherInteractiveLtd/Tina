[@rbxts/tina](modules.md) / lib/logger/Logger

# lib/logger/Logger

## Index

### Namespaces

- [Logger](lib_logger_Logger/Logger.md)

### Classes

- [Scope](lib_logger_Logger.md#scope)

## Classes

### Scope

#### Index

##### Constructors

- [constructor](lib_logger_Logger.md#constructor)

##### Properties

- [name](lib_logger_Logger.md#name)

##### Methods

- [getMessages](lib_logger_Logger.md#getmessages)
- [log](lib_logger_Logger.md#log)
- [scope](lib_logger_Logger.md#scope)
- [setHandler](lib_logger_Logger.md#sethandler)
- [setMaxMessages](lib_logger_Logger.md#setmaxmessages)

#### Constructors

#### constructor()

##### Signature

```ts
new Scope(name: string): Scope;
```

##### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

##### Returns

[`Scope`](lib_logger_Logger.md#scope)

Defined in: [src/lib/logger/Logger.ts:10](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/logger/Logger.ts#L10)

#### Properties

##### name

> `string`

Defined in: [src/lib/logger/Logger.ts:8](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/logger/Logger.ts#L8)

#### Methods

##### getMessages()

###### Signature

```ts
getMessages(): string[];
```

###### Returns

`string`[]

Defined in: [src/lib/logger/Logger.ts:46](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/logger/Logger.ts#L46)

##### log()

###### Signature

```ts
log(...message: defined[]): Scope;
```

###### Parameters

| Name         | Type        |
| :----------- | :---------- |
| `...message` | `defined`[] |

###### Returns

[`Scope`](lib_logger_Logger.md#scope)

Defined in: [src/lib/logger/Logger.ts:24](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/logger/Logger.ts#L24)

##### scope()

###### Signature

```ts
scope(scopeName: string): Scope;
```

###### Parameters

| Name        | Type     |
| :---------- | :------- |
| `scopeName` | `string` |

###### Returns

[`Scope`](lib_logger_Logger.md#scope)

Defined in: [src/lib/logger/Logger.ts:50](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/logger/Logger.ts#L50)

##### setHandler()

###### Signature

```ts
setHandler(handler: LoggerFunction): Scope;
```

###### Parameters

| Name      | Type             |
| :-------- | :--------------- |
| `handler` | `LoggerFunction` |

###### Returns

[`Scope`](lib_logger_Logger.md#scope)

Defined in: [src/lib/logger/Logger.ts:35](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/logger/Logger.ts#L35)

##### setMaxMessages()

###### Signature

```ts
setMaxMessages(value: number): Scope;
```

###### Parameters

| Name    | Type     |
| :------ | :------- |
| `value` | `number` |

###### Returns

[`Scope`](lib_logger_Logger.md#scope)

Defined in: [src/lib/logger/Logger.ts:40](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/logger/Logger.ts#L40)
