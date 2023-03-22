[@rbxts/tina](modules.md) / lib/ecs/system

# lib/ecs/system

## Index

### Classes

- [System](lib_ecs_system.md#system)
- [SystemManager](lib_ecs_system.md#systemmanager)

### Type Aliases

- [ExecutionGroup](lib_ecs_system.md#executiongroup)

## Classes

### System

The system class is the base class for all systems.

#### Index

##### Constructors

- [constructor](lib_ecs_system.md#constructor)

##### Properties

- [after](lib_ecs_system.md#after)
- [dt](lib_ecs_system.md#dt)
- [executionGroup](lib_ecs_system.md#executiongroup)
- [lastCalled](lib_ecs_system.md#lastcalled)
- [name](lib_ecs_system.md#name)
- [priority](lib_ecs_system.md#priority)

##### Methods

- [cleanup](lib_ecs_system.md#cleanup)
- [configureQueries](lib_ecs_system.md#configurequeries)
- [initialize](lib_ecs_system.md#initialize)
- [onUpdate](lib_ecs_system.md#onupdate)
- [prepare](lib_ecs_system.md#prepare)

#### Constructors

#### constructor()

##### Signature

```ts
new System(ctor?: Partial<System>): System;
```

##### Parameters

| Name    | Type                                              |
| :------ | :------------------------------------------------ |
| `ctor?` | `Partial`\<[`System`](lib_ecs_system.md#system)\> |

##### Returns

[`System`](lib_ecs_system.md#system)

Defined in: [src/lib/ecs/system.ts:94](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L94)

#### Properties

##### after?

> [`System`](lib_ecs_system.md#system)[]

An optional set of systems that must be executed before this system

Defined in: [src/lib/ecs/system.ts:63](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L63)

##### dt

> `number` = `0`

The time since the system was last called.

Defined in: [src/lib/ecs/system.ts:65](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L65)

##### executionGroup?

> [`ExecutionGroup`](lib_ecs_system.md#executiongroup)

The group that this system will be executed on, e.g. Heartbeat,
RenderStepped, etc.

The only requirement for an execution group is that the group has a
.Connect method.

Defined in: [src/lib/ecs/system.ts:82](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L82)

##### lastCalled

> `number` = `0`

The time that the system was last called.

Defined in: [src/lib/ecs/system.ts:84](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L84)

##### name

> `string` = `"System"`

The name of the system is primarily used for debugging purposes.

Defined in: [src/lib/ecs/system.ts:87](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L87)

##### priority

> `number` = `0`

The priority order of the system.
A higher priority means the system will execute first.

Defined in: [src/lib/ecs/system.ts:92](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L92)

#### Methods

##### cleanup()

An optional hook that can be used to clean up the system. This is useful
for cleaning up any external context that was created during the
system's lifecycle, or for cleaning up queries that were created.

###### Note

The cleanup method will only be called if the system is
unscheduled from the world, or if the world is destroyed. You do not
typically need to use this method.

###### Signature

```ts
cleanup(): void;
```

###### Returns

`void`

Defined in: [src/lib/ecs/system.ts:19](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L19)

##### configureQueries()

The configureQueries method is optionally called when the system is
first run. This is a good place to setup any queries that the system
will use.

###### Signature

```ts
configureQueries(world: World): void;
```

###### Parameters

| Name    | Type                              | Description                                                                       |
| :------ | :-------------------------------- | :-------------------------------------------------------------------------------- |
| `world` | [`World`](lib_ecs_world.md#world) | The world that this system belongs to. This will be passed<br />in automatically. |

###### Returns

`void`

Defined in: [src/lib/ecs/system.ts:28](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L28)

##### initialize()

An optional hook that can be used to initialize the system. Here we
could setup initial entities with components, or perform any other setup
logic.

This is useful as this will be called on the start of the world, but
before the first update. This means we can do any initial setup while
ensuring that the first update has all the data required.

###### Signature

```ts
initialize(world: World): void;
```

###### Parameters

| Name    | Type                              | Description                                                                       |
| :------ | :-------------------------------- | :-------------------------------------------------------------------------------- |
| `world` | [`World`](lib_ecs_world.md#world) | The world that this system belongs to. This will be passed<br />in automatically. |

###### Returns

`void`

Defined in: [src/lib/ecs/system.ts:41](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L41)

##### onUpdate()

The onUpdate method is called on every execution of this systems
execution group.

This should not typically be called manually, and instead the system
should be scheduled according to an execution group using the
World.scheduleSystem function.

###### Signature

```ts
Abstract onUpdate(world: World): void;
```

###### Parameters

| Name    | Type                              | Description                                                                                                                    |
| :------ | :-------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `world` | [`World`](lib_ecs_world.md#world) | The world that this system belongs to. This will be<br />automatically passed in by the owning world on each system execution. |

###### Returns

`void`

Defined in: [src/lib/ecs/system.ts:116](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L116)

##### prepare()

The prepare method is optionally called when the system is first run.
If this method returns a promise, the system will not be scheduled until
the promise resolves.

This hooks into the world lifecycle, and the world creation will not
be completed until this method resolves.

This is typically used to perform any asynchronous setup logic such as
loading external data or setting up external context useful for the
system. The world is not accessible at this point, so you should not
attempt to use it.

###### Signature

```ts
prepare(): Promise<void>;
```

###### Returns

`Promise`\<`void`\>

Defined in: [src/lib/ecs/system.ts:55](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L55)

---

### SystemManager

The system manager is used to handle all scheduling and execution logic of
any system in a given world.

#### Index

##### Constructors

- [constructor](lib_ecs_system.md#constructor)

##### Methods

- [disableSystem](lib_ecs_system.md#disablesystem)
- [enableSystem](lib_ecs_system.md#enablesystem)
- [scheduleSystem](lib_ecs_system.md#schedulesystem)
- [scheduleSystems](lib_ecs_system.md#schedulesystems)
- [setArgs](lib_ecs_system.md#setargs)
- [start](lib_ecs_system.md#start)
- [stop](lib_ecs_system.md#stop)
- [unscheduleSystem](lib_ecs_system.md#unschedulesystem)
- [unscheduleSystems](lib_ecs_system.md#unschedulesystems)

#### Constructors

#### constructor()

##### Signature

```ts
new SystemManager(world: World): SystemManager;
```

##### Parameters

| Name    | Type                              |
| :------ | :-------------------------------- |
| `world` | [`World`](lib_ecs_world.md#world) |

##### Returns

[`SystemManager`](lib_ecs_system.md#systemmanager)

Defined in: [src/lib/ecs/system.ts:134](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L134)

#### Methods

##### disableSystem()

Disable a system.

As scheduling a system can be a potentially expensive operation,
this can be used for systems that are expected to be reenabled at a
later point.

###### Signature

```ts
disableSystem(system: System): void;
```

###### Parameters

| Name     | Type                                 | Description                         |
| :------- | :----------------------------------- | :---------------------------------- |
| `system` | [`System`](lib_ecs_system.md#system) | The system that should be disabled. |

###### Returns

`void`

Defined in: [src/lib/ecs/system.ts:148](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L148)

##### enableSystem()

Enabled a system.

This will not error if a system that is already enabled is enabled
again.

###### Signature

```ts
enableSystem(system: System): void;
```

###### Parameters

| Name     | Type                                 | Description                        |
| :------- | :----------------------------------- | :--------------------------------- |
| `system` | [`System`](lib_ecs_system.md#system) | The system that should be enabled. |

###### Returns

`void`

Defined in: [src/lib/ecs/system.ts:162](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L162)

##### scheduleSystem()

Schedules an individual system.

Calling this function is a potentially expensive operation. It is best
advised to use [scheduleSystems](lib_ecs_system.md#schedulesystems) instead, and add multiple systems
at once.

###### Signature

```ts
scheduleSystem(system: System): Promise<void>;
```

###### Parameters

| Name     | Type                                 | Description             |
| :------- | :----------------------------------- | :---------------------- |
| `system` | [`System`](lib_ecs_system.md#system) | The system to schedule. |

###### Returns

`Promise`\<`void`\>

Defined in: [src/lib/ecs/system.ts:179](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L179)

##### scheduleSystems()

Schedules a given set of systems at once.

###### Signature

```ts
scheduleSystems(systems: System[]): Promise<void>;
```

###### Parameters

| Name      | Type                                   | Description              |
| :-------- | :------------------------------------- | :----------------------- |
| `systems` | [`System`](lib_ecs_system.md#system)[] | The systems to schedule. |

###### Returns

`Promise`\<`void`\>

Defined in: [src/lib/ecs/system.ts:188](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L188)

##### setArgs()

Optional arguments that will be passed to all systems on each update.

`World` will always be the first argument, followed by any arguments
passed to this function in the order they were passed.

###### Note

This is currently not implemented.

###### Signature

```ts
setArgs(..._args: unknown[]): void;
```

###### Parameters

| Name       | Type        |
| :--------- | :---------- |
| `..._args` | `unknown`[] |

###### Returns

`void`

Defined in: [src/lib/ecs/system.ts:233](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L233)

##### start()

Starts the system manager.

This will run through the system lifecycle.

Prepare (Async) -> Initialize -> Setup -> Execute

Prepare will be called on all systems in parallel, and is the only step
that is allowed to be asynchronous.

###### Signature

```ts
start(systems: System[] = ...): Promise<void>;
```

###### Parameters

| Name      | Type                                   |
| :-------- | :------------------------------------- |
| `systems` | [`System`](lib_ecs_system.md#system)[] |

###### Returns

`Promise`\<`void`\>

A promise that will resolve once all systems have been prepared.

Defined in: [src/lib/ecs/system.ts:252](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L252)

##### stop()

Stops all systems from being executed.

###### Signature

```ts
stop(): void;
```

###### Returns

`void`

Defined in: [src/lib/ecs/system.ts:280](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L280)

##### unscheduleSystem()

Unschedule a system from the system manager.

If a system needs to be re-scheduled, it is recommended instead to
disable it using [disableSystem](lib_ecs_system.md#disablesystem), as scheduling a
a system requires the system to be re-sorted.

###### Signature

```ts
unscheduleSystem(system: System): void;
```

###### Parameters

| Name     | Type                                 | Description               |
| :------- | :----------------------------------- | :------------------------ |
| `system` | [`System`](lib_ecs_system.md#system) | The system to unschedule. |

###### Returns

`void`

Defined in: [src/lib/ecs/system.ts:295](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L295)

##### unscheduleSystems()

Unschedule a set of systems from the system manager.

If a system needs to be re-scheduled, it is recommended instead to
disable it using [disableSystem](lib_ecs_system.md#disablesystem), as scheduling a
a system requires the system to be re-sorted.

###### Signature

```ts
unscheduleSystems(systems: System[]): void;
```

###### Parameters

| Name      | Type                                   | Description                |
| :-------- | :------------------------------------- | :------------------------- |
| `systems` | [`System`](lib_ecs_system.md#system)[] | The systems to unschedule. |

###### Returns

`void`

Defined in: [src/lib/ecs/system.ts:308](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L308)

## Type Aliases

### ExecutionGroup

> `RBXScriptSignal` \| [`EventListener`](lib_events.md#eventlistener)\<`unknown`[]\>

Defined in: [src/lib/ecs/system.ts:7](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/system.ts#L7)
