import { RunService } from "@rbxts/services";

import { insertionSort } from "../util/array-utils";
import { World } from "./world";

export type ExecutionGroup = RBXScriptSignal;

export abstract class System {
    /** An optional set of systems that must be executed before this system */
    public after?: Array<System>;
    /** The time since the system was last called. */
    public dt = 0;
    /**
     * Whether or not a system should be called.
     *
     * This should not be called directly. Instead you should use the
     * {@link SystemManager.enableSystem} & {@link SystemManager.disableSystem}
     * functions respectively.
     * @hidden
     */
    public enabled = true;
    /**
     * The group that this system will be executed on, e.g. Heartbeat,
     * RenderStepped, etc.
     *
     * The only requirements for an execution group is that the group has a
     * .Connect method.
     */
    public executionGroup?: ExecutionGroup;
    /**	The time that the system was last called. */
    public lastCalled = 0;
    /** The name of the system, primarily used for debugging purposes. */
    public name = "System";
    /**
     * The priority order of the system.
     * A higher priority means the system will execute first.
     */
    public priority = 0;

    /**
     * The configureQueries method is optionally called when the system is
     * first run. This is typically used to configure the queries that the
     * system will use, however it can also be used to perform any other setup
     * logic as required.
     *
     * @param world The world that this system belongs to; this will be passed
     * in automatically.
     */
    public abstract configureQueries?(world: World): void;
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
}

/**
 * The system manager is used to handle all scheduling and execution logic of
 * any system in a given world.
 */
export class SystemManager {
    private executionDefault: ExecutionGroup;
    private executionGroups: Set<ExecutionGroup> = new Set();
    private systems: Array<System> = [];
    private systemsByExecutionGroup: Map<ExecutionGroup, Array<System>> = new Map();
    private world: World;

    constructor(world: World) {
        this.executionDefault = world.options.defaultExecutionGroup ?? RunService.Heartbeat;
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

        // Should we also be disabling dependent systems here?
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
     * @param systems The systems to schedule.
     */
    public scheduleSystems(systems: Array<System>): void {
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

            this.sortSystems();
        }
    }

    /**
     * Starts the system manager.
     *
     * This will start all systems that have been previously scheduled, and run
     * them on their respective execution groups.
     */
    public start(): void {
        for (const system of this.systems) {
            this.setupSystem(system);
        }

        for (const executionGroup of this.executionGroups) {
            executionGroup.Connect(() => {
                for (const system of this.systemsByExecutionGroup.get(executionGroup) ?? []) {
                    if (!system.enabled) {
                        return;
                    }

                    system.dt = os.clock() - system.lastCalled;
                    system.lastCalled = os.clock();
                    system.onUpdate(this.world);
                }
            });
        }
    }

    /**
     * Unschedules a system from the system manager.
     *
     * If a system needs to be re-scheduled, it is recommended to instead
     * disable it using {@link SystemManager.disableSystem} function, as
     * scheduling a system requires the system to be re-sorted.
     *
     * @param system The system to unschedule.
     */
    public unscheduleSystem(system: System): void {
        this.unscheduleSystems([system]);
    }

    /**
     * Unschedules a set of systems from the system manager.
     *
     * If a system needs to be re-scheduled, it is recommended to instead
     * disable it using {@link SystemManager.disableSystem} function, as
     * scheduling a system requires the system to be re-sorted.
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
        }

        // TODO: look into re-sorting systems. Removing a system could cause a
        // dependency conflict where a system originally relied on this one.
        // The other option to save resources could be to force the user to
        // unschedule any dependent systems themselves, and throw an error if
        // the user doesn't.
    }

    /**
     * Orders systems within the same execution group by their dependencies.
     * @param unscheduledSystems The systems to order.
     * @returns The ordered systems.
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
     * Initializes a system.
     * @param system The system to initialize.
     */
    private setupSystem(system: System): void {
        if (!system.onUpdate) {
            throw error(`System ${system.name} does not have an onUpdate method`);
        }

        if (system.configureQueries !== undefined) {
            system.configureQueries(this.world);
        }

        system.lastCalled = os.clock();
    }

    /**
     * Internally sorts all systems by the given set of requirements.
     */
    private sortSystems(): void {
        debug.profilebegin("SystemManager:sortSystems");
        {
            for (const system of this.systems) {
                this.systemsByExecutionGroup
                    .get(system.executionGroup ?? this.executionDefault)
                    ?.push(system);
            }

            for (const [group, systems] of this.systemsByExecutionGroup) {
                this.systemsByExecutionGroup.set(group, this.orderSystemsByExecutionGroup(systems));
            }
        }
    }

    /**
     * Checks a given set of systems to ensure that the current scheduling
     * requirements are valid.
     *
     * If the current requirements cannot be met, this function will throw an
     * error and halt execution.
     * @param systems The systems to validate.
     */
    private validateSystems(systems: Array<System>): void {
        for (const system of systems) {
            if (system.after === undefined) {
                return;
            }

            for (const afterSystem of system.after) {
                if (system.executionGroup !== afterSystem.executionGroup) {
                    throw error(
                        `System ${system.name} and ${afterSystem.name} are in different execution groups`,
                    );
                }
            }
        }
    }
}
