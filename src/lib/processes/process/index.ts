import { Scheduler, TinaScheduler } from "../scheduler";
import { ProcessStatus } from "./types";

export abstract class Process {
	public scheduler: Scheduler;

	constructor(scheduler?: Scheduler) {
		this.scheduler = scheduler ?? TinaScheduler;
		this.scheduler.schedule(this);
	}

	/**
	 * Suspends current process by the given ticks (defaults to 1).
	 *
	 * @param ticks amount of ticks.
	 */
	public suspend(ticks = 1): void {
		return this.scheduler.suspend(this, ticks);
	}

	/**
	 * Resumes current process.
	 */
	public resume(): void {
		return this.scheduler.unsuspend(this);
	}

	/**
	 * Returns current process Status.
	 *
	 * @returns a string indicating it's current status.
	 */
	public status(): ProcessStatus {
		const isActive = this.scheduler.has(this);
		const isSuspended = this.scheduler.isSuspended(this);

		return isSuspended ? "suspended" : isActive ? "active" : !isActive ? "dead" : "unknown";
	}

	/**
	 * Deletes current process, not anymore needed.
	 */
	public delete(): void {
		return this.scheduler.unschedule(this);
	}

	/**
	 * Method invoked every tick (specified on the scheduler)
	 *
	 * @param dt delta time between ticks.
	 */
	public abstract update(dt: number): void;
}
