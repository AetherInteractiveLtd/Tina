import { RunService } from "@rbxts/services";

import TinaCore from "./lib/core";
import TinaGame from "./lib/core/game";
import { ComponentInternalCreation } from "./lib/ecs/component";
import { World, WorldOptions } from "./lib/ecs/world";
import { EventListener } from "./lib/events";
import { TinaEvents } from "./lib/events/internal";
import { TinaInternalEvents } from "./lib/events/internal/types";
import { Logger, Scope } from "./lib/logger/Logger";
import { Internals } from "./lib/net/internal";
import { Client } from "./lib/net/util/client";
import { Identifiers } from "./lib/net/util/identifiers";
import { Server } from "./lib/net/util/server";
import { Component, ComponentData, Flyweight, FlyweightData, TagComponent } from "./lib/types/ecs";
import { Users } from "./lib/user";
import { DefaultUserDeclaration } from "./lib/user/default/types";

export enum Protocol {
	/** Create/Load Online User Data */
	CLOUD = "CLOUD",
	LCTRL = "LCTRL",
	NET = "NET",
}

namespace Tina {
	Identifiers.init();

	/**
	 * ! ⚠️ **THIS SHOULD ONLY EVER BE USED ONCE PER GAME** ⚠️ !
	 *
	 * Register the game instance with Tina, this is required for Tina to work. All `Process`es will only begin **after** this is called.
	 *
	 * @param name Name of the game
	 * @returns The game instance, this isn't very useful but contains certain global methods.
	 */
	export function registerGame(_name: string): TinaGame {
		{
			if (RunService.IsServer()) {
				Server.init();
			} else {
				Client.init();
			}

			Internals.init();
			Users.init();
		}

		// TODO: Auto-Detect `manifest.tina.yml` and load it.
		return new TinaGame();
	}

	/**
	 * ! ⚠️ **THIS SHOULD ONLY EVER BE USED ONCE PER GAME** ⚠️ !
	 *
	 * Override the default User/Player class (useful to define your own behaviours and overall data liveries).
	 *
	 * #### Usage example:
	 *
	 * ```ts
	 * import Tina, { User } from "@rbxts/tina";
	 *
	 * class  extends User {
	 * 	 constructor(ref: Player | number) {
	 * 		super(ref);
	 *   }
	 * }
	 *
	 * Tina.setUserClass(User); // THIS SHOULD BE CALLED **BEFORE** `Tina.registerGame`
	 * Tina.registerGame("MyGame");
	 *
	 * ```
	 *
	 * *NOTE: The Client and Server can use their own User classes, but they should remain compatible with each other.*
	 *
	 * @param userClass The new User class constructor
	 */
	export function setUserClass(userClass: new (ref: Player) => DefaultUserDeclaration): void {
		Users.setUserClass(userClass); // Changes internally the way user is defined and constructed
	}

	/**
	 * Fetch the Tina core, a replacement for the `game` object in the vanilla Roblox API.
	 */
	export function core(): TinaCore {
		return new TinaCore();
	}

	export const log: Scope = Logger.scope("TINA");

	/**
	 * Used to connect to Tina's internal events, such as when a user is registered, etc.
	 *
	 * @param event event name (defined internally specially for Tina)
	 * @returns an EventListener object.
	 */
	export function when<T extends keyof TinaInternalEvents>(
		event: T,
	): EventListener<TinaInternalEvents[T]> {
		return TinaEvents.when(event);
	}

	/**
	 * Used to build state from the specified State Tree, it is **recommended** to build once.
	 *
	 * @param stateTree the state tree to build from.
	 */
	export function buildState<T extends {}>(stateTree: T): T {
		return stateTree;
	}

	/**
	 * Create a new ECS World.
	 *
	 * The world is the main access point for the ECS functionality, along with
	 * being responsible for creating and managing entities, components, and
	 * systems.
	 *
	 * Typically there is only a single world, but there is no limit on the number
	 * of worlds an application can create.
	 *
	 * @param options Optional world options to configure the world.
	 *
	 * @returns a new ECS World.
	 */
	export function createWorld(options?: WorldOptions): World {
		return new World(options);
	}

	/**
	 * Creates a component that matches the given schema.
	 *
	 * Internally this creates an array for each property in the schema, where the
	 * index of the array matches an entity id. This allows for fast lookups of
	 * component data.
	 *
	 * The array is pre-allocated to the given size, so it is important to ensure
	 * that you do not access the component data for an entity that does not exist,
	 * or that does not have the component. This is because the array could hold
	 * data for a given entity, despite the fact that the entity would be invalid.
	 *
	 * Components are singletons, and should be created once per component type.
	 * Components also persist between worlds, therefore you do not need more than
	 * one component per world. EntityIds are global, therefore the index of a
	 * given entity will always match the index of the component data.
	 *
	 * @param schema The properties of the component.
	 *
	 * @returns A single component instance.
	 */
	export function createComponent<T extends ComponentData>(schema: T): Component<T> {
		return ComponentInternalCreation.createComponent(schema);
	}

	/**
	 * Creates a tag component; a component that has no data.
	 *
	 * Tags are useful for marking entities as having a certain property, without
	 * the overhead of storing any data. For example, you could use a tag component
	 * to mark an entity as being a player, and then use a system to query for all
	 * entities that have the player tag.
	 *
	 * Tags are singletons, and should be created once per component type. Tags
	 * also persist between worlds, therefore you do not need more than one Tag per
	 * world.
	 *
	 * @returns A tag component.
	 */
	export function createTag(): TagComponent {
		return ComponentInternalCreation.createTag();
	}

	/**
	 * Creates a flyweight component; a component that holds data that is
	 * shared between all entities that have the component.
	 *
	 * Flyweight components are useful for minimizing memory usage by only
	 * storing one set of data for a given component. Rather than having an
	 * array of data for each entity, there is only a single set of data.
	 *
	 * @param schema The properties of the component.
	 *
	 * @returns A flyweight component.
	 */
	export function createFlyweight<T extends FlyweightData>(schema: T): Flyweight<T> {
		return ComponentInternalCreation.createFlyweight(schema);
	}
}

/** Export Tina itself */
export default Tina;

/** Export Conditions Library */
export { COND } from "./lib/conditions";

/** Export EventEmitter Library */
export { EventEmitter, EventListener } from "./lib/events";

/** Export Network Library */
export { Network } from "./lib/net";

/** Audience Utility */
export { Audience } from "./lib/audience/audience";

/** ECS Library  */
export { ComponentTypes } from "./lib/ecs/component";
export { Observer } from "./lib/ecs/observer";
export { type Query, ALL, ANY, NOT } from "./lib/ecs/query";
export { bindEvent, Event } from "./lib/ecs/storage/event";
export { StorageObject, System } from "./lib/ecs/system";
export { type World } from "./lib/ecs/world";
export {
	AllComponentTypes,
	AnyComponent,
	AnyFlyweight,
	Component,
	ComponentData,
	ComponentId,
	EntityId,
	Flyweight,
	FlyweightData,
	GetComponentSchema,
	PartialComponentToKeys,
	TagComponent,
} from "./lib/types/ecs";

/** Users namespace */
export { User, Users } from "./lib/user";

/** State namespace */
export { State } from "./lib/state";

/** Process class and scheduler namespace */
export { Process } from "./lib/processes/process";
export { Scheduler } from "./lib/processes/scheduler";

/** Container export */
export { Container } from "./lib/container";

/** Logger export */
export { Logger } from "./lib/logger/Logger";

/** Util exports */
export { FunctionUtil } from "./lib/util/functions";
