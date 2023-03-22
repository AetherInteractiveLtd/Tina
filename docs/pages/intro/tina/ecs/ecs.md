# Using the ECS

The ECS (Entity Component System) is a core feature of Tina.

## What is an ECS?

> ECS ("Entity Component System") describes a design approach which
> promotes code reusability by separating data from behavior. Data is
> often stored in cache-friendly ways which benefit performance. An ECS
> has the following characteristics:
>   
> - It has entities, which are unique identifiers
> - It has components, which are plain datatypes without behavior
> - Entities can contain zero or more components
> - Entities can change components dynamically
> - It has systems, which are functions matched with entities that have a certain set of components.  
> 
> The ECS design pattern is often enabled by a framework. The term
> "Entity Component System" is often used to indicate a specific
> implementation of the design pattern.

For more in-depth information, check out [this FAQ](https://github.com/SanderMertens/ecs-faq) from the creator of [Flecs](https://github.com/SanderMertens/flecs).

## Getting **Started**

To get started with the ECS, first, you need to create a new `world`. The world is the main entry point for the ECS, and nearly all functionality will be accessed through it.

Typically you will only need one world per game, but there is no restriction on the number of worlds that can be created.

<h5 a><strong><code>main.server.ts</code></strong></h5>

```ts
/* We provide default options to the world, which we will cover later. */
const world = Tina.createWorld({...});
```

From here, you can schedule systems to run, add entities, and more.

### Components

Components are a container that maps an entity's id to its data. They are plain data types, and typically do not contain any behavior.

Each data type that you have is internally represented as an array of values, where the index of the value corresponds to an entity to which it belongs. E.g. index 1 of the Position component array would be the position of entity 1 (assuming that entity 1 has a position component).

<h5 a><strong><code>components/example-component.ts</code></strong></h5>

```ts
import { ComponentTypes, Tina } from "@rbxts/tina";

export const Position = Tina.createComponent({
    value: ComponentTypes.Vector3,
});
```

!!! Note

    Unlike some other ECS implementations, Tina does not require you to register components with the underlying world. Tina stores component and entity ids as global identifiers therefore there are no collisions between worlds.

!!! Tip

    If you only have one value on a component, it can be tempting to name it the same thing as the component name, e.g. a value `position` on the Position component. We recommend in these cases naming it `value`. This is so that indexing a certain property does not look like `Position.position`, and instead `Position.value`.

Components are stored as singletons, therefore you can import them and use them directly anywhere in your code.

### Tags

Tags are a special type of component that does not contain any data. Internally they are treated as a component but do not have the overhead of storing data. These should be used over components when all you wish to do is mark an entity as having a certain property. E.g. if you want to mark an entity as being a player, you can use a tag instead of a component.

<h5 a><strong><code>tags/example-tag.ts</code></strong></h5>

```ts
import { Tina } from "@rbxts/tina";

export const PlayerTag = Tina.createTag();
```

### Entities

An entity is a unique thing in your game. It can be a player, a projectile, a tree, etc. It is a unique identifier that allows you to retrieve data on components. 

<h5 a><strong><code>main.server.ts</code></strong></h5>

```ts
const entityId = world.add();
```

We can then add components to this entity.

<h5 a><strong><code>main.server.ts</code></strong></h5>

```ts
world.addComponent(entityId, Position, {
    value: new Vector3(100, 5, 100),
});

/* This is syntactic sugar for the below. */
world.addComponent(entityId, Position);
Position.value[entityId] = new Vector3(100, 5, 100);

...

world.addTag(entityId, PlayerTag);
```

### Systems

Systems are the main way to schedule your code with the ECS. They are functions that run on a given execution group (e.g. `PostSimulation`) and allow you to easily manage the execution of your code.

Systems in Tina are set up using a class.

<h5 a><strong><code>systems/example-system.ts</code></strong></h5>

```ts
import { System } from "@rbxts/tina";

export const ExampleSystem = new (class ExampleSystem extends System {
    constructor() {
        // You can set system options in the super call, or below. We'd
        // recommend sticking to one or the other.
        super({
            executionGroup: RunService.PostSimulation,
        });
        
        /* The execution group that this system will run on. */
        this.executionGroup = RunService.PostSimulation,
    }

    /** onUpdate will be called every time the execution group fires. */
    public onUpdate(world: World) {
        print("Hello, world!");
    }
})();
```

### Queries

Queries are used to match entities that have a certain set of components. They are typically used within systems to allow us to easily batch iterate over entities that match a certain set of components.

<h5 a><strong><code>systems/example-system.ts</code></strong></h5>

```ts
import { System } from "@rbxts/tina";
import { Position, Velocity } from "components";
import { RunService } from "@rbxts/services";

/* It can be beneficial to store a reference to these values. */
const position = Position.value;
const velocity = Velocity.value;

export const ExampleSystem = new(class ExampleSystem extends System {
    private movementQuery!: Query;

    constructor() {
        super({
            executionGroup = RunService.PreSimulation,
        });
    }

    /**
     * Configure queries is automatically called when the system is scheduled.
     * We can use this to setup any queries that we need.
     */
    public configureQueries(world: World) {
        this.movementQuery = world.createQuery(ALL(Position, Velocity));
    }

    /** onUpdate will be called every time the execution group fires. */
    public onUpdate(world: World) {
        this.movementQuery.forEach(entityId => {
            // Every time we enter this system, we will get every entityId that
            // has both a Position and Velocity component.
            position[entityId] = position[entityId].add(velocity[entityId]);
        });
    }
})();
```

## Putting it all together

```ts
import { World } from "@rbxts/tina";
import { ExampleSystem } from "./systems/example-system";

const world = new World({
    defaultExecutionGroup: RunService.PostSimulation,
    name: "MyWorld",    
});

world.scheduleSystem(ExampleSystem);
world.start();

const id = world.add();
world
	.addComponent(entityId, Position, { value: new Vector3(5, 0, 5) })
	.addComponent(entityId, Velocity, { value: new Vector3(1, 2, 3) });

```
