import { RunService } from "@rbxts/services";

import { insertionSort } from "../util/array-utils";
import { ConnectionLike, ConnectionUtil, SignalLike } from "../util/connection-util";
import { World } from "./world";

export type ExecutionGroup = SignalLike;

export type StorageObject = {
	cleanup: () => void;
	setup: () => void;
};

interface SystemInternal extends System {
	/**
	 * Storage for errors that have occurred recently in the system. This is
	 * used to prevent spamming the console with errors.
	 */
	recentErrors?: Map<string, number>;
}

export interface System {
	/**
	 * An optional hook that can be used to clean up the system. This is useful
	 * for cleaning up any external context that was created during the
	 * system's lifecycle, or for cleaning up queries that were created.
	 *
	 * @note The cleanup method will only be called if the system is
	 * unscheduled from the world, or if the world is destroyed. You do not
	 * typically need to use this method.
	 */
	cleanup(): void;
	/**
	 * The configureQueries method is optionally called when the system is
	 * first run. This is a good place to setup any queries that the system
	 * will use.
	 *
	 * @param world The world that this system belongs to. This will be passed
	 * in automatically.
	 */
	configureQueries(world: World): void;
	/**
	 * An optional hook that can be used to initialize the system. Here we
	 * could setup initial entities with components, or perform any other setup
	 * logic.
	 *
	 * This is useful as this will be called on the start of the world, but
	 * before the first update. This means we can do any initial setup while
	 * ensuring that the first update has all the data required.
	 *
	 * @param world The world that this system belongs to. This will be passed
	 * in automatically.
	 */
	initialize(world: World): void;
	/**
	 * The prepare method is optionally called when the system is first run.
	 * If this method returns a promise, the system will not be scheduled until
	 * the promise resolves.
	 *
	 * This hooks into the world lifecycle, and the world creation will not
	 * be completed until this method resolves.
	 *
	 * This is typically used to perform any asynchronous setup logic such as
	 * loading external data or setting up external context useful for the
	 * system. The world is not accessible at this point, so you should not
	 * attempt to use it.
	 */
	prepare(): Promise<void>;
}

/**
 * The system class is the base class for all systems.
 */
export abstract class System {
	/** An optional set of systems that must be executed before this system */
	public after?: Array<System>;
	/** The time since the system was last called. */
	public dt = 0;
	/**
	 * Whether or not a system should be called.
	 *
	 * This should not be called directly. Instead, you should use the
	 * {@link SystemManager.enableSystem} & {@link SystemManager.disableSystem}
	 * functions respectively.
	 * @hidden
	 */
	public enabled = true;
	/**
	 * The group that this system will be executed on, e.g. PostSimulation,
	 * PreRender, etc.
	 *
	 * The only requirement for an execution group is that the group has a
	 * .Connect method.
	 */
	public executionGroup?: ExecutionGroup;
	/**	The time that the system was last called. */
	public lastCalled = 0;
	/** The name of the system is primarily used for debugging purposes. */
	/**
	 * The priority order of the system.
	 * A higher priority means the system will execute first.
	 */
	public priority = 0;
	/**
	 * A list of storages that are used by this system.
	 *
	 * An example of a storage is `createEvent`, which collects all the events
	 * since the last call of its iterator.
	 */
	public storage: Array<StorageObject> = [];

	constructor(ctor?: Partial<Pick<System, "after" | "enabled" | "executionGroup" | "priority">>) {
		if (ctor === undefined) {
			return;
		}

		this.after = ctor.after;
		this.enabled = ctor.enabled ?? this.enabled;
		this.executionGroup = ctor.executionGroup;
		this.priority = ctor.priority ?? this.priority;
	}

	/**
	 * The onUpdate method is called on every execution of this systems
	 * execution group.
	 *
	 * This should not typically be called manually, and instead the system
	 * should be scheduled according to an execution group using the
	 * {@link World.scheduleSystem} function.
	 *
	 * @param world The world that this system belongs to. This will be
	 * automatically passed in by the owning world on each system execution.
	 */
	public abstract onUpdate(world: World): void;
}

/**
 * The system manager is used to handle all scheduling and execution logic of
 * any system in a given world.
 */
export class SystemManager {
	private executionDefault: ExecutionGroup;
	private executionGroupSignals: Map<ExecutionGroup, ConnectionLike> = new Map();
	private executionGroups: Set<ExecutionGroup> = new Set();
	/** Whether or not the system manager has began execution. */
	private started = false;
	// private systemArgs?: Array<unknown>;
	private systems: Array<System> = [];
	private systemsByExecutionGroup: Map<ExecutionGroup, Array<System>> = new Map();
	private world: World;

	constructor(world: World) {
		this.executionDefault = world.options.defaultExecutionGroup ?? RunService.PostSimulation;
		this.world = world;
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

		for (const storage of system.storage) {
			storage.cleanup();
		}

		// TODO: Should we also be disabling dependent systems here?
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

		for (const storage of system.storage) {
			storage.setup();
		}

		// TODO: Should we also be enabling systems that depend here? Likely just
		// issue a warning to the dev that it hasn't been enabled.
		// do we include dev-only logging for things like this?
	}

