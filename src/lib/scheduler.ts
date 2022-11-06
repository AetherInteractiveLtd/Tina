import { HttpService, RunService } from "@rbxts/services";

type ScheduledFunction = {
	name: string | undefined;
	func: (deltaTime: number) => void;
};

const functions: Map<string, ScheduledFunction> = new Map();

RunService.Heartbeat.Connect(() => {
	const currentTime = os.clock();
	functions.forEach((v, k) => {
		task.spawn(() => {
			debug.profilebegin(`scheduled_${v.name || k}`);
			v.func(currentTime);
			debug.profileend();
		});
	});
});

export namespace Scheduler {
	export function add(name: string, func: (deltaTime: number) => void): void {
		const result: ScheduledFunction = {
			func: func,
			name: name || "unnamed",
		};

		if (functions.has(name)) {
			warn("Duplicate function exists in Scheduler, choose a different name. Defaulting to a GUID"); // TODO, switch to logger
			name = HttpService.GenerateGUID(false);
		}

		functions.set(name, result);
	}

	export function del(name: string) {
		functions.delete(name);
	}
}
