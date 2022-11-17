export type EntityId = number;

/**
 * An entity is a unique identifier for a set of components.
 */
export class Entity {
	private readonly id: EntityId;

	constructor(id: EntityId) {
		this.id = id;
	}

	/**
	 * Removes this entity from the world.
	 */
	public delete(): void {}

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
