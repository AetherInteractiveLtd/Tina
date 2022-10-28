import { HttpService, RunService } from "@rbxts/services";

type ScheduledFunction = {
	name: string | undefined;
	func: (deltaTime: number) => void;
};

const functions: Array<ScheduledFunction> = [];

RunService.Heartbeat.Connect(() => {
	functions.forEach((v, k) => {
		task.spawn(() => {
			const currentTime = os.clock();
			debug.profilebegin(`scheduled_${v.name || k}`);
			v.func(currentTime);
			debug.profileend();
		});
	});
});

export namespace Scheduler {
	export function add(func: (deltaTime: number) => void, name: string | undefined) {
		const result: ScheduledFunction = {
			func: func,
			name: name || "unnamed",
		};

		functions.push(result);
	}
}
