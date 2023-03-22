# The future of Tina ECS
 
This document is a work in progress and will be updated as the project progresses. It is intended to be an overview of features that are likely to be added to Tina in the future. It is not a guarantee that these features will be added, and is subject to change.

## Flyweight Support

Flyweight components are components that are shared between entities. Rather than storing the data for a component in each entity, the data is stored in a single location and each entity is given a reference to the data. This allows for more efficient use of memory, as the data is only stored once.

## Singleton Systems
Currently, systems that have dependencies or are dependent on another system are created using the `export const SomeSystem = new(class SomeSystem extends System{})();` syntax because we need to store a reference to the system in the `after` array. This is not ideal, and we would like to find a better way to do this, as this does not allow us to use a system in multiple worlds.

It might be that we look into passing the system itself into the world `scheduleSystem` function which when instantiates its version of the system, but this is not decided yet.

## Entity Identifiers

Inspired by [Flecs](https://ajmmertens.medium.com/doing-a-lot-with-a-little-ecs-identifiers-25a72bd2647), there is more we can do with entity identifiers. At the moment, all we have is an id for an entity and a separate id for a component. But EntityIds are just numbers, therefore they are represented by a double (64-bit)! We are never going to have more than 2^64 - 1 entities (I think if we even could then 64-bit would have become a thing of the past!), therefore we can use these extra bits to store more information about the entity.

## Serialization

## Networking

Tina aims to be a one-stop shop for all your Roblox needs, and networking is a big part of that. We want to provide a simple and easy-to-use API for networking, and we want to make it as easy as possible to use. As such, we want networking to be a built-in feature of Tina, rather than a separate library. This will be developed in the future.

## Debugger

## Parallel Systems

Roblox has support for parallel lua, the problem is that we cannot just read and write on the same data from multiple threads. Currently, components are stored as singleton arrays, and different threads can't access the same array. More research needs to be done into how we can utilize this feature.

We likely need to explicitly define which systems are reading and writing to components at certain times, and then we can explore how to schedule them to run in parallel. This is a very complex problem, and we are not sure how we will solve it yet.