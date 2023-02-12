import { HttpService } from "@rbxts/services";

import { ComponentId, EntityId } from "../types/ecs";
import { slice } from "../util/array-utils";
import { Archetype } from "./collections/archetype";
import { SparseSet } from "./collections/sparse-set";
import {
	AnyComponent,
	AnyComponentInternal,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	createComponent,
	GetComponentSchema,
	OptionalKeys,
	TagComponent,
} from "./component";
import { EntityManager } from "./entity-manager";
import { ECS, Observer } from "./observer";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ANY, NOT } from "./query";
import { ALL, Query, RawQuery } from "./query";
import { ExecutionGroup, System, SystemManager } from "./system";

export interface WorldOptions {
	/**
	 * The default execution group for systems. Defaults to `Heartbeat`.
	 */
	defaultExecutionGroup?: ExecutionGroup;
	/**
	 * The name of the world. This can be used for debugging purposes
	 * (potentially useful if you have multiple worlds). Defaults to `World`.
	 */
	name?: string;
}

/**
 * The world is the main access point for the ECS functionality, along with
 * being responsible for creating and managing entities, components, and
 * systems.
 *
 * Typically there is only a single world, but there is no limit on the number
 * of worlds an application can create.
 *
 * #### Usage Example:
 *
 * To create a new world, simply call the constructor:
 *
 * ```ts
 * import { World } from "@rbxts/tina";
 * const world = new World({...});
 * ```
 */
export class World {
	private readonly entityManager: EntityManager = new EntityManager();
	private readonly scheduler: SystemManager;

	/** Components that are waiting to be added or removed from an entity. */
	private componentsToUpdate: SparseSet = new SparseSet();
	/** A set of any component with a registered observer. */
	private observers: Map<AnyComponent, Observer> = new Map();
	/** A set of all queries that match entities in the world. */
	private queries: Array<Query> = [];

	/** The world options that were passed to the constructor. */
	public readonly options: WorldOptions;

	/** A unique identifier for the world. */
	public id = HttpService.GenerateGUID(false);
	/**
	 * Observers that have entities to update.
	 * @hidden
	 */
	public observersToUpdate: Array<[EntityId, Observer, ECS]> = [];

	constructor(options: WorldOptions) {
		this.options = options;
		this.scheduler = new SystemManager(this);
	}

	/**
	 * Creates a new entity in the world.
	 *
	 * When an entity is added to the world, the id will be assigned
	 * immediately, but as all other operations are deferred, the entity will
	 * not be added to any queries until the system has finished executing.
	 *
	 * @returns The id of the newly created entity.
	 */
	public add(): EntityId {
		return this.entityManager.createEntity();
	}

	/**
	 * Adds a given component to the entity. If the entity does not exist, then
	 * an error will be thrown. No error will be thrown if the entity already
	 * has the component.
	 *
	 * @param entityId The id of the entity to add the component to.
	 * @param component The component to add to the entity, which must have
	 *     been defined previously with {@link createComponent}.
	 * @param data The optional data to initialize the component with.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public addComponent<C extends AnyComponent>(
		entityId: EntityId,
		component: C,
		data?: Partial<OptionalKeys<GetComponentSchema<C>>>,
	): this {
		if (!this.has(entityId)) {
			throw error(`Entity ${entityId} does not exist in world ${tostring(this)}`);
		}

		this.componentsToUpdate.add(entityId);

		if (this.observers.has(component)) {
			const observer = this.observers.get(component)!;
			if (observer.storage.get(ECS.OnAdded)) {
				this.observersToUpdate.push([entityId, observer, ECS.OnAdded]);
			}
		}

		debug.profilebegin("World:addComponent");
		{
			const componentId = (component as unknown as AnyComponentInternal).componentId;
			if (
				!this.hasComponentInternal(this.entityManager.updateTo[entityId].mask, componentId)
			) {
				this.entityManager.updateTo[entityId] = this.archetypeChange(
					this.entityManager.updateTo[entityId],
					componentId,
				);
			}
		}
		debug.profileend();

		if (data !== undefined) {
			component.set(entityId, data);
		}

		return this;
	}

	/**
	 * Adds a tag component to an entity.
	 *
	 * @param entityId The id of the entity to add the tag to.
	 * @param tag The tag component to add to the entity.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public addTag<C extends TagComponent>(entityId: EntityId, tag: C): this {
		return this.addComponent(entityId, tag as unknown as AnyComponent);
	}

	/**
	 * Removes all entities from the world.
	 */
	public clear(): void {
		throw "Not implemented";
	}

