import { RunService } from "@rbxts/services";

import { Process } from "../process";
import { TProcessStatus } from "./types";

export namespace Scheduler {
	const processes: Map<string, Process> = new Map();
	const suspended: Map<string, number> = new Map();

	const connections: Map<string, RBXScriptConnection> = new Map();

	/**
	 * Updates current process.
	 *
	 * @param name process's name
	 * @param process the process to update
	 * @param dt the delta time provided within frame to frame.
	 */
	const update = (name: string, process: Process, dt: number): void => {
		const ticksPerSecond = process.ticksPerSecond;

		if (ticksPerSecond !== undefined) {
			const lastTick = process.lastTick;
			const currentTick = os.clock();

			// eslint-disable-next-line no-param-reassign
			dt = currentTick - lastTick;

			if (dt < ticksPerSecond) return;

			process.lastTick = currentTick - (dt % ticksPerSecond);
		}

		if (suspended.has(name)) {
			const leftTicks = suspended.get(name)! - 1;

			if (leftTicks <= 0) {
				suspended.delete(name);
			} else {
				return void suspended.set(name, leftTicks);
			}
		}

		return process._update(dt);
	};

	export function add(name: string, process: Process): void {
		return void task.defer(() => {
			if (process.executionGroup) {
				const connection = process.executionGroup.Connect((dt: number) =>
					update(name, process, dt),
				);

				return connections.set(name, connection);
			}

			processes.set(name, process);
		});
	}

	export function remove(name: string): void {
		connections.get(name)?.Disconnect();
		connections.delete(name); // Doesn't matter if it exists or not, it's just setting it to nil

		return void task.defer(() => processes.delete(name));
	}

	export function suspend(name: string, ticks: number): void {
		return void suspended.set(name, ticks);
	}

	export function unsuspend(name: string): void {
		return void suspended.delete(name);
	}

	export function status(name: string): TProcessStatus {
		const status = processes.has(name) || connections.has(name);

		return status ? "active" : !status ? "dead" : suspended.has(name) ? "suspended" : "unknown";
	}

	/**
	 * Heartbeat scheduled Process (default)
	 */
	RunService.Heartbeat.Connect((dt: number) => {
		for (const [name, process] of processes) update(name, process, dt);
	});
}
