import { HttpService, RunService } from "@rbxts/services";

type ScheduledFunction = {
	name: string | undefined;
	frequency: number | undefined;
	func: (deltaTime: number) => void;
	_lastRan: number | undefined;
};

const functions: Map<string, ScheduledFunction> = new Map();

RunService.Heartbeat.Connect(() => {
	functions.forEach((v, k) => {
		task.spawn(() => {
			const currentTime = os.clock();

			if (v.frequency !== undefined && v._lastRan !== undefined) {
				if (currentTime - v._lastRan > 1 / v.frequency) {
					debug.profilebegin(v.name || `scheduled_${k}`);
					v.func(currentTime - v._lastRan);
					debug.profileend();

					v._lastRan = currentTime;
				}
			}
		});
	});
});

export namespace scheduler {
	export function add(
		func: (deltaTime: number) => void,
		name: string | undefined,
		frequency: number | undefined,
	): string {
		const result: ScheduledFunction = {
			func: func,
			frequency: frequency || 60,
			name: name || undefined,
			_lastRan: 0,
		};

		const key: string = HttpService.GenerateGUID(false);
		functions.set(key, result);
		return key;
	}

	export function del(key: string) {
		functions.delete(key);
	}
}
