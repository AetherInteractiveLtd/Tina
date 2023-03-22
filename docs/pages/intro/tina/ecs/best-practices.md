## Structuring Systems

Although there is no "right" way to structure your systems (go wild!), there are a few things to keep in mind:

**Remove**: When thinking about the order, to help avoid unnecessary work it can be beneficial to perform any 'remove' operations first. If we perform a task on an entity, just for the next system to remove it, then there was likely no reason in the first place to perform the task. For example, if we have a system that moves entities, and a system that removes entities that are out of bounds, then it would be beneficial to perform the out-of-bounds check first. If the entity is out of bounds, then we can remove it, and we do not need to perform the movement task.

**Add**: By adding entities or new components to entities second, we can ensure that any systems that are interested in the new component will be able to pick it up quickly (without waiting for the next frame). For example, if we have a system that adds a `Velocity` component to entities that have a `Position` component, but these were performed last, the entity could be spawned into the world and not move until the next frame, causing slight delays.

**Update**: Finally, we can perform any 'update' operations last. We have ensured that any entities that are spawned or removed are handled, and we know that all remaining entities in the world are ready to be processed.

Systems are allowed to have as many queries as you want (although it is recommended to follow the [KISS](https://www.freecodecamp.org/news/keep-it-simple-stupid-how-to-use-the-kiss-principle-in-design/) principle), but the world will not be flushed in between each query and instead only once the system has exited. If you wished to ensure that the world is in an updated state between queries, you should call `world.flush()` manually.

```ts
class ASystem extends System {
    ...

    public onUpdate(world: World) {
        this.removeQuery(entityId => {
            // Remove entities that are out of bounds
        });
        
        world.flush();

        this.addQuery(entityId => {
            // Add new entities that we want to spawn
        });

        world.flush();

        this.updateQuery(entityId => {
            // Update the position of entities that exist
        });
    }
}
```