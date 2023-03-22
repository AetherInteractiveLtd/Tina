[@rbxts/tina](modules.md) / lib/ecs/entity-manager

# lib/ecs/entity-manager

## Index

### Classes

- [EntityManager](lib_ecs_entity_manager.md#entitymanager)

### Functions

- [getNextComponentId](lib_ecs_entity_manager.md#getnextcomponentid)
- [internal_getGlobalEntityId](lib_ecs_entity_manager.md#internal_getglobalentityid)
- [internal_resetGlobalState](lib_ecs_entity_manager.md#internal_resetglobalstate)

## Classes

### EntityManager

A class for managing entities within the world.

This class is created internally by the World class, and should not
be accessed directly.

//TODO: Remove the weird coupling between this and the world class.

#### Index

##### Constructors

- [constructor](lib_ecs_entity_manager.md#constructor)

##### Properties

- [archetypes](lib_ecs_entity_manager.md#archetypes)
- [entities](lib_ecs_entity_manager.md#entities)
- [updateTo](lib_ecs_entity_manager.md#updateto)

##### Methods

- [alive](lib_ecs_entity_manager.md#alive)
- [createEntity](lib_ecs_entity_manager.md#createentity)
- [getEntityId](lib_ecs_entity_manager.md#getentityid)
- [getNumberOfEntitiesInUse](lib_ecs_entity_manager.md#getnumberofentitiesinuse)
- [removeEntity](lib_ecs_entity_manager.md#removeentity)

#### Constructors

#### constructor()

##### Signature

```ts
new EntityManager(): EntityManager;
```

##### Returns

[`EntityManager`](lib_ecs_entity_manager.md#entitymanager)

Defined in: [src/lib/ecs/entity-manager.ts:53](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L53)

#### Properties

##### archetypes

> `Map`\<`string`, [`Archetype`](lib_ecs_collections_archetype.md#archetype)\>

Defined in: [src/lib/ecs/entity-manager.ts:45](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L45)

##### entities

> [`Archetype`](lib_ecs_collections_archetype.md#archetype)[] = `[]`

The current archetype of a given entity, where the index of the array
is the entity's id.

Defined in: [src/lib/ecs/entity-manager.ts:50](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L50)

##### updateTo

> [`Archetype`](lib_ecs_collections_archetype.md#archetype)[] = `[]`

Defined in: [src/lib/ecs/entity-manager.ts:51](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L51)

#### Methods

##### alive()

###### Signature

```ts
alive(entityId: number): boolean;
```

###### Parameters

| Name       | Type     |
| :--------- | :------- |
| `entityId` | `number` |

###### Returns

`boolean`

True if the entity id is currently in the world.

Defined in: [src/lib/ecs/entity-manager.ts:60](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L60)

##### createEntity()

Creates a new entity in the world.

###### Signature

```ts
createEntity(): number;
```

###### Returns

`number`

The id of the next available entity.

Defined in: [src/lib/ecs/entity-manager.ts:69](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L69)

##### getEntityId()

###### Signature

```ts
getEntityId(): number;
```

###### Returns

`number`

The next available entity id.

Defined in: [src/lib/ecs/entity-manager.ts:101](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L101)

##### getNumberOfEntitiesInUse()

###### Signature

```ts
getNumberOfEntitiesInUse(): number;
```

###### Returns

`number`

The number of entities that are currently alive in the world.

Defined in: [src/lib/ecs/entity-manager.ts:108](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L108)

##### removeEntity()

Removes the given entity from the world, including all its components.

###### Signature

```ts
removeEntity(entityId: number): void;
```

###### Parameters

| Name       | Type     | Description                     |
| :--------- | :------- | :------------------------------ |
| `entityId` | `number` | The id of the entity to remove. |

###### Returns

`void`

Defined in: [src/lib/ecs/entity-manager.ts:116](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L116)

## Functions

### getNextComponentId()

#### Signature

```ts
getNextComponentId(): number;
```

#### Returns

`number`

the next available component id.

Defined in: [src/lib/ecs/entity-manager.ts:26](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L26)

---

### internal_getGlobalEntityId()

#### Signature

```ts
internal_getGlobalEntityId(): number;
```

#### Returns

`number`

Defined in: [src/lib/ecs/entity-manager.ts:19](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L19)

---

### internal_resetGlobalState()

#### Signature

```ts
internal_resetGlobalState(): void;
```

#### Returns

`void`

Defined in: [src/lib/ecs/entity-manager.ts:13](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/entity-manager.ts#L13)
