[@rbxts/tina](../modules.md) / [index](../index.md) / default

# default

## Index

### Variables

- [log](default.md#log)

### Functions

- [core](default.md#core)
- [createComponent](default.md#createcomponent)
- [createFlyweight](default.md#createflyweight)
- [createTag](default.md#createtag)
- [createWorld](default.md#createworld)
- [process](default.md#process)
- [registerGame](default.md#registergame)
- [setUserClass](default.md#setuserclass)
- [when](default.md#when)

## Variables

### log

> **`Const`** [`Scope`](../lib_logger_Logger.md#scope)

Defined in: [src/index.ts:119](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/index.ts#L119)

## Functions

### core()

Fetch the Tina core, a replacement for the `game` object in the vanilla Roblox API.

#### Signature

```ts
core(): default;
```

#### Returns

[`default`](../lib_core.md#default)

Defined in: [src/index.ts:101](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/index.ts#L101)

---

### createComponent()

Creates a component that matches the given schema.

Internally this creates an array for each property in the schema, where the
index of the array matches an entity id. This allows for fast lookups of
component data.

The array is pre-allocated to the given size, so it is important to ensure
that you do not access the component data for an entity that does not exist,
or that does not have the component. This is because the array could hold
data for a given entity, despite the fact that the entity would be invalid.

Components are singletons, and should be created once per component type.
Components also persist between worlds, therefore you do not need more than
one component per world. EntityIds are global, therefore the index of a
given entity will always match the index of the component data.

#### Signature

```ts
createComponent<T>(schema: T): Component<T>;
```

#### Type parameters

- `T` _extends_ `Tree`\<`Type`\>

#### Parameters

| Name     | Type | Description                      |
| :------- | :--- | :------------------------------- |
| `schema` | `T`  | The properties of the component. |

#### Returns

[`Component`](../lib_ecs_component.md#component)\<`T`\>

A single component instance.

Defined in: [src/index.ts:174](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/index.ts#L174)

---

### createFlyweight()

Creates a flyweight component; a component that holds data that is
shared between all entities that have the component.

Flyweight components are useful for minimizing memory usage by only
storing one set of data for a given component. Rather than having an
array of data for each entity, there is only a single set of data.

#### Signature

```ts
createFlyweight<T>(schema: T): Flyweight<T>;
```

#### Type parameters

- `T` _extends_ `object`

#### Parameters

| Name     | Type | Description                      |
| :------- | :--- | :------------------------------- |
| `schema` | `T`  | The properties of the component. |

#### Returns

[`Flyweight`](../lib_ecs_component.md#flyweight)\<`T`\>

A flyweight component.

Defined in: [src/index.ts:208](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/index.ts#L208)

---

### createTag()

Creates a tag component; a component that has no data.

Tags are useful for marking entities as having a certain property, without
the overhead of storing any data. For example, you could use a tag component
to mark an entity as being a player, and then use a system to query for all
entities that have the player tag.

Tags are singletons, and should be created once per component type. Tags
also persist between worlds, therefore you do not need more than one Tag per
world.

#### Signature

```ts
createTag(): TagComponent;
```

#### Returns

[`TagComponent`](../lib_ecs_component.md#tagcomponent)

A tag component.

Defined in: [src/index.ts:192](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/index.ts#L192)

---

### createWorld()

Create a new ECS World.

The world is the main access point for the ECS functionality, along with
being responsible for creating and managing entities, components, and
systems.

Typically there is only a single world, but there is no limit on the number
of worlds an application can create.

#### Signature

```ts
createWorld(options?: WorldOptions): World;
```

#### Parameters

| Name       | Type                                               | Description                                    |
| :--------- | :------------------------------------------------- | :--------------------------------------------- |
| `options?` | [`WorldOptions`](../lib_ecs_world.md#worldoptions) | Optional world options to configure the world. |

#### Returns

[`World`](../lib_ecs_world.md#world)

a new ECS World.

Defined in: [src/index.ts:149](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/index.ts#L149)

---

### process()

Used to add new processes to the processor.

#### Signature

```ts
process(name: string): Process;
```

#### Parameters

| Name   | Type     | Description          |
| :----- | :------- | :------------------- |
| `name` | `string` | process name to add. |

#### Returns

[`Process`](../lib_process_process.md#process)

a Process object.

Defined in: [src/index.ts:111](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/index.ts#L111)

---

### registerGame()

! ⚠️ **THIS SHOULD ONLY EVER BE USED ONCE PER GAME** ⚠️ !

Register the game instance with Tina, this is required for Tina to work. All `Process`es will only begin **after** this is called.

#### Signature

```ts
registerGame(_name: string): default;
```

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `_name` | `string` |

#### Returns

[`default`](../lib_core_game.md#default)

The game instance, this isn't very useful but contains certain global methods.

Defined in: [src/index.ts:46](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/index.ts#L46)

---

### setUserClass()

! ⚠️ **THIS SHOULD ONLY EVER BE USED ONCE PER GAME** ⚠️ !

Override the default User/Player class (useful to define your own behaviours and overall data liveries).

#### Usage example:

```ts
import Tina, { User } from "@rbxts/tina";

class extends User {
  constructor(ref: Player | number) {
    super(ref);
  }
}

Tina.setUserClass(User); // THIS SHOULD BE CALLED **BEFORE** `Tina.registerGame`
Tina.registerGame("MyGame");
```

_NOTE: The Client and Server can use their own User classes, but they should remain compatible with each other._

#### Signature

```ts
setUserClass(userClass: Function): void;
```

#### Parameters

| Name        | Type                                                                                                             | Description                    |
| :---------- | :--------------------------------------------------------------------------------------------------------------- | :----------------------------- |
| `userClass` | (`ref`: `number` \| `Player`) => [`DefaultUserDeclaration`](../lib_user_default_types.md#defaultuserdeclaration) | The new User class constructor |

#### Returns

`void`

Defined in: [src/index.ts:90](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/index.ts#L90)

---

### when()

Used to connect to Tina's internal events, such as when a user is registered, etc.

#### Signature

```ts
when<T>(event: T): EventListener<[...(T extends keyof TinaInternalEvents ? TinaInternalEvents[T] : Exposed[T])]>;
```

#### Type parameters

- `T` _extends_ keyof [`TinaInternalEvents`](../lib_events_tina_events.md#tinainternalevents)

#### Parameters

| Name    | Type | Description                                        |
| :------ | :--- | :------------------------------------------------- |
| `event` | `T`  | event name (defined internally specially for Tina) |

#### Returns

[`EventListener`](../lib_events.md#eventlistener)\<[`...(T extends keyof TinaInternalEvents ? TinaInternalEvents[T] : Exposed[T])`]\>

an EventListener object.

Defined in: [src/index.ts:127](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/index.ts#L127)