	/**
	 * Schedules an individual system.
	 *
	 * Calling this function is a potentially expensive operation. It is best
	 * advised to use {@link scheduleSystems} instead, and add multiple systems
	 * at once.
	 *
	 * @param system The system to schedule.
	 */
	public scheduleSystem(system: System): Promise<void> {
		return this.scheduleSystems([system]);
	}

	/**
	 * Schedules a given set of systems at once.
	 *
	 * @param systems The systems to schedule.
	 */
	public async scheduleSystems(systems: Array<System>): Promise<void> {
		debug.profilebegin("SystemManager:scheduleSystems");
		{
			for (const system of systems) {
				let executionGroup = this.executionDefault;
				if (system.executionGroup !== undefined) {
					executionGroup = system.executionGroup;
				}

				if (!this.executionGroups.has(executionGroup)) {
					this.executionGroups.add(executionGroup);
					this.systemsByExecutionGroup.set(executionGroup, []);
				}

				this.systems.push(system);
			}

			this.sortSystems(systems);

			/**
			 * If the system manager has already started, we go through the
			 * system lifecycle individually for each system rather than as a
			 * batch.
			 */
			if (this.started) {
				for (const system of systems) {
					this.start([system]).catch(err => {
						throw err;
					});
				}
			}
		}
		debug.profileend();
	}

	/**
	 * Optional arguments that will be passed to all systems on each update.
	 *
	 * `World` will always be the first argument, followed by any arguments
	 * passed to this function in the order they were passed.
	 * 
	 * @note This is currently not implemented.

	 * @param args The arguments to pass to all systems.
	 */
	public setArgs(..._args: Array<unknown>): void {
		// TODO: Find a way to pass args to systems while keeping type safety
		throw "Not implemented";

		// this.systemArgs = args;
	}

	/**
	 * Starts the system manager.
	 *
	 * This will run through the system lifecycle.
	 *
	 * Prepare (Async) -> Initialize -> Setup -> Execute
	 *
	 * Prepare will be called on all systems in parallel, and is the only step
	 * that is allowed to be asynchronous.
	 *
	 * @return A promise that will resolve once all systems have been prepared.
	 */
	public async start(systems: Array<System> = this.systems): Promise<void> {
		const promises: Array<Promise<void>> = [];
		for (const system of systems) {
			promises.push(this.prepareSystem(system));
		}

		return Promise.allSettled(promises)
			.andThen(() => {
				for (const system of systems) {
					this.initializeSystem(system);
				}

				for (const system of systems) {
					this.setupSystem(system);
				}

				for (const system of systems) {
					this.setupSystemStorage(system);
				}

				this.executeSystems();

				this.started = true;
			})
			.catch(err => {
				throw `Error while preparing systems: ${err}`;
			});
	}

	/**
	 * Stops all systems from being executed.
	 */
	public stop(): void {
		for (const [_, signal] of this.executionGroupSignals) {
			ConnectionUtil.disconnect(signal);
		}
	}

	/**
	 * Unschedule a system from the system manager.
	 *
	 * If a system needs to be re-scheduled, it is recommended instead to
	 * disable it using {@link SystemManager.disableSystem}, as scheduling a
	 * a system requires the system to be re-sorted.
	 *
	 * @param system The system to unschedule.
	 */
	public unscheduleSystem(system: System): void {
		this.unscheduleSystems([system]);
	}

	/**
	 * Unschedule a set of systems from the system manager.
	 *
	 * If a system needs to be re-scheduled, it is recommended instead to
	 * disable it using {@link SystemManager.disableSystem}, as scheduling a
	 * a system requires the system to be re-sorted.
	 *
	 * @param systems The systems to unschedule.
	 */
	public unscheduleSystems(systems: Array<System>): void {
		for (const system of systems) {
			this.systems.remove(this.systems.indexOf(system));

			const systemInExecutionGroup = this.systemsByExecutionGroup.get(
				system.executionGroup ?? this.executionDefault,
			);
			systemInExecutionGroup?.remove(systemInExecutionGroup.indexOf(system));

			if (system.cleanup !== undefined) {
				system.cleanup();
			}

			for (const storage of system.storage) {
				storage.cleanup();
			}
		}

		// TODO: look into re-sorting systems. Removing a system could cause a
		// dependency conflict where a system originally relied on this one.
		// The other option to save resources could be to force the user to
		// unschedule any dependent systems themselves and throw an error if
		// the user doesn't.

		// TODO: Sort systems could take a flag to only sort certain execution
		// groups. We don't need to re-sort all execution groups if we only
		// removed a system from one of them.
	}

