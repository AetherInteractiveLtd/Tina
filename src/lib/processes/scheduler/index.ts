import { RunService } from "@rbxts/services";

import { ExecutionGroup } from "../../ecs/system";
import { ConnectionUtil } from "../../util/connection-util";
import { Process } from "../process";

export abstract class Scheduler {
	public executionGroup?: ExecutionGroup;
	public ticksPerSecond?: number;

	private processes: Map<Process, number /** Current tick */> = new Map();
	private suspended: Map<Process, number> = new Map();

	private stopped = false;

	constructor(configuration?: { executionGroup?: ExecutionGroup; ticksPerSecond?: number }) {
		this.executionGroup = configuration?.executionGroup ?? RunService.Heartbeat;

		ConnectionUtil.connect(this.executionGroup, (dt: number) => {
			this.update(dt);
		});
	}

	/**
	 * Schedules a new process.
	 *
	 * @param process process to schedule.
	 */
	public schedule(process: Process): void {
		return void this.processes.set(process, os.clock());
	}

	/**
	 * Unschedules a current on-going process, deferred to the end of the current resumption cycle.
	 *
	 * @param process process to unschedule.
	 */
	public unschedule(process: Process): void {
		return void task.defer(() => this.processes.delete(process));
	}

	/**
	 * Checks if a Scheduler has any matching process.
	 *
	 * @param process a process to check on.
	 */
	public has(process: Process): boolean {
		return this.processes.has(process);
	}

	/**
	 * Suspends specified process.
	 *
	 * @param process process to suspend.
	 * @param ticks ticks to suspend the process.
	 */
	public suspend(process: Process, ticks: number): void {
		return void this.suspended.set(process, ticks);
	}

	/**
	 * Unsuspends specified process (to the end of the current resumption cycle).
	 *
	 * @param process process to unsuspend.
	 */
	public unsuspend(process: Process): void {
		return void task.defer(() => this.suspended.delete(process));
	}

	/**
	 * Checks if a process is currently suspended.
	 *
	 * @param process process to check on.
	 */
	public isSuspended(process: Process): boolean {
		return this.suspended.has(process);
	}

	/**
	 * Stops current processes, can be resumed later on.
	 */
	public stop(): void {
		this.stopped = true;
	}

	/**
	 * Resumes already going processes.
	 */
	public resume(): void {
		this.stopped = false;
	}

	/**
	 * Clears all current processes going on.
	 */
	public clear(): void {
		return void task.defer(() => this.processes.clear());
	}

	/**
	 * Updates all available processes.
	 *
	 * @param dt delta time between frames (or ticks)
	 */
	private update(dt: number): void {
		if (this.stopped) return;

		for (const [process, lastTick] of this.processes) {
			let delta = dt;

			if (this.ticksPerSecond !== undefined) {
				const currentTick = os.clock();

				delta = (currentTick - lastTick) * dt;
				if (delta < this.ticksPerSecond) return;

				this.processes.set(process, currentTick - (delta % this.ticksPerSecond));
			}

			if (this.suspended.has(process)) {
				const leftTicks = this.suspended.get(process)! - 1;

				if (leftTicks > 0) {
					return void this.suspended.set(process, leftTicks);
				}

				this.suspended.delete(process);
			}

			return process.update(delta);
		}
	}
}

class InternalScheduler extends Scheduler {
	constructor() {
		super();

		this.executionGroup = RunService.Heartbeat;
	}
}

export const TinaScheduler = new InternalScheduler();
