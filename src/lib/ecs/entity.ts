import { EntityManager } from "./entity-manager";

export type EntityId = number;

// temporary
type Component = undefined;
type Tag = undefined;

/**
 * An entity is a unique identifier for a set of components.
 *
 * @note Entities should never be created directly.
 */
export class Entity {
	public readonly id: EntityId;

	private components: Set<Component>;
	private tags: Set<Tag>;

	/**
	 * The next entity for use by the {@link EntityPool}
	 * @hidden
	 */
	public next: Entity | undefined;

	/** @hidden */
	constructor(private readonly entityManager: EntityManager) {
		this.id = entityManager.getNextEntityId();

		this.components = new Set();
		this.tags = new Set();
	}

	public initialise(/** initialiser to pass to entity? */): void {
		// setup entitity? might not need this if we enforce adding a component?
	}

	/**
	 * @returns True if the entity is currently in the world.
	 * @note This is due to the fact that entities are pooled and reused.
	 */
	public alive(): boolean {
		// An entity is only alive if it has components. For entities without
		// components, a `tag` should be attached to an entity instead.
		return !this.components.isEmpty();
	}

	/**
	 * Removes this entity from the world.
	 */
	public delete(): void {
		this.entityManager.removeEntity(this);
	}

	/**
	 * Adds a given component to the entity. If the entity already has the
	 * given component, then an error is thrown.
	 * @param data An optional data object to initialise the component with.
	 */
	public component<C>(/**component: ComponentType<C>, */ data: Partial<C>): void {}

	/**
	 * Removes the component of the given type from the entity.
	 */
	public remove(/**component: ComponentType<C> */): void {}

	/**
	 * Returns whether the entity has the given component.
	 * @returns Whether the entity has the given component.
	 */
	public has<C>(/**component: ComponentType<C> */): boolean {
		return false;
	}

	/**
	 * Returns whether or not the entity has any of the given components.
	 * @returns
	 */
	public hasSubsetOf(/** ...components: ComponentType<any>[] */): boolean {
		return false;
	}

	/**
	 * Returns whether or not the entity has all of the given components.
	 * @returns
	 */
	public hasAllOf(/** ...components: ComponentType<any>[] */): boolean {
		return false;
	}

	/**
	 * Returns the component of on the entity of the given type.
	 * @returns
	 */
	public get<C>(/**component: ComponentType<C> */): C | undefined {
		return undefined;
	}
}