	/**
	 * Creates a new observer for the given component. Observers are used to
	 * listen for changes to a component.
	 *
	 * @param component The component to observe.
	 *
	 * @returns The newly created observer.
	 */
	public createObserver<C extends AnyComponent>(component: C): Observer {
		const observer = new Observer(this, component);
		this.observers.set(component, observer);

		return observer;
	}

	/**
	 * Creates a new query to filter entities based on the given components.
	 *
	 * #### Usage Example:
	 * ```ts
	 * import { ALL, ANY, NOT } from "@rbxts/tina";
	 * import { Position, Velocity, Acceleration } from "./components";
	 *
	 * const query = world.createQuery(Position, ANY(Velocity, NOT(Acceleration)));
	 * ```
	 *
	 * @param raw A query using components, and optionally the provided helper
	 * functions {@link ALL}, {@link ANY}, and {@link NOT}.
	 *
	 * @returns A new {@link Query}.
	 */
	public createQuery(...raw: Array<RawQuery>): Query {
		let query: Query;

		debug.profilebegin("World:createQuery");
		{
			query = new Query(this, ALL(...raw));
			for (const [_, archetype] of this.entityManager.archetypes) {
				if (Query.match(archetype.mask, query.mask)) {
					query.archetypes.push(archetype);
				}
			}
			this.queries.push(query);
		}
		debug.profileend();

		return query;
	}

	/**
	 * Halts the current execution of the world and destroys the world.
	 */
	public destroy(): void {
		this.scheduler.stop();

		// TODO: Remove the need to `defer` this.
		const entities = this.entityManager.entities;
		for (let i = 0; i < entities.size(); i++) {
			if (entities[i] !== undefined) {
				this.entityManager.removeEntity(i);
			}
		}

		this.flush();
	}

	/**
	 * Disables the given system. This will prevent the system from being
	 * executed, but will not remove it from the scheduler.
	 *
	 * As scheduling a system can be a potentially expensive operation,
	 * this can be used for systems that are expected to be reenabled at a
	 * later point.
	 *
	 * @param system The system that should be disabled.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public disableSystem(system: System): this {
		this.scheduler.disableSystem(system);

		return this;
	}

	/**
	 * Enabled a system.
	 *
	 * This will not error if a system that is already enabled is enabled
	 * again.
	 *
	 * @param system The system that should be enabled.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public enableSystem(system: System): this {
		this.scheduler.enableSystem(system);

		return this;
	}

	/**
	 * Flushes any pending entity removal, or deferred component changes in the
	 * world.
	 *
	 * *This is called automatically whenever a system has finished executing,
	 * and should not typically be called manually.*
	 *
	 * If you are not using the inbuilt scheduler, you should call this method
	 * at regular intervals to ensure that any pending changes are applied.
	 */
	public flush(): void {
		debug.profilebegin("World:flush");
		{
			this.entityManager.destroyPendingEntities();
			this.updatePendingComponents();
			this.updatePendingObservers();
		}
		debug.profileend();
	}

	/**
	 * Checks if a given entity is currently alive in the world.
	 *
	 * @param entityId The id of the entity to check.
	 *
	 * @returns Whether or not the entity is alive.
	 */
	public has(entityId: EntityId): boolean {
		return this.entityManager.alive(entityId);
	}

	/**
	 * Checks if a given entity has all of the given components.
	 *
	 * @param entityId The id of the entity to check.
	 * @param components Any number of components to check against.
	 *
	 * @returns Whether or not the entity has all of the given components.
	 */
	public hasAllOf(entityId: EntityId, ...components: Array<AnyComponent>): boolean {
		for (const component of components) {
			if (!this.hasComponent(entityId, component)) {
				return false;
			}
		}

		return true;
	}

