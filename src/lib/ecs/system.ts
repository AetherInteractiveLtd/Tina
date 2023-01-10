import { RunService } from "@rbxts/services";

import { insertionSort } from "../util/array-utils";
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
	/** An optional set of systems that must be executed before this system */
	public after?: Array<System>;

	/**
	 * The group that this system will be executed on, e.g. Heartbeat,
	 * RenderStepped, etc.
	 */
	public executionGroup?: ExecutionGroup;

	/** The name of the system, primarily used for debugging purposes. */
	public name = "System";

	/**
	 * The priority order of the system.
	 * A higher priority means the system will execute first.
	 * */
	public priority = 0;

	//public dt = 0; // could we set the delta time of the onUpdate function of a system

	/**
	 *
	 * @param world
	 */
	public abstract onUpdate(world: World): void;
}

/**
 *
 */
export class SystemManager {
	private systems: Array<System> = [];
	private systemsByExecutionGroup: Map<ExecutionGroup, Array<System>> = new Map();
	// private connections: Map<ExecutionGroup, Array<RBXScriptConnection>> = new Map();

	private executionGroups: Set<ExecutionGroup> = new Set();

	private executionDefault: ExecutionGroup;
	private world: World;

	constructor(world: World) {
		this.executionDefault = world.options.defaultExecutionGroup
			? world.options.defaultExecutionGroup
			: RunService.Heartbeat;
		this.world = world;
	}

	/**
	 *
	 */
	public start(): void {
		this.systems.forEach(system => {
			if (!system.onUpdate) {
				throw error(`System ${system.name} does not have an onUpdate method`);
			}

			if (system.configureQueries !== undefined) {
				system.configureQueries(this.world);
			}
		});

		this.executionGroups.forEach(executionGroup => {
			executionGroup.Connect(() => {
				this.systemsByExecutionGroup.get(executionGroup)?.forEach(system => {
					system.onUpdate(this.world);
				});
			});
		});
	}

	/**
	 * Call this so schedule an individual system.
	 *
	 * Calling this function is a potentially expensive operation. It is best
	 * advised to use {@link scheduleSystems} instead, and add multiple
	 * systems at once.
	 *
	 * @param system
	 */
	public scheduleSystem(system: System): void {
		this.scheduleSystems([system]);
	}

	/**
	 *
	 * @param systems
	 */
	public scheduleSystems(systems: Array<System>): void {
		systems.forEach(system => {
			let executionGroup = this.executionDefault;
			if (system.executionGroup !== undefined) {
				executionGroup = system.executionGroup;
			}

			if (!this.executionGroups.has(executionGroup)) {
				this.executionGroups.add(executionGroup);
				this.systemsByExecutionGroup.set(executionGroup, []);
			}

			this.systems.push(system);
		});

		this.sortSystems();
	}

	/**
	 *
	 */
	public endSystem(): void {}

	/**
	 *
	 */
	private sortSystems(): void {
		this.systems.forEach(system => {
			this.systemsByExecutionGroup
				.get(system.executionGroup ? system.executionGroup : this.executionDefault)
				?.push(system);
		});

		this.systemsByExecutionGroup.forEach((systems, group) => {
			this.systemsByExecutionGroup.set(group, this.orderSystemsByExecutionGroup(systems));
		});
	}

	/**
	 *
	 * @param systems
	 */
	private validateSystems(systems: Array<System>): void {
		systems.forEach(system => {
			if (system.after !== undefined) {
				system.after.forEach(afterSystem => {
					if (system.executionGroup !== afterSystem.executionGroup) {
						throw error(`System ${system.name} and ${afterSystem.name} are in different execution groups`);
					}
				});
			}
		});
	}

	/**
	 *
	 * @param unscheduledSystems
	 * @returns
	 */
	private orderSystemsByExecutionGroup(unscheduledSystems: Array<System>): Array<System> {
		this.validateSystems(unscheduledSystems);

		unscheduledSystems.sort((a, b) => {
			if (a.after !== undefined && a.after.includes(b)) {
				if (b.after !== undefined && b.after.includes(a)) {
					throw error(`Systems ${a.name} and ${b.name} are in a circular dependency`);
				}
				return false;
			}

			if (b.after !== undefined && b.after.includes(a)) {
				return true;
			}

			return false;
		});

		return insertionSort<System>(unscheduledSystems, (a, b) => {
			return a.priority < b.priority;
		});
	}
}
