import { RunService } from "@rbxts/services";

import TinaCore from "./lib/core";
import TinaGame from "./lib/core/game";
import {
	Component,
	ComponentInternalCreation,
	Flyweight,
	TagComponent,
	Tree,
	Type,
} from "./lib/ecs/component";
import { World, WorldOptions } from "./lib/ecs/world";
/* Networking namespace */
import { EventListener } from "./lib/events";
import { TinaEvents, TinaInternalEvents } from "./lib/events/tina_events";
import { Logger, Scope } from "./lib/logger/Logger";
import { TinaNet } from "./lib/net/tina_net";
import { Exposed } from "./lib/net/tina_net/types";
import Client from "./lib/net/utilities/client";
import Identifiers from "./lib/net/utilities/identifiers";
import Server from "./lib/net/utilities/server";
import { Process } from "./lib/process/process";
import Scheduler from "./lib/process/scheduler";
import { ConvertSchemaToState, createReplicatedState } from "./lib/state/createState";
import { Users } from "./lib/user";
import { DefaultUserDeclaration } from "./lib/user/default/types";

export enum Protocol {
	/** Create/Load Online User Data */
	CLOUD = "CLOUD",
	LCTRL = "LCTRL",
	NET = "NET",
}

namespace Tina {
	const isServer = RunService.IsServer();

	Identifiers._init();

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
			if (isServer) {
				Server._init();
			} else {
				Client._init();
			}

			/** Internals set up */
			TinaNet.setupInternals();
			Users.setupEvents();
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

		log.log("The User Class has been changed to:", userClass); // Not sure why this is being warned at all.
	}

	/**
	 * Fetch the Tina core, a replacement for the `game` object in the vanilla Roblox API.
	 */
	export function core(): TinaCore {
		return new TinaCore();
	}

	/**
	 * Used to add new processes to the processor.
	 *
	 * @param name process name to add.
	 * @returns a Process object.
	 */
	export function process(name: string): Process {
		if (Process.processes.has(name)) {
			return Process.processes.get(name)!;
		}

		return new Process(name, Scheduler);
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
	): EventListener<
		[...(T extends keyof TinaInternalEvents ? TinaInternalEvents[T] : Exposed[T])]
	> {
		return TinaEvents.addEventListener(event);
	}

	/**
	 *
	 * @param schema
	 * @returns
	 */
	export function createState<T extends {}>(schema: T): ConvertSchemaToState<T> {
		return createReplicatedState(schema);
	}

	/**
	 * `Tina.Mirror` defines any built-in classes that can be replaced.
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
	export function createComponent<T extends Tree<Type>>(schema: T): Component<T> {
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
	export function createFlyweight<T extends object>(schema: T): Flyweight<T> {
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
export { Component, ComponentTypes, GetComponentSchema } from "./lib/ecs/component";
export { Observer } from "./lib/ecs/observer";
export { type Query, ALL, ANY, NOT } from "./lib/ecs/query";
export { System } from "./lib/ecs/system";
export { type World } from "./lib/ecs/world";
export { ComponentId, EntityId } from "./lib/types/ecs";

/** Users namespace */
export { User, Users } from "./lib/user";

/** Container export */
export { Container } from "./lib/container";

/** Util exports */
export { FunctionUtil } from "./lib/util/functions";
/* State exports */
export { States } from "./lib/state/createState";

/** Logger export */
export { Logger } from "./lib/logger/Logger";
