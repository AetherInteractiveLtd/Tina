import { RunService } from "@rbxts/services";

import { EntityId } from "../types/ecs";
import { Query } from "./query";
import { UnimplementedWorld, World } from "./world";

export type ExecutionGroup = RBXScriptSignal;

export interface System {
	/**
	 *
	 * @param world
	 */
	configureQueries(world: UnimplementedWorld): void;

	/**
	 * Automatically called when
	 * @param entity
	 */
	onEntityAdded?(entity: EntityId): void;
	onEntityRemoved?(entity: EntityId): void;
}

export abstract class System {
	public after: Array<string> = [];
	public executionGroup?: ExecutionGroup;
	public name = "System";
	public priority = 0;

	public abstract onUpdate(world: UnimplementedWorld): void;
}

/**
 *
 */
export class SystemManager {
	private systems: Array<System> = [];

	// private connections: Map<RBXScriptSignal, Array<RBXScriptConnection>> = new Map();

	public start(world: UnimplementedWorld): void {
		const executionDefault = world.options.defaultExecutionGroup
			? world.options.defaultExecutionGroup
			: RunService.Heartbeat;

		for (const system of this.systems) {
			if (system.configureQueries !== undefined) {
				system.configureQueries(world);
			}

			executionDefault.Connect(() => {
				system.onUpdate(world);
			});
		}
	}

	public scheduleSystem(system: System): void {
		this.systems.push(system);
	}

	public endSystem(): void {}

	public sortSystems(): void {}
}

export class ExampleSystem extends System {
	private movementQuery!: Query;

	constructor() {
		super();
		this.executionGroup = RunService.RenderStepped;
	}

	public configureQueries(world: UnimplementedWorld): void {
		// this.movementQuery = world.createQuery(Position, Velocity));
	}

	public onUpdate(world: UnimplementedWorld): void {
		this.movementQuery.forEach((entityId: EntityId) => {
			print(entityId);
		});
	}
}
