import { Entity, EntityId } from "./entity";
import { World } from "./world";

/**
 * A pool of entities that can be reused, so that we do not need to create a
 * new entity every time we need one.
 *
 * The entity pool will be created when a world is initialized, and will
 * grow as required (although it is recommended to set the initial size to a
 * reasonable number as growth during a game could be potentially expensive).
 */
class EntityPool {
	private entities: Array<Entity>;
	private entitiesInUse: number;
	private firstAvailable: Entity;
	private size: number;
	private attachedWorld: string;

	constructor(private readonly entityManager: EntityManager, initialSize: number, attachedWorld: string) {
		this.entitiesInUse = 0;
		this.size = 0;
		this.attachedWorld = attachedWorld;

		this.entities = new Array<Entity>(initialSize);
		this.expand(initialSize);
		this.firstAvailable = this.entities[0];
		this.setupEntityStorage(0 /**, initialSize*/);
	}

	/**
	 * Gets the next available entity from the pool.
	 * @returns An available entity.
	 */
	public aquire(/** initialiser to pass to entity? */): Entity {
		assert(this.firstAvailable !== undefined, "No more entities available");

		const entity = this.firstAvailable;
		const nextEntity = entity.next;
		if (nextEntity === undefined) {
			// The pool is empty, so expand it by roughly 10%.
			// This could be a potentially expensive operation.
			warn(
				`Entity pool for ${this.attachedWorld} is currently empty. Expanding by 10%. If this is a problem, ",
				"consider increasing the initial size of the pool.`,
			);
			debug.profilebegin("EntityPool.expand");

			const extraEntities = math.round(this.size * 0.1) + 1;
			const currentSize = this.size;
			this.expand(extraEntities);
			this.setupEntityStorage(currentSize - 1 /**, extraEntities*/);

			debug.profileend();
		}

		this.firstAvailable = entity.next!;
		this.entitiesInUse++;

		entity.initialise();
		return entity;
	}

	/**
	 * Adds the given entity back into the pool.
	 * @param entity The entity to add back into the pool.
	 */
	public release(entity: Entity): void {
		entity.next = this.firstAvailable;
		this.firstAvailable = entity;
		this.entitiesInUse--;
	}

	/**
	 * Expands the entity pool by the given number of entities.
	 * @param count The number of entities to add to the pool.
	 */
	public expand(count: number) {
		for (let i = 0; i < count; i++) {
			const entity = new Entity(this.entityManager);
			this.entities.push(entity);
		}
		this.size += count;
	}

	/**
	 * @returns The number of entities that are currently in use by the pool.
	 */
	public getEntitiesInUse(): number {
		return this.entitiesInUse;
	}

	/**
	 * Setup the entity storage for the given range of entities.
	 * @param entitiesToSetup The number of new entities to setup.
	 */
	private setupEntityStorage(initialSize: number /** entitiesToSetup: number*/) {
		// Rather than using a separate list in the entity pool, we can just
		// set up a linked list of entities in the pool which chains together
		// every unused entity in the pool.
		for (let i = initialSize; i < this.size - 1; i++) {
			this.entities[i].next = this.entities[i + 1];
		}
		this.entities[this.size - 1].next = undefined;
	}
}

/**
 * A class for managing entities within the world.
 */
export class EntityManager {
	private entitiesById: Map<EntityId, Entity>;
	private readonly entityPool: EntityPool;
	private world: World;

	public nextEntityId: EntityId;

	constructor(world: World) {
		this.entitiesById = new Map();
		this.nextEntityId = 0;
		this.world = world;

		this.entityPool = new EntityPool(this, world.options.entityPoolSize, world.name);
	}

	/**
	 * @returns The number of entities that are currently in use by the pool.
	 */
	public getNumberOfEntitiesInUse(): number {
		return this.entityPool.getEntitiesInUse();
	}

	/**
	 *
	 * @param id
	 * @returns
	 */
	public getEntityById(id: EntityId): Entity | undefined {
		return this.entitiesById.get(id);
	}

	/**
	 *
	 * @returns
	 */
	public createEntity(): Entity {
		const entity = this.entityPool.aquire();
		this.entitiesById.set(entity.id, entity);
		return entity;
	}

	/**
	 *
	 * @param entity
	 */
	public removeEntity(entity: Entity): void {
		// remove all components
		// reset entity state? (is this necessary?, we could just reinitialise state on aquire)
		// inform that entity has been changed and removed
		this.entityPool.release(entity);
		this.entitiesById.delete(entity.id);
	}

	/**
	 * @returns
	 */
	public getNextEntityId(): EntityId {
		return this.nextEntityId++;
	}
}
