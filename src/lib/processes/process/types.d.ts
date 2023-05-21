import { TProcessStatus } from "../scheduler/types";

export interface IProcessImplementation {
	/**
	 * Initializes current process.
	 */
	resume(): void;

	/**
	 * Suspends the current process by the given ticks, defaults to 1.
	 *
	 * @param ticks the amount of ticks to suspend the process.
	 */
	suspend(ticks: number): void;

	/**
	 * Returns the current status of the process.
	 *
	 * @returns A string for it's status.
	 */
	status(): TProcessStatus;
}
