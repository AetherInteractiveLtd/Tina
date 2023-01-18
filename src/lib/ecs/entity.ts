import { EntityId } from "../types/ecs";
import { Component } from "./component";
import { World } from "./world";

export interface EntityContainer {
	entityId: EntityId;

	addComponent<C extends Component>(component: C): this;
	removeComponent<C extends Component>(component: C): this;

	pin(): void;
	unpin(): void;
}

/**
 * An entity container is a wrapper around an entity id that allows you to
 * call methods directly on an entity, rather than having to use the entityId
 * in functions directly.
 */
export class EntityContainerInternal {
	public entityId?: EntityId;

	/**
	 * The next entity for use by the {@link EntityContainerPool}
	 */
	public next?: EntityContainerInternal;

	private readonly world: World;

	constructor(world: World) {
		this.world = world;
	}

	/**
	 *
	 * @param entityId
	 */
	public initializeEntityContainer(entityId: EntityId): void {
		this.entityId = entityId;
	}

	public addComponent<C extends Component>(component: C): this {
		this.world.addComponent(this.entityId!, component);
		return this;
	}

	public removeComponent<C extends Component>(component: C): this {
		this.world.removeComponent(this.entityId!, component);
		return this;
	}

	public pin(): void {}
	public unpin(): void {}

	// public release(): void {
	// 	this.entityId = undefined;
	// }
}

/**
 *
 */
export class EntityContainerPool {
	private containersInUse: number;
	private firstAvailable: EntityContainerInternal;
	private pool: Array<EntityContainerInternal>;
	private size: number;
	private world: World;

	constructor(world: World, initialSize: number) {
		this.containersInUse = 0;
		this.size = 0;
		this.world = world;

		this.pool = new Array<EntityContainerInternal>(initialSize);
		this.expand(initialSize);
		this.firstAvailable = this.pool[0];
	}

	/**
	 * Gets the next available entity from the pool.
	 * @returns An available entity.
	 */
	public aquire(entityId: EntityId): EntityContainerInternal {
		assert(this.firstAvailable !== undefined, "No more entities available");

		const entityContainer = this.firstAvailable;
		const nextEntityContainer = entityContainer.next;
		if (nextEntityContainer === undefined) {
			// The pool is empty, so expand it by roughly 10%.
			// This could be a potentially expensive operation.
			warn(
				`Entity pool for ${this.world.toString()} is currently empty. Expanding by 10%. If this is an issue, ",
				"consider increasing the initial size of the pool.`,
			);

			debug.profilebegin("EntityPool.expand");
			{
				this.expand(math.round(this.size * 0.1) + 1);
			}
			debug.profileend();
		}

		this.firstAvailable = entityContainer.next!;
		this.containersInUse++;

		entityContainer.initializeEntityContainer(entityId);
		return entityContainer;
	}

	/**
	 * Adds the given entity container back into the pool.
	 * @param entityContainer The entity container to add back into the pool.
	 */
	public release(entityContainer: EntityContainerInternal): void {
		entityContainer.next = this.firstAvailable;
		this.firstAvailable = entityContainer;
		this.containersInUse--;
	}

	/**
	 * @returns The number of entity containers that are currently in use by the pool.
	 */
	public getEntitiesContainersInUse(): number {
		return this.containersInUse;
	}

	/**
	 * Expands the entity pool by the given number of entities.
	 * @param newEntities The number of entities to add to the pool.
	 */
	private expand(newEntities: number): void {
		for (let i = 0; i < newEntities; i++) {
			const entityContainer = new EntityContainerInternal(this.world);
			this.pool.push(entityContainer);
		}
		this.setupEntityContainerStorage(this.size);
		this.size += newEntities;
	}

	/**
	 * Setup the entity storage for the given range of entities.
	 * @param initialSize The current size of the entity pool.
	 */
	private setupEntityContainerStorage(initialSize: number /** entitiesToSetup: number*/): void {
		// Rather than using a separate list in the entity pool, we can just
		// set up a linked list of entities which chains together every unused
		// entity in the pool.
		for (let i = initialSize; i < this.size - 1; i++) {
			this.pool[i].next = this.pool[i + 1];
		}
		this.pool[this.size - 1].next = undefined;
	}
}
