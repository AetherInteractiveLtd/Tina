import { ALL } from "./query";
import { World } from "./world";

export type System = () => void;

export type SystemReturn = {
	system: System;
	priority: number;
	name: string;
	after: Array<string>;
};

export class SystemManager {
	private systems: Array<System> = [];

	public start(): void {
		for (const system of this.systems) {
			system();
		}
	}

	public scheduleSystem(system: System): void {
		this.systems.push(system);
	}

	public endSystem(): void {}

	public sortSystems(): void {}
}

// @System({
// 	name: "ExampleSystem",
// 	after: [],
// 	step: RunService.Heartbeat,
// })

export default function exampleSystem(world: World): SystemReturn {
	const position = world.defineTag();
	const query = world.createQuery(ALL(position));

	return {
		system: update(query),
		priority: 0,
		name: "ExampleSystem",
		after: [],
	};
}

function update(query:): void {
	print("Hi!");
}
