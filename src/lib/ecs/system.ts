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
	 *
	 * The only requirements for an execution group is that the group has a
	 * .Connect method.
	 */
	public executionGroup?: ExecutionGroup;

	/** The name of the system, primarily used for debugging purposes. */
	public name = "System";

	/**
	 * The priority order of the system.
	 * A higher priority means the system will execute first.
	 */
	public priority = 0;

	/** The time since the system was last called. */
	public dt = 0;

	/**
	 * The onUpdate method is called on every execution of this systems
	 * execution group.
	 *
	 * This should not typically be called manually, and instead the system
	 * should be scheduled according to an exwecution group using the
	 * {@link World.scheduleSystem} function.
	 *
	 * @param world The world that this system belongs to, this will be
	 * automatically passed in by the owning world on each system execution.
	 */
	public abstract onUpdate(world: World): void;

	/**
	 * Whether or not a system should be called.
	 *
	 * This should not be called directly. Instead you should use the
	 * {@link SystemManager.enableSystem} & {@link SystemManager.disableSystem}
	 * functions respectively.
	 * @hidden
	 */
	public enabled = true;
}

/**
 * The system manager is used to handle all scheduling and execution logic of
 * any system in a given world.
 */
export class SystemManager {
	private executionDefault: ExecutionGroup;
	private executionGroups: Set<ExecutionGroup> = new Set();
	private systems: Array<System> = new Array();
	private systemsByExecutionGroup: Map<ExecutionGroup, Array<System>> = new Map();
	private world: World;

	constructor(world: World) {
		this.executionDefault = world.options.defaultExecutionGroup ?? RunService.Heartbeat;
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

			system.dt = os.clock();
		});

		this.executionGroups.forEach(executionGroup => {
			executionGroup.Connect(() => {
				this.systemsByExecutionGroup.get(executionGroup)?.forEach(system => {
					if (!system.enabled) {
						return;
					}

					system.dt = os.clock() - system.dt;
					system.onUpdate(this.world);
				});
			});
		});
	}

	/**
	 * Call this to schedule an individual system.
	 *
	 * Calling this function is a potentially expensive operation. It is best
	 * advised to use {@link scheduleSystems} instead, and add multiple systems
	 * at once.
	 *
	 * @param system The system to schedule.
	 */
	public scheduleSystem(system: System): void {
		this.scheduleSystems([system]);
	}

	/**
	 * Schedules a given set of systems at once.
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
	 * @param system
	 */
	public unscheduleSystem(system: System): void {
		this.unscheduleSystems([system]);
	}

	/**
	 *
	 * @param systems
	 */
	public unscheduleSystems(systems: Array<System>): void {
		systems.forEach(system => {
			this.systems.remove(this.systems.indexOf(system));

			const systemInExecutionGroup = this.systemsByExecutionGroup.get(
				system.executionGroup ?? this.executionDefault,
			);
			systemInExecutionGroup?.remove(systemInExecutionGroup.indexOf(system));
		});

		// TODO: look into re-sorting systems. Removing a system could cause a
		// dependency conflict where a system originally relied on this one.
		// The other option to save resources could be to force the user to
		// unschedule any dependent systems themselves, and throw an error if
		// the user doesn't.
	}

	/**
	 * Enabled a system.
	 *
	 * This will not error if a system that is already enabled is enabled
	 * again.
	 *
	 * @param system The system that should be enabled.
	 */
	public enableSystem(system: System): void {
		system.enabled = true;

		// Should we also be enabling systems that depend here? Likely just
		// issue a warning to the dev that it hasn't been enabled.

		// do we include dev-only logging for things like this?
	}

	/**
	 * Disable a system.
	 *
	 * As scheduling a system can be a potentially expensive operation,
	 * this can be used for systems that are expected to be reenabled at a
	 * later point.
	 *
	 * @param system The system that should be disabled.
	 */
	public disableSystem(system: System): void {
		system.enabled = false;

		// Should we also be disabling dependent systems here?
	}

	/**
	 * Internally sorts all systems.
	 */
	private sortSystems(): void {
		this.systems.forEach(system => {
			this.systemsByExecutionGroup.get(system.executionGroup ?? this.executionDefault)?.push(system);
		});

		this.systemsByExecutionGroup.forEach((systems, group) => {
			this.systemsByExecutionGroup.set(group, this.orderSystemsByExecutionGroup(systems));
		});
	}

	/**
	 * Orders systems within the same execution group by their dependencies.
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

		return insertionSort(unscheduledSystems, (a, b) => {
			return a.priority < b.priority;
		});
	}

	/**
	 * Checks a given set of systems to ensure that the current scheduling
	 * requirements are valid.
	 *
	 * If the current requirements cannot be met, this function will throw an
	 * error and halt execution.
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
}
