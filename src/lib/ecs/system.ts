import { RunService } from "@rbxts/services";

import { EntityId } from "../types/ecs";
import { Query } from "./query";
import { World } from "./world";

// export type System = () => void;

// export type SystemReturn = {
// 	system: System;
// 	priority: number;
// 	name: string;
// 	after: Array<string>;
// };

export class SystemManager {
	private systems: Array<System> = [];

	// private connections: Map<RBXScriptSignal, Array<RBXScriptConnection>> = new Map();

	public start(world: World): void {
		const executionDefault = world.options.defaultExecutionGroup
			? world.options.defaultExecutionGroup
			: RunService.Heartbeat;

		for (const system of this.systems) {
			if (system.configureQueries !== undefined) {
				system.configureQueries(world);
			}

			executionDefault.Connect(() => {
				system.onUpdate(world);
			});
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

export type ExecutionGroup = RBXScriptSignal;

export interface System {
	configureQueries(world: World): void;
	onEntityAdded?(entity: EntityId): void;
	onEntityRemoved?(entity: EntityId): void;
}

export abstract class System {
	public after: Array<string> = [];
	public executionGroup?: ExecutionGroup;
	public name = "System";
	public priority = 0;

	public abstract onUpdate(world: World): void;
}

export class ExampleSystem extends System {
	private movementQuery!: Query;

	constructor() {
		super();
		this.executionGroup = RunService.RenderStepped;
	}

	public configureQueries(world: World): void {
		// this.movementQuery = world.createQuery(Position, Velocity));
	}

	public onUpdate(world: World): void {
		this.movementQuery.forEach((entityId: EntityId) => {
			print(entityId);
		});
	}
}

// export default function exampleSystem(world: World): SystemReturn {
// 	const position = world.defineTag();
// 	const query = world.createQuery(ALL(position));

// 	return {
// 		system: update(query),
// 		priority: 0,
// 		name: "ExampleSystem",
// 		after: [],
// 	};
// }

// function update(query:): void {
// 	print("Hi!");
// }
