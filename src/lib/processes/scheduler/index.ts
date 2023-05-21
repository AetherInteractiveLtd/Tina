import { RunService } from "@rbxts/services";

import { ConnectionLike, ConnectionUtil } from "../../util/connection-util";
import { Process } from "../process";
import { TProcessStatus } from "./types";

export namespace Scheduler {
	const processes: Map<string, Process> = new Map();
	const suspended: Map<string, number> = new Map();

	const connections: Map<string, ConnectionLike> = new Map();

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

			if (leftTicks > 0) {
				return void suspended.set(name, leftTicks);
			}

			suspended.delete(name);
		}

		return process.update(dt);
	};

	export function add(name: string, process: Process): void {
		return void task.defer(() => {
			if (process.executionGroup) {
				const connection = ConnectionUtil.connect(process.executionGroup, (dt: number) =>
					update(name, process, dt),
				);

				return connections.set(name, connection);
			}

			processes.set(name, process);
		});
	}

	export function remove(name: string): void {
		if (connections.has(name)) {
			ConnectionUtil.disconnect(connections.get(name)!);
			connections.delete(name);
		}

		return void task.defer(() => processes.delete(name));
	}

	export function get(name: string): Process | undefined {
		return processes.get(name);
	}

	export function has(name: string): boolean {
		return processes.has(name);
	}

	export function suspend(name: string, ticks: number): void {
		return void suspended.set(name, ticks);
	}

	export function unsuspend(name: string): void {
		return void suspended.delete(name);
	}

	export function status(name: string): TProcessStatus {
		const status = processes.has(name) || connections.has(name);

		print(processes.has(name), connections.has(name));

		return suspended.has(name) ? "suspended" : status ? "active" : !status ? "dead" : "unknown";
	}

	/**
	 * Heartbeat scheduled Process (default)
	 */
	RunService.Heartbeat.Connect((dt: number) => {
		for (const [name, process] of processes) update(name, process, dt);
	});
}
