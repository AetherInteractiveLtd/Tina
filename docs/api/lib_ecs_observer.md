[@rbxts/tina](modules.md) / lib/ecs/observer

# lib/ecs/observer

## Index

### Classes

- [Observer](lib_ecs_observer.md#observer)

## Classes

### Observer

An observer is a way to listen for when an entity's data changes.

The observer will only be called when the data has been changed via the
component `set` method, therefore you should ensure that any updates needed
are made this way.

An observer acts like a query, therefore the entities that match the
observer will only be matched once the observer is called.

If a system only ran once per second, all entities that match the given
observer will be stored until the system is called, and only flushed once
the observer is iterated over.

#### Note

Do not create an observer directly, instead use the
World.createObserver method, otherwise any changes will not be
registered.

#### Type parameters

- `T` _extends_ `Tree`\<`Type`\>

#### Index

##### Constructors

- [constructor](lib_ecs_observer.md#constructor)

##### Properties

- [primaryComponent](lib_ecs_observer.md#primarycomponent)
- [storage](lib_ecs_observer.md#storage)
- [world](lib_ecs_observer.md#world)

##### Methods

- [forEach](lib_ecs_observer.md#foreach)
- [with](lib_ecs_observer.md#with)

#### Constructors

#### constructor()

##### Signature

```ts
new Observer<T>(world: World, component: Component<T>): Observer<T>;
```

##### Type parameters

- `T` _extends_ `Tree`\<`Type`\>

##### Parameters

| Name        | Type                                                 |
| :---------- | :--------------------------------------------------- |
| `world`     | [`World`](lib_ecs_world.md#world)                    |
| `component` | [`Component`](lib_ecs_component.md#component)\<`T`\> |

##### Returns

[`Observer`](lib_ecs_observer.md#observer)\<`T`\>

Defined in: [src/lib/ecs/observer.ts:60](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/observer.ts#L60)

#### Properties

##### primaryComponent

> [`AnyComponent`](lib_ecs_component.md#anycomponent)

The primary component that the observer is watching.

Defined in: [src/lib/ecs/observer.ts:41](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/observer.ts#L41)

##### storage

> `Set`\<`number`\>

A cache of all entities that match the observer.

This will store all entities that match the given event, and will not be
flushed until the observer is called.

If an entity matches an event more than once before the observer is
called, it will only be stored once.

Defined in: [src/lib/ecs/observer.ts:51](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/observer.ts#L51)

##### world

> **`Readonly`** [`World`](lib_ecs_world.md#world)

The world this observer belongs to.

Defined in: [src/lib/ecs/observer.ts:38](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/observer.ts#L38)

#### Methods

##### forEach()

Iterates over all entities that match the observer.

###### Signature

```ts
forEach(callback: Function): void;
```

###### Parameters

| Name       | Type                             | Description                          |
| :--------- | :------------------------------- | :----------------------------------- |
| `callback` | (`entityId`: `number`) => `void` | The callback to run for each entity. |

###### Returns

`void`

Defined in: [src/lib/ecs/observer.ts:70](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/observer.ts#L70)

##### with()

Ensures that any entities that match the observer also have a given
component.

Within each forEach call for each entity, this is syntactic sugar for:

```ts
if (!world.hasComponent(component)) {
  return;
}
```

###### Signature

```ts
with(component: AnyComponent): Observer<T>;
```

###### Parameters

| Name        | Type                                                | Description                 |
| :---------- | :-------------------------------------------------- | :-------------------------- |
| `component` | [`AnyComponent`](lib_ecs_component.md#anycomponent) | The component to check for. |

###### Returns

[`Observer`](lib_ecs_observer.md#observer)\<`T`\>

The observer instance.

Defined in: [src/lib/ecs/observer.ts:105](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/observer.ts#L105)
