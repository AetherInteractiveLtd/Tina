Below is a collection of notes on the design of Tina ECS. While Tina ECS is designed to be easy to use, it's worth taking a moment to understand the design decisions that went into it, so that you do not fall into any common pitfalls.

## Deferring Changes

**Q**: Why do we defer changes to entities?

**A**: Internally, queries store a reference to any archetype that matches the current query. When we enter a system, we iterate over each archetype and then iterate over each entity in that archetype. The problem with this is that we if were to add or remove components from entities, the entity could no longer match the given query. We would end up mutating an array that we are iterating over, which is a recipe for disaster!

There are different ways around this, but instead, we opted for the "most simple" approach. Rather than updating the archetype immediately, we simply queue up the changes to be applied at a later time.

Whenever `world.flush()` is called, we apply all of these changes at once. If you are using the in-built scheduler, this will be called automatically at the end of each system for you, so you do not typically need to worry about it. The only time you *should* need to call it manually is if you decide to manage anything that interacts with the world outside of the scheduler.

**Q**: Is creating a new entity deferred?

**A**: No. This is because components are not added to entities immediately. An entity can exist immediately because it will not be able to match any queries until it has at least one component. This is not true for entity removal, this operation is deferred.

**Q**: Is state changed in the world deferred?

**A**: No. If a system processes one entity and changes the component data, this change will be reflected in the world immediately. This is because the world is not a snapshot of the current state of the world, but rather a reference to the current state of the world. This is for performance reasons.
