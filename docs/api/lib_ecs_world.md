[@rbxts/tina](modules.md) / lib/ecs/world

# lib/ecs/world

## Index

### Classes

- [World](lib_ecs_world.md#world)

### Interfaces

- [WorldOptions](lib_ecs_world.md#worldoptions)

## Classes

### World

The world is the main access point for the ECS functionality, along with
being responsible for creating and managing entities, components, and
systems.

Typically there is only a single world, but there is no limit on the number
of worlds an application can create.

#### Usage Example:

To create a new world, use the Tina.createWorld function:

```ts
const world = Tina.createWorld({...});
```

#### Index

##### Constructors

- [constructor](lib_ecs_world.md#constructor)

##### Properties

- [id](lib_ecs_world.md#id)
- [options](lib_ecs_world.md#options)

##### Methods

- [add](lib_ecs_world.md#add)
- [addComponent](lib_ecs_world.md#addcomponent)
- [addTag](lib_ecs_world.md#addtag)
- [clear](lib_ecs_world.md#clear)
- [createObserver](lib_ecs_world.md#createobserver)
- [createQuery](lib_ecs_world.md#createquery)
- [destroy](lib_ecs_world.md#destroy)
- [disableSystem](lib_ecs_world.md#disablesystem)
- [enableSystem](lib_ecs_world.md#enablesystem)
- [flush](lib_ecs_world.md#flush)
- [has](lib_ecs_world.md#has)
- [hasAllOf](lib_ecs_world.md#hasallof)
- [hasAnyOf](lib_ecs_world.md#hasanyof)
- [hasComponent](lib_ecs_world.md#hascomponent)
- [hasNoneOf](lib_ecs_world.md#hasnoneof)
- [hasTag](lib_ecs_world.md#hastag)
- [pause](lib_ecs_world.md#pause)
- [play](lib_ecs_world.md#play)
- [remove](lib_ecs_world.md#remove)
- [removeComponent](lib_ecs_world.md#removecomponent)
- [removeQuery](lib_ecs_world.md#removequery)
- [removeTag](lib_ecs_world.md#removetag)
- [scheduleSystem](lib_ecs_world.md#schedulesystem)
- [scheduleSystems](lib_ecs_world.md#schedulesystems)
- [size](lib_ecs_world.md#size)
- [start](lib_ecs_world.md#start)
- [toString](lib_ecs_world.md#tostring)
- [unscheduleSystem](lib_ecs_world.md#unschedulesystem)
- [unscheduleSystems](lib_ecs_world.md#unschedulesystems)

#### Constructors

#### constructor()

##### Signature

```ts
new World(options?: WorldOptions): World;
```

##### Parameters

| Name       | Type                                            |
| :--------- | :---------------------------------------------- |
| `options?` | [`WorldOptions`](lib_ecs_world.md#worldoptions) |

##### Returns

[`World`](lib_ecs_world.md#world)

Defined in: [src/lib/ecs/world.ts:77](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L77)

#### Properties

##### id

> `string`

A unique identifier for the world.

Defined in: [src/lib/ecs/world.ts:70](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L70)

##### options

> **`Readonly`** [`WorldOptions`](lib_ecs_world.md#worldoptions)

The world options that were passed to the constructor.

Defined in: [src/lib/ecs/world.ts:67](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L67)

#### Methods

##### add()

Creates a new entity in the world.

When an entity is added to the world, the id will be assigned
immediately, but as all other operations are deferred, the entity will
not be added to any queries until the system has finished executing.

###### Signature

```ts
add(): number;
```

###### Returns

`number`

The id of the newly created entity.

Defined in: [src/lib/ecs/world.ts:91](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L91)

##### addComponent()

Adds a given component to the entity. If the entity does not exist, then
an error will be thrown. No error will be thrown if the entity already
has the component.

###### Signature

```ts
addComponent<C>(entityId: number, component: C, data?: Partial<OptionalKeys<GetComponentSchema<C>>>): World;
```

###### Type parameters

- `C` _extends_ [`AnyComponent`](lib_ecs_component.md#anycomponent)

###### Parameters

| Name        | Type                                                                                                                                       | Description                                                                                                  |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `entityId`  | `number`                                                                                                                                   | The id of the entity to add the component to.                                                                |
| `component` | `C`                                                                                                                                        | The component to add to the entity, which must have<br /> been defined previously with Tina.createComponent. |
| `data?`     | `Partial`\<[`OptionalKeys`](lib_ecs_component.md#optionalkeys)\<[`GetComponentSchema`](lib_ecs_component.md#getcomponentschema)\<`C`\>\>\> | The optional data to initialize the component with.                                                          |

###### Returns

[`World`](lib_ecs_world.md#world)

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:107](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L107)

###### Signature

```ts
addComponent(entityId: number, component: AnyFlyweight): World;
```

###### Parameters

| Name        | Type                                                |
| :---------- | :-------------------------------------------------- |
| `entityId`  | `number`                                            |
| `component` | [`AnyFlyweight`](lib_ecs_component.md#anyflyweight) |

###### Returns

[`World`](lib_ecs_world.md#world)

Defined in: [src/lib/ecs/world.ts:112](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L112)

##### addTag()

Adds a tag component to an entity.

###### Signature

```ts
addTag<C>(entityId: number, tag: C): World;
```

###### Type parameters

- `C` _extends_ [`TagComponent`](lib_ecs_component.md#tagcomponent)

###### Parameters

| Name       | Type     | Description                             |
| :--------- | :------- | :-------------------------------------- |
| `entityId` | `number` | The id of the entity to add the tag to. |
| `tag`      | `C`      | The tag component to add to the entity. |

###### Returns

[`World`](lib_ecs_world.md#world)

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:150](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L150)

##### clear()

Removes all entities from the world.

###### Signature

```ts
clear(): void;
```

###### Returns

`void`

Defined in: [src/lib/ecs/world.ts:157](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L157)

##### createObserver()

Creates a new observer for the given component. Observers are used to
listen for changes to a component.

###### Signature

```ts
createObserver<C>(component: C): Observer<GetComponentSchema<C>>;
```

###### Type parameters

- `C` _extends_ [`AnyComponent`](lib_ecs_component.md#anycomponent)

###### Parameters

| Name        | Type | Description               |
| :---------- | :--- | :------------------------ |
| `component` | `C`  | The component to observe. |

###### Returns

[`Observer`](lib_ecs_observer.md#observer)\<[`GetComponentSchema`](lib_ecs_component.md#getcomponentschema)\<`C`\>\>

The newly created observer.

Defined in: [src/lib/ecs/world.ts:169](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L169)

##### createQuery()

Creates a new query to filter entities based on the given components.

#### Usage Example:

```ts
import { ALL, ANY, NOT } from "@rbxts/tina";
import { Position, Velocity, Acceleration } from "./components";

const query = world.createQuery(Position, ANY(Velocity, NOT(Acceleration)));
```

###### Signature

```ts
createQuery(arg: AnyComponent | TagComponent | RawQuery, ...raw: RawQuery[]): Query;
```

###### Parameters

| Name     | Type                                                                                                                                                  | Description                                                                                    |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| `arg`    | [`AnyComponent`](lib_ecs_component.md#anycomponent) \| [`TagComponent`](lib_ecs_component.md#tagcomponent) \| [`RawQuery`](lib_ecs_query.md#rawquery) | -                                                                                              |
| `...raw` | [`RawQuery`](lib_ecs_query.md#rawquery)[]                                                                                                             | A query using components, and optionally the provided helper<br />functions ALL, ANY, and NOT. |

###### Returns

[`Query`](lib_ecs_query.md#query)

A new Query.

Defined in: [src/lib/ecs/world.ts:192](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L192)

##### destroy()

Halts the current execution of the world and destroys the world.

###### Signature

```ts
destroy(): void;
```

###### Returns

`void`

Defined in: [src/lib/ecs/world.ts:216](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L216)

##### disableSystem()

Disables the given system. This will prevent the system from being
executed, but will not remove it from the scheduler.

As scheduling a system can be a potentially expensive operation,
this can be used for systems that are expected to be reenabled at a
later point.

###### Signature

```ts
disableSystem(system: System): World;
```

###### Parameters

| Name     | Type                                 | Description                         |
| :------- | :----------------------------------- | :---------------------------------- |
| `system` | [`System`](lib_ecs_system.md#system) | The system that should be disabled. |

###### Returns

[`World`](lib_ecs_world.md#world)

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:242](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L242)

##### enableSystem()

Enabled a system.

This will not error if a system that is already enabled is enabled
again.

###### Signature

```ts
enableSystem(system: System): World;
```

###### Parameters

| Name     | Type                                 | Description                        |
| :------- | :----------------------------------- | :--------------------------------- |
| `system` | [`System`](lib_ecs_system.md#system) | The system that should be enabled. |

###### Returns

[`World`](lib_ecs_world.md#world)

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:258](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L258)

##### flush()

Flushes any pending entity removal, or deferred component changes in the
world.

_This is called automatically whenever a system has finished executing,
and should not typically be called manually._

If you are not using the inbuilt scheduler, you should call this method
at regular intervals to ensure that any pending changes are applied.

###### Signature

```ts
flush(): void;
```

###### Returns

`void`

Defined in: [src/lib/ecs/world.ts:274](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L274)

##### has()

Checks if a given entity is currently alive in the world.

###### Signature

```ts
has(entityId: number): boolean;
```

###### Parameters

| Name       | Type     | Description                    |
| :--------- | :------- | :----------------------------- |
| `entityId` | `number` | The id of the entity to check. |

###### Returns

`boolean`

Whether or not the entity is alive.

Defined in: [src/lib/ecs/world.ts:291](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L291)

##### hasAllOf()

Checks if a given entity has all of the given components.

###### Signature

```ts
hasAllOf(entityId: number, ...components: AnyComponent[]): boolean;
```

###### Parameters

| Name            | Type                                                  | Description                                |
| :-------------- | :---------------------------------------------------- | :----------------------------------------- |
| `entityId`      | `number`                                              | The id of the entity to check.             |
| `...components` | [`AnyComponent`](lib_ecs_component.md#anycomponent)[] | Any number of components to check against. |

###### Returns

`boolean`

Whether or not the entity has all of the given components.

Defined in: [src/lib/ecs/world.ts:303](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L303)

##### hasAnyOf()

Returns whether or not the given entity has at least one of the given
components.

###### Signature

```ts
hasAnyOf(entityId: number, ...components: AnyComponent[]): boolean;
```

###### Parameters

| Name            | Type                                                  | Description                                |
| :-------------- | :---------------------------------------------------- | :----------------------------------------- |
| `entityId`      | `number`                                              | The id of the entity to check.             |
| `...components` | [`AnyComponent`](lib_ecs_component.md#anycomponent)[] | Any number of components to check against. |

###### Returns

`boolean`

whether or not the entity has at least one of of the given
components.

Defined in: [src/lib/ecs/world.ts:323](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L323)

##### hasComponent()

Returns whether or not the given entity has the given component.

###### Signature

```ts
hasComponent(entityId: number, component: AnyComponent | AnyFlyweight): boolean;
```

###### Parameters

| Name        | Type                                                                                                       | Description                     |
| :---------- | :--------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `entityId`  | `number`                                                                                                   | The id of the entity to check.  |
| `component` | [`AnyComponent`](lib_ecs_component.md#anycomponent) \| [`AnyFlyweight`](lib_ecs_component.md#anyflyweight) | The component to check against. |

###### Returns

`boolean`

true if the entity has the given component.

Defined in: [src/lib/ecs/world.ts:341](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L341)

##### hasNoneOf()

Checks if a given entity has none of the given components.

###### Signature

```ts
hasNoneOf(entityId: number, ...components: AnyComponent[]): boolean;
```

###### Parameters

| Name            | Type                                                  | Description                                |
| :-------------- | :---------------------------------------------------- | :----------------------------------------- |
| `entityId`      | `number`                                              | The id of the entity to check.             |
| `...components` | [`AnyComponent`](lib_ecs_component.md#anycomponent)[] | Any number of components to check against. |

###### Returns

`boolean`

true if the entity has none of the given components.

Defined in: [src/lib/ecs/world.ts:354](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L354)

##### hasTag()

Returns whether or not the given entity has the given tag.

###### Signature

```ts
hasTag<C>(entityId: number, tag: C): boolean;
```

###### Type parameters

- `C` _extends_ [`TagComponent`](lib_ecs_component.md#tagcomponent)

###### Parameters

| Name       | Type     | Description                    |
| :--------- | :------- | :----------------------------- |
| `entityId` | `number` | The id of the entity to check. |
| `tag`      | `C`      | The tag to check against.      |

###### Returns

`boolean`

True if the entity has the tag.

Defined in: [src/lib/ecs/world.ts:372](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L372)

##### pause()

Pauses the execution of the world.

###### Signature

```ts
pause(): void;
```

###### Returns

`void`

Defined in: [src/lib/ecs/world.ts:379](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L379)

##### play()

Continues the execution of the world from its current state.

###### Signature

```ts
play(): void;
```

###### Returns

`void`

Defined in: [src/lib/ecs/world.ts:386](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L386)

##### remove()

Removes the given entity from the world, including all of its components.

The entity will be removed from the world upon the next deferred update.

###### Signature

```ts
remove(entityId: number): World;
```

###### Parameters

| Name       | Type     | Description                     |
| :--------- | :------- | :------------------------------ |
| `entityId` | `number` | The id of the entity to remove. |

###### Returns

[`World`](lib_ecs_world.md#world)

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:399](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L399)

##### removeComponent()

Removes the given component from the given entity.

The component will be removed from the entity upon the next deferred
update.

###### Signature

```ts
removeComponent(entityId: number, component: AnyComponent | AnyFlyweight): World;
```

###### Parameters

| Name        | Type                                                                                                       | Description                                                        |
| :---------- | :--------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| `entityId`  | `number`                                                                                                   | The id of the entity to remove the component from.                 |
| `component` | [`AnyComponent`](lib_ecs_component.md#anycomponent) \| [`AnyFlyweight`](lib_ecs_component.md#anyflyweight) | The component singleton that will be removed from the<br />entity. |

###### Returns

[`World`](lib_ecs_world.md#world)

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:417](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L417)

##### removeQuery()

Removes a query from the world.

Queries typically do not need to be removed and should last the lifetime
of the world. However, this method is provided for cases where a query
needs to be removed.

###### Signature

```ts
removeQuery(query: Query): World;
```

###### Parameters

| Name    | Type                              | Description          |
| :------ | :-------------------------------- | :------------------- |
| `query` | [`Query`](lib_ecs_query.md#query) | The query to remove. |

###### Returns

[`World`](lib_ecs_world.md#world)

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:449](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L449)

##### removeTag()

Removes the given tag from the given entity.

###### Signature

```ts
removeTag<C>(entityId: number, tag: C): World;
```

###### Type parameters

- `C` _extends_ [`TagComponent`](lib_ecs_component.md#tagcomponent)

###### Parameters

| Name       | Type     | Description                                  |
| :--------- | :------- | :------------------------------------------- |
| `entityId` | `number` | The id of the entity to remove the tag from. |
| `tag`      | `C`      | The component to remove.                     |

###### Returns

[`World`](lib_ecs_world.md#world)

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:466](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L466)

##### scheduleSystem()

Schedules an individual system to be executed in the world.

Calling this function is a potentially expensive operation. It is best
advised to use [scheduleSystems](lib_ecs_world.md#schedulesystems) instead, and add multiple
systems at once - this is to avoid the unnecessary overhead of sorting
systems.

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

A promise that resolves when the system has been scheduled.

Defined in: [src/lib/ecs/world.ts:482](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L482)

##### scheduleSystems()

Schedules a given set of systems to be executed in the world.

###### Signature

```ts
scheduleSystems(...systems: System[]): Promise<void>;
```

###### Parameters

| Name         | Type                                   | Description              |
| :----------- | :------------------------------------- | :----------------------- |
| `...systems` | [`System`](lib_ecs_system.md#system)[] | The systems to schedule. |

###### Returns

`Promise`\<`void`\>

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:493](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L493)

##### size()

###### Signature

```ts
size(): number;
```

###### Returns

`number`

The number of entities currently in the world.

Defined in: [src/lib/ecs/world.ts:500](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L500)

##### start()

Starts the execution of the world.

This should only be called after all components, and preferably all
systems have been registered.

###### Signature

```ts
start(): Promise<World>;
```

###### Returns

`Promise`\<[`World`](lib_ecs_world.md#world)\>

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:512](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L512)

##### toString()

###### Signature

```ts
toString(): string;
```

###### Returns

`string`

The name of the world. This defaults to "World", unless
specified by the WorldOptions.

Defined in: [src/lib/ecs/world.ts:524](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L524)

##### unscheduleSystem()

Unschedule a system from the system manager.

If a system needs to be re-scheduled, it is recommended instead to
disable it using [disableSystem](lib_ecs_world.md#disablesystem), as scheduling a
a system requires the system to be re-sorted.

###### Signature

```ts
unscheduleSystem(system: System): World;
```

###### Parameters

| Name     | Type                                 | Description               |
| :------- | :----------------------------------- | :------------------------ |
| `system` | [`System`](lib_ecs_system.md#system) | The system to unschedule. |

###### Returns

[`World`](lib_ecs_world.md#world)

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:539](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L539)

##### unscheduleSystems()

Unschedule a set of systems from the system manager.

If a system needs to be re-scheduled, it is recommended instead to
disable it using SystemManager.disableSystem, as scheduling a
a system requires the system to be re-sorted.

###### Signature

```ts
unscheduleSystems(...systems: System[]): World;
```

###### Parameters

| Name         | Type                                   | Description                |
| :----------- | :------------------------------------- | :------------------------- |
| `...systems` | [`System`](lib_ecs_system.md#system)[] | The systems to unschedule. |

###### Returns

[`World`](lib_ecs_world.md#world)

The world instance to allow for method chaining.

Defined in: [src/lib/ecs/world.ts:556](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L556)

## Interfaces

### WorldOptions

#### Index

##### Properties

- [defaultExecutionGroup](lib_ecs_world.md#defaultexecutiongroup)
- [name](lib_ecs_world.md#name)

#### Properties

##### defaultExecutionGroup?

> [`ExecutionGroup`](lib_ecs_system.md#executiongroup)

The default execution group for systems. Defaults to `Heartbeat`.

Defined in: [src/lib/ecs/world.ts:31](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L31)

##### name?

> `string`

The name of the world. This can be used for debugging purposes
(potentially useful if you have multiple worlds). Defaults to `World`.

Defined in: [src/lib/ecs/world.ts:36](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/world.ts#L36)
