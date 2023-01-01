import { RunService } from "@rbxts/services";

import { World } from "./world";

export type ExecutionGroup = RBXScriptSignal;

export interface System {
	/**
	 *
	 * @param world
	 */
	configureQueries(world: World): void;
}

export abstract class System {
	public after: Array<string> = [];
	public executionGroup?: ExecutionGroup;
	public name = "System";
	public priority = 0;

	public abstract onUpdate(world: World): void;
}

/**
 *
 */
export class SystemManager {
	private systems: Array<System> = [];

	// private connections: Map<RBXScriptSignal, Array<RBXScriptConnection>> = new Map();

	public start(world: World): void {
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
		this.scheduleSystems([system]);
	}

	public scheduleSystems(systems: Array<System>): void {
		for (const system of systems) {
			this.systems.push(system);
		}
	}

	public endSystem(): void {}

	private sortSystems(): void {}
}
