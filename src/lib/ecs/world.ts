import { HttpService } from "@rbxts/services";
import { EntityId } from "../types/ecs";
import { slice } from "../util/array-utils";
import { Archetype } from "./collections/archetype";
import { SparseSet } from "./collections/sparse-set";
import { Component, ComponentTypes, createComponentArray, Tag, Tree, ValidComponentData } from "./component";
import { EntityManager } from "./entity-manager";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ANY, NOT } from "./query";
import { ALL, Query, RawQuery } from "./query";
import { ExecutionGroup, System, SystemManager } from "./system";

export interface WorldOptions {
	/**
	 * The name of the world. This can be used for debugging purposes
	 * (potentially useful if you have multiple worlds). Defaults to `World`.
	 */
	name?: string;

	/**
	 * The default execution group for systems. Defaults to `Heartbeat`.
	 */
	defaultExecutionGroup?: ExecutionGroup;
}

/**
 * The world is the container for all the ECS data, which stores all the
 * entities and their components, queries, and run systems.
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
export class World<WorldComponents extends Record<string, Tree<ValidComponentData>> = never> {
	public readonly entityManager: EntityManager;
	public readonly options: WorldOptions;

	/** Components that are waiting to be added or removed from an entity. */
	private componentsToUpdate: SparseSet;
	private queries: Array<Query>;

	public readonly systemManager: SystemManager;

	public id = HttpService.GenerateGUID();

	private components: Record<keyof WorldComponents, Component | Tag>;

	constructor(options: WorldOptions, components: WorldComponents) {
		this.options = options;
		this.queries = [];
		this.componentsToUpdate = new SparseSet();

		this.entityManager = new EntityManager();
		this.systemManager = new SystemManager();

		this.components = {} as Record<keyof WorldComponents, Component>;

		for (const [name, data] of pairs(components)) {
			this.components[name as keyof WorldComponents] = this.defineComponent(
				name as string,
				data as Tree<ValidComponentData>,
			);
		}
	}

	/** @returns The name of the world. */
	public toString(): string {
		return this.options.name !== undefined ? this.options.name : "World";
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
			this.entityManager.archetypes.forEach(archetype => {
				if (Query.match(archetype.mask, query.mask)) {
					query.a.push(archetype);
				}
			});
			this.queries.push(query);
		}
		debug.profileend();

		return query;
	}

	public start(): void {
		this.systemManager.start(this);
	}

	/**
	 * Schedule a system to run on the next update.
	 */
	public scheduleSystem(system: System): void {
		this.systemManager.scheduleSystem(system);
	}

	/**
	 * Removes a scheduled system from the execution queue in the world.
	 */
	public endSystem(/**system: System*/): void {}

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
	 * Removes the given entity from the world, including all of its components.
	 *
	 * The entity will be removed from the world upon the next deferred update.
	 *
	 * @param entityId The id of the entity to remove.
	 */
	public remove(entityId: EntityId): void {
		this.entityManager.removeEntity(entityId);
	}

	/**
	 * Checks if a given entity is currently in the world.
	 *
	 * @param entityId The id of the entity to check.
	 * @returns
	 */
	public has(entityId: EntityId): boolean {
		return this.entityManager.alive(entityId);
	}

	/**
	 * @returns The number of entities currently in the world.
	 */
	public size(): number {
		return this.entityManager.getNumberOfEntitiesInUse();
	}

	// TODO: Fix naming, create docs.
	public getComponentObject(k: keyof WorldComponents): Component | Tag {
		return this.components[k];
	}

	/**
	 * Initialises a new component with the world.
	 *
	 * @param def
	 */
	private defineComponent<T extends Tree<ValidComponentData>>(name: string, def: T): Component {
		if (this.entityManager.getEntityId() > 0) {
			throw error("Cannot define components after entities have been created");
		}

		const component = new Component();
		// TODO: currently this is hardcoded to a max of 1000 entities; should update this to be dynamic
		component.initialiseComponent(
			this,
			name,
			this.entityManager.getNextComponentId(),
			createComponentArray(def, 1000),
		);

		return component;
	}

	/**
	 *
	 */
	public defineTag(): Tag {
		if (this.entityManager.getEntityId() > 0) {
			throw error("Cannot define tags after entities have been created");
		}

		const tag = new Tag();
		tag.initialiseTag(this, this.entityManager.getNextComponentId());

		return tag;
	}

	/**
	 * Adds a given component to the entity. If the entity already has the
	 * given component, then an error is thrown.
	 *
	 * @param entityId The id of the entity to add the component to.
	 * @param component The component to add to the entity, which must have
	 *     been defined previously with {@link World#defineComponent}.
	 * @param data The optional data to initialise the component with.
	 */
	public addComponent<C extends keyof WorldComponents>(
		entityId: EntityId,
		componentName: C,
		data?: Partial<ComponentDataTransform<WorldComponents[C]>>,
	): this {
		if (!this.has(entityId)) {
			throw error(`Entity ${entityId} does not exist in world ${tostring(this)}`);
		}

		const component = this.getComponentObject(componentName);

		this.componentsToUpdate.add(entityId);

		debug.profilebegin("World:addComponent");
		{
			const componentId = component._componentData.id!;
			if (!this.hasComponentInternal(this.entityManager.updateTo[entityId].mask, componentId)) {
				if (component instanceof Component) {
					this.entityManager.updateTo[entityId] = this.archetypeChange(
						this.entityManager.updateTo[entityId],
						componentId,
					);
					component.set(entityId, data as Tree<ValidComponentData>);
				} else if (component instanceof Tag) {
					this.entityManager.updateTo[entityId] = this.archetypeChange(
						this.entityManager.updateTo[entityId],
						componentId,
					);
				}
			}
		}
		debug.profileend();

		return this;
	}

	/**
	 * Removes the component of the given type from the entity.
	 */
	public removeComponent(entityId: EntityId, component: keyof WorldComponents): this {
		if (!this.has(entityId)) {
			throw error(`Entity ${entityId} does not exist in world ${tostring(this)}`);
		}

		this.componentsToUpdate.add(entityId);

		const comp = this.components[component];

		debug.profilebegin("World:removeComponent");
		{
			const componentId = comp._componentData.id!;
			if (this.hasComponentInternal(this.entityManager.updateTo[entityId].mask, componentId)) {
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
	 * Returns whether the entity has the given component.
	 * @returns Whether the entity has the given component.
	 */
	public hasComponent(entityId: EntityId, component: keyof WorldComponents): boolean {
		const componentId = this.components[component]._componentData.id!;
		return this.hasComponentInternal(this.entityManager.entities[entityId].mask, componentId);
	}

	/**
	 * Returns whether or not the entity has any of the given components.
	 * @returns
	 */
	public hasSubsetOf(entityId: EntityId /** ...components: ComponentType<any>[] */): boolean {
		return false;
	}

	/**
	 * Returns whether or not the entity has all of the given components.
	 * @returns
	 */
	public hasAllOf(entityId: EntityId /** ...components: ComponentType<any>[] */): boolean {
		return false;
	}

	/**
	 * Returns the component of on the entity of the given type.
	 * @returns
	 */
	public getComponent<C extends keyof WorldComponents>(entityId: EntityId, component: C): Partial<ComponentDataTransform<WorldComponents[C]>> {
		if (this.components[component] instanceof Tag) return {};
		return (this.components[component] as Component).get(entityId) as {};
	}

	/**
	 * Removes all entities from the world.
	 */
	public clear(): void {}

	/**
	 * Halts the current execution of the world and destroys the world.
	 */
	public destroy(): void {}

	/**
	 * Continues the execution of the world from its current state.
	 */
	public play(): void {}

	/**
	 * Pauses the execution of the world.
	 */
	public pause(): void {}

	/**
	 * Flushes any current changes in the world. This is called automatically
	 * whenever a query or a system has finished executing, and should not
	 * typically be called manually.
	 */
	public flush(): void {
		debug.profilebegin("World:flush");
		{
			this.entityManager.destroyPendingEntities();
			this.updatePendingComponents();
		}
		debug.profileend();
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
	 * Called when a component is added to an entity, as the entity's archetype
	 * will need to be changed.
	 *
	 * @param arch
	 * @param componentId The id of the component to add.
	 * @returns
	 */
	private archetypeChange(arch: Archetype, componentId: number): Archetype {
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
	 * @returns The archetype with the given mask.
	 */
	private getArchetype(mask: Array<number>): Archetype {
		if (!this.entityManager.archetypes.has(mask.join(","))) {
			const arch = new Archetype(slice(mask));
			this.entityManager.archetypes.set(mask.join(","), arch);
			for (const query of this.queries) {
				if (Query.match(mask, query.mask)) {
					query.a.push(arch);
				}
			}
		}
		return this.entityManager.archetypes.get(mask.join(","))!;
	}

	private hasComponentInternal(mask: Array<number>, componentId: number): boolean {
		return (mask[~~(componentId / 32)] & (1 << componentId % 32)) >= 1;
	}
}

export type UnimplementedWorld = World<Record<string, Tree<ValidComponentData>>>;

export type Builtins = Vector2Constructor | Vector3Constructor | CFrameConstructor;

type BuiltinTransform<T> = T extends Vector2Constructor ? Vector2 : T extends Vector3Constructor ? Vector3 : T extends CFrameConstructor ? CFrame : never;

type SingleComponentDataTransform<T> = T extends ComponentTypes.Boolean ? boolean 
: T extends ComponentTypes.Number ? number
: T extends ComponentTypes.String ? string 
: T extends ComponentTypes.Custom ? never
: T extends ComponentTypes.None ? undefined : T

type ComponentDataTransform<Data> = {
	[Key in keyof Data]: Data[Key] extends Builtins
		? BuiltinTransform<Data[Key]>
		: Data[Key] extends { [key: string]: unknown }
		? ComponentDataTransform<Data[Key]>
		: SingleComponentDataTransform<Data[Key]>;
}