	/**
	 *
	 * @param entityId The id of the entity to check.
	 * @param components Any number of components to check against.
	 *
	 * @returns whether or not the entity has at least one of of the given
	 * components.
	 */
	public hasAnyOf(entityId: EntityId, ...components: Array<AnyComponent>): boolean {
		for (const component of components) {
			if (this.hasComponent(entityId, component)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Returns whether or not the given entity has the given component.
	 *
	 * @param entityId
	 * @param component
	 *
	 * @returns
	 */
	public hasComponent(entityId: EntityId, component: AnyComponent): boolean {
		const componentId = (component as unknown as AnyComponentInternal).componentId;
		return this.hasComponentInternal(this.entityManager.entities[entityId].mask, componentId);
	}

	/**
	 * Checks if a given entity has none of the given components.
	 *
	 * @param entityId The id of the entity to check.
	 * @param components Any number of components to check against.
	 *
	 * @returns true if the entity has none of the given components.
	 */
	public hasNoneOf(entityId: EntityId, ...components: Array<AnyComponent>): boolean {
		for (const component of components) {
			if (this.hasComponent(entityId, component)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Returns whether or not the given entity has the given tag.
	 *
	 * @param entityId The id of the entity to check.
	 * @param tag The tag to check against.
	 *
	 * @returns True if the entity has the tag.
	 */
	public hasTag<C extends TagComponent>(entityId: EntityId, tag: C): boolean {
		return this.hasComponent(entityId, tag as unknown as AnyComponent);
	}

	/**
	 * Pauses the execution of the world.
	 */
	public pause(): void {
		throw "Not implemented";
	}

	/**
	 * Continues the execution of the world from its current state.
	 */
	public play(): void {
		throw "Not implemented";
	}

	/**
	 * Removes the given entity from the world, including all of its components.
	 *
	 * The entity will be removed from the world upon the next deferred update.
	 *
	 * @param entityId The id of the entity to remove.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public remove(entityId: EntityId): this {
		this.entityManager.removeEntity(entityId);

		return this;
	}

	/**
	 * Removes the given component from the given entity.
	 *
	 * The component will be removed from the entity upon the next deferred
	 * update.
	 *
	 * @param entityId The id of the entity to remove the component from.
	 * @param component The component singleton that will be removed from the
	 * entity.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public removeComponent(entityId: EntityId, component: AnyComponent): this {
		if (!this.has(entityId)) {
			throw error(`Entity ${entityId} does not exist in world ${tostring(this)}`);
		}

		this.componentsToUpdate.add(entityId);

		if (this.observers.has(component)) {
			const observer = this.observers.get(component)!;
			if (observer.storage.get(ECS.OnRemoved)) {
				this.observersToUpdate.push([entityId, observer, ECS.OnRemoved]);
			}
		}

		debug.profilebegin("World:removeComponent");
		{
			const componentId = (component as unknown as AnyComponentInternal).componentId;
			if (
				this.hasComponentInternal(this.entityManager.updateTo[entityId].mask, componentId)
			) {
				this.entityManager.updateTo[entityId] = this.archetypeChange(
					this.entityManager.updateTo[entityId],
					componentId,
				);
			}
		}
		debug.profileend();

		return this;
	}

	/**
	 * Removes a query from the world.
	 *
	 * Queries typically do not need to be removed and should last the lifetime
	 * of the world. However, this method is provided for cases where a query
	 * needs to be removed.
	 *
	 * @param query The query to remove.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public removeQuery(query: Query): this {
		const index = this.queries.indexOf(query);
		if (index !== undefined) {
			this.queries.remove(index);
		}

		return this;
	}

	/**
	 * Removes the given tag from the given entity.
	 *
	 * @param entityId The id of the entity to remove the tag from.
	 * @param tag The component to remove.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public removeTag<C extends TagComponent>(entityId: EntityId, tag: C): this {
		return this.removeComponent(entityId, tag as unknown as AnyComponent);
	}

	/**
	 * Schedules an individual system to be executed in the world.
	 *
	 * Calling this function is a potentially expensive operation. It is best
	 * advised to use {@link World.scheduleSystems} instead, and add multiple
	 * systems at once - this is to avoid the unnecessary overhead of sorting
	 * systems.
	 *
	 * @param system The system to schedule.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public scheduleSystem(system: System): this {
		this.scheduler.scheduleSystems([system]);

		return this;
	}

	/**
	 * Schedules a given set of systems to be executed in the world.
	 *
	 * @param systems The systems to schedule.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public scheduleSystems(...systems: Array<System>): this {
		this.scheduler.scheduleSystems(systems);

		return this;
	}

	/**
	 * @returns The number of entities currently in the world.
	 */
	public size(): number {
		return this.entityManager.getNumberOfEntitiesInUse();
	}

	/**
	 * Starts the execution of the world.
	 *
	 * This should only be called after all components, and preferably all
	 * systems have been registered.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public start(): this {
		this.scheduler.start();

		return this;
	}

	/**
	 * @returns The name of the world. This defaults to "World", unless
	 * specified by the WorldOptions.
	 */
	public toString(): string {
		return this.options.name ?? "World";
	}

	/**
	 * Unschedule a system from the system manager.
	 *
	 * If a system needs to be re-scheduled, it is recommended instead to
	 * disable it using {@link World.disableSystem}, as scheduling a
	 * a system requires the system to be re-sorted.
	 *
	 * @param system The system to unschedule.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public unscheduleSystem(system: System): this {
		this.scheduler.unscheduleSystems([system]);

		return this;
	}

	/**
	 * Unschedule a set of systems from the system manager.
	 *
	 * If a system needs to be re-scheduled, it is recommended instead to
	 * disable it using {@link SystemManager.disableSystem}, as scheduling a
	 * a system requires the system to be re-sorted.
	 *
	 * @param systems The systems to unschedule.
	 *
	 * @returns The world instance to allow for method chaining.
	 */
	public unscheduleSystems(...systems: Array<System>): this {
		this.scheduler.unscheduleSystems(systems);

		return this;
	}

	/**
	 * Called when a component is added to an entity, as the entity's archetype
	 * will need to be changed.
	 *
	 * @param arch
	 * @param componentId The id of the component to add.
	 * @returns
	 */
	private archetypeChange(arch: Archetype, componentId: ComponentId): Archetype {
		if (!arch.change[componentId]) {
			arch.mask[~~(componentId / 32)] ^= 1 << componentId % 32;
			arch.change[componentId] = this.getArchetype(arch.mask);
			arch.mask[~~(componentId / 32)] ^= 1 << componentId % 32;
		}
		return arch.change[componentId];
	}

	/**
	 * Gets the archetype with the given mask.
	 *
	 * If the archetype does not exist, it is created, and then cached for
	 * querying later.
	 *
	 * @param mask The mask of the archetype to get.
	 *
	 * @returns The archetype with the given mask.
	 */
	private getArchetype(mask: Array<ComponentId>): Archetype {
		const hash = mask.join(",");
		if (!this.entityManager.archetypes.has(hash)) {
			const arch = new Archetype(slice(mask)); // does this mask need to be ordered?
			this.entityManager.archetypes.set(hash, arch);
			// TODO: This is currently an O(n) operation to find any matching queries. Look into archetype graphs.
			for (const query of this.queries) {
				if (Query.match(mask, query.mask)) {
					query.archetypes.push(arch);
				}
			}
		}
		return this.entityManager.archetypes.get(hash)!;
	}

	/**
	 * Checks if the given entity has the given component.
	 *
	 * @param mask The component mask of the entity to check.
	 * @param componentId The id of the component to check for.
	 *
	 * @returns Whether or not the entity has the given component.
	 */
	private hasComponentInternal(mask: Array<ComponentId>, componentId: number): boolean {
		return (mask[~~(componentId / 32)] & (1 << componentId % 32)) >= 1;
	}

	/**
	 * Clears all pending component updates in the world (either add or remove).
	 *
	 * This is called automatically by {@link flush}.
	 * @hidden
	 */
	private updatePendingComponents(): void {
		this.entityManager.updatePending(this.componentsToUpdate.dense);
		this.componentsToUpdate.dense = [];
	}

	/**
	 * Clears all pending observer updates in the world.
	 *
	 * This is called automatically by {@link flush}.
	 * @hidden
	 */
	private updatePendingObservers(): void {
		for (const [entityId, observer, ecsType] of this.observersToUpdate) {
			observer.storage.get(ecsType)!.add(entityId);
		}
	}
}
