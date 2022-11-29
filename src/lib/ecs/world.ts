import Sift from "@rbxts/sift";
import { EntityId } from "../types/ecs";
import { slice } from "../util/array-utils";
import { Archetype } from "./collections/archetype";
import { SparseSet } from "./collections/sparse-set";
import { ComponentArray, ComponentData, Tree, Type, _componentData } from "./component";
import { EntityManager } from "./entity-manager";
import { ALL, RawView, View } from "./view";

export interface WorldOptions {
	/**
	 * The name of the world. This can be used for debugging purposes
	 * (potentially useful if you have multiple worlds). Defaults to `World`.
	 */
	name?: string;
}

/**
 * The world is the container for all the ECS data, which stores all the
 * entities and their components, queries, and run systems.
 *
 * Typically there is only a single world, but there is no limit on the number
 * of worlds an application can create.
 */
export class World {
	public readonly entityManager: EntityManager;
	public readonly options: WorldOptions;

	private toUpdate: SparseSet;
	private views: Array<View>;

	constructor(options: WorldOptions) {
		this.options = options;
		this.views = [];
		this.toUpdate = new SparseSet();

		this.entityManager = new EntityManager(this);
	}

	/** @returns The name of the world. */
	public toString(): string {
		return this.options.name !== undefined ? this.options.name : "World";
	}

	/**
	 *
	 * @param raw
	 * @returns
	 */
	public createView(...raw: Array<RawView>): View {
		const view = new View(this, ALL(...raw));
		this.entityManager.archetypes.forEach((archetype) => {
			if (View.match(archetype.mask, view.mask)) {
				view.a.push(archetype);
			}
		});

		this.views.push(view);
		return view;
	}

	/**
	 * Schedule a system to run on the next update.
	 */
	public scheduleSystem(/**system: System */): void {}

	/**
	 * Removes a scheduled system from the execution queue in the world.
	 */
	public endSystem(/**system: System*/): void {}

	/**
	 * Creates a new entity in the world.
	 * @returns The id of the newly created entity.
	 */
	public add(): number {
		return this.entityManager.createEntity();
	}

	/**
	 * Removes the given entity from the world, including all of its components.
	 * @param entityId The id of the entity to remove.
	 */
	public remove(entityId: EntityId): void {
		this.entityManager.removeEntity(entityId);
	}

	/**
	 * Checks if a given entity is currently in the world.
	 * @param entityId
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

	/**
	 *
	 * @param def
	 */
	public defineComponent<T extends Tree<Type>>(def: T): ComponentArray<T> {
		if (this.entityManager.getEntityId() > 0) {
			throw error("Cannot define components after entities have been created");
		}
		return this.registerComponent(def as ComponentArray<T>);
	}

	//

	/**
	 *
	 */
	public defineTag(): ComponentArray {
		if (this.entityManager.getEntityId() > 0) {
			throw error("Cannot define tags after entities have been created");
		}
		return this.registerComponent({});
	}

	/**
	 * Adds a given component to the entity. If the entity already has the
	 * given component, then an error is thrown.
	 */
	public addComponent<C extends ComponentArray>(entityId: EntityId, component: C, data?: Partial<C>): World {
		if (!this.has(entityId)) {
			throw error(`Entity ${entityId} does not exist in world ${tostring(this)}`);
		}

		this.toUpdate.add(entityId);

		const componentId = (component as unknown as ComponentData)[_componentData].id;
		if (!this.hasComponentInternal(this.entityManager.updateTo[entityId].mask, componentId)) {
			this.entityManager.updateTo[entityId] = this.archetypeChange(
				this.entityManager.updateTo[entityId],
				componentId,
			);
		}

		return this;
	}

	/**
	 * Removes the component of the given type from the entity.
	 */
	public removeComponent<C extends ComponentData>(entityId: EntityId, component: ComponentArray): World {
		if (!this.has(entityId)) {
			throw error(`Entity ${entityId} does not exist in world ${tostring(this)}`);
		}

		this.toUpdate.add(entityId);

		const componentId = (component as C)[_componentData].id;
		if (this.hasComponentInternal(this.entityManager.updateTo[entityId].mask, componentId)) {
			this.entityManager.updateTo[entityId] = this.archetypeChange(
				this.entityManager.updateTo[entityId],
				componentId,
			);
		}

		return this;
	}

	/**
	 * Returns whether the entity has the given component.
	 * @returns Whether the entity has the given component.
	 */
	public hasComponent<C extends ComponentData>(entityId: EntityId, component: ComponentArray): boolean {
		const componentId = (component as C)[_componentData].id;
		return this.hasComponentInternal(this.entityManager.updateTo[entityId].mask, componentId);
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
	public getComponent<C>(entityId: EntityId /**component: ComponentType<C> */): C | undefined {
		return undefined;
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

	/** @hidden */
	public flush(): void {
		this.entityManager.destroyPending();
		this.updatePending();
	}

	/**
	 *
	 */
	private updatePending(): void {
		this.entityManager.updatePending(this.toUpdate.dense);
		this.toUpdate.dense = [];
	}

	/**
	 *
	 * @param arch
	 * @param i
	 * @returns
	 */
	private archetypeChange(arch: Archetype, i: number): Archetype {
		if (!arch.change[i]) {
			arch.mask[~~(i / 32)] ^= 1 << i % 32;
			arch.change[i] = this.getArchetype(arch.mask);
			arch.mask[~~(i / 32)] ^= 1 << i % 32;
		}
		return arch.change[i];
	}

	/**
	 *
	 * @param mask
	 * @returns
	 */
	private getArchetype(mask: Array<number>): Archetype {
		if (!this.entityManager.archetypes.has(mask.join(","))) {
			const arch = new Archetype(slice(mask));
			this.entityManager.archetypes.set(mask.join(","), arch);
			for (const view of this.views) {
				if (View.match(mask, view.mask)) {
					view.a.push(arch);
				}
			}
		}
		return this.entityManager.archetypes.get(mask.join(","))!;
	}

	/**
	 *
	 * @param mask
	 * @param componentId
	 * @returns
	 */
	private hasComponentInternal(mask: Array<number>, componentId: number): boolean {
		return (mask[~~(componentId / 32)] & (1 << componentId % 32)) >= 1;
	}

	/**
	 *
	 * @param component
	 * @returns
	 */
	private registerComponent<T extends object>(component: T) {
		return Sift.Dictionary.merge(component, {
			[_componentData]: {
				world: this,
				id: this.entityManager.getNextComponentId(),
			},
		});
	}
}