	/**
	 * A helper function that will ensure that a system runs correctly.
	 *
	 * This will check if the system yielded, and if it did, it will throw an
	 * error. It will also suppress errors if the system has recently errored.
	 *
	 * @param system The system to check for errors.
	 * @param callback The system function to call.
	 */
	private ensure(system: SystemInternal, callback: () => void): void {
		const thread = coroutine.create(callback);
		const [success, result] = coroutine.resume(thread);
		if (coroutine.status(thread) !== "dead") {
			coroutine.close(thread);
			task.spawn(
				error,
				`System ${tostring(
					getmetatable(system),
				)} yielded! Yielding in systems is not supported!`,
			);
		}

		if (!success) {
			if (system.recentErrors === undefined) {
				system.recentErrors = new Map();
			}

			const recentError = `System ${tostring(getmetatable(system))} errored! ${result} + \n ${
				debug.traceback
			}`;

			const lastError = system.recentErrors.get(recentError);

			if (lastError !== undefined && lastError > os.clock()) {
				return;
			}

			system.recentErrors.set(recentError, os.clock() + 10);
			task.spawn(error, recentError);
			warn("The above error has been suppressed for 10 seconds.");
		}
	}

	/**
	 * Connects the execution group to the system manager, and runs all systems
	 * in that execution group.
	 */
	private executeSystems(): void {
		for (const executionGroup of this.executionGroups) {
			const connection = ConnectionUtil.connect(executionGroup, () => {
				this.runSystems(executionGroup);
			});

			this.executionGroupSignals.set(executionGroup, connection);
		}
	}

	/**
	 * Initializes a given system.
	 *
	 * This will call the `initialize` method on the system, if it exists.
	 * Systems are not required to have an `initialize` method, but if they do
	 * they must be synchronous.
	 *
	 * @param system The system to initialize.
	 */
	private initializeSystem(system: System): void {
		if (!system.initialize) {
			return;
		}

		this.ensure(system, () => {
			system.initialize(this.world);
		});
	}

	/**
	 * Orders systems within the same execution group by their dependencies.
	 *
	 * @param unscheduledSystems The systems to order.
	 *
	 * @returns The ordered systems.
	 */
	private orderSystemsByExecutionGroup(unscheduledSystems: Array<System>): Array<System> {
		this.validateSystems(unscheduledSystems);

		unscheduledSystems.sort((a, b) => {
			if (a.after !== undefined && a.after.includes(b)) {
				if (b.after !== undefined && b.after.includes(a)) {
					throw error(
						`Systems ${tostring(getmetatable(a))} and ${tostring(
							getmetatable(b),
						)} are in a circular dependency`,
					);
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
	 * Calls the prepare method on a given system.
	 *
	 * @param system The system to prepare.
	 *
	 * @returns The promise returned by the prepare method.
	 */
	private async prepareSystem(system: System): Promise<void> {
		if (!system.prepare) {
			return;
		}

		return system.prepare();
	}

	/**
	 * Runs all systems in a given execution group.
	 *
	 * @param executionGroup The execution group to run.
	 */
	private runSystems(executionGroup: ExecutionGroup): void {
		for (const system of this.systemsByExecutionGroup.get(executionGroup)!) {
			if (!system.enabled) {
				continue;
			}

			system.dt = os.clock() - system.lastCalled;
			system.lastCalled = os.clock();

			debug.profilebegin(tostring(getmetatable(system)));
			{
				this.ensure(system, () => {
					system.onUpdate(this.world /**, ...this.systemArgs */);
					this.world.flush();
				});
			}
			debug.profileend();
		}
	}

	/**
	 * Initializes a system.
	 *
	 * @param system The system to initialize.
	 */
	private setupSystem(system: System): void {
		if (!system.onUpdate) {
			throw `System ${tostring(getmetatable(system))} does not have an onUpdate method`;
		}

		if (system.configureQueries !== undefined) {
			this.ensure(system, () => {
				system.configureQueries(this.world);
			});
		}

		system.lastCalled = os.clock();
	}

	/**
	 * Initializes all the system storages.
	 *
	 * @param system
	 * @returns
	 */
	private setupSystemStorage(system: System): void {
		if (!system.enabled) {
			return;
		}

		for (const storage of system.storage) {
			storage.setup();
		}
	}

	/**
	 * Internally sorts all systems by the given set of requirements.
	 */
	private sortSystems(systems: Array<System>): void {
		debug.profilebegin("SystemManager:sortSystems");
		{
			for (const system of systems) {
				this.systemsByExecutionGroup
					.get(system.executionGroup ?? this.executionDefault)
					?.push(system);
			}

			for (const [group, systems] of this.systemsByExecutionGroup) {
				this.systemsByExecutionGroup.set(group, this.orderSystemsByExecutionGroup(systems));
			}
		}
		debug.profileend();
	}

	/**
	 * Checks a given set of systems to ensure that the current scheduling
	 * requirements are valid.
	 *
	 * If the current requirements cannot be met, this function will throw an
	 * error and halt execution.
	 *
	 * @param systems The systems to validate.
	 */
	private validateSystems(systems: Array<System>): void {
		for (const system of systems) {
			if (system.after === undefined) {
				return;
			}

			for (const afterSystem of system.after) {
				if (system.executionGroup !== afterSystem.executionGroup) {
					const msg = `System ${tostring(getmetatable(system))} and ${tostring(
						getmetatable(afterSystem),
					)} are in different execution groups`;
					throw msg;
				}
			}
		}
	}
}
