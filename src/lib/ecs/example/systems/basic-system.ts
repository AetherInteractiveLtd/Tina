import { RunService } from "@rbxts/services";

import { EntityId } from "../../../types/ecs";
import { Query } from "../../query";
import { System } from "../../system";
import { World } from "../../world";

/**
 * An example of a simple system.
 */
export class BasicSystem extends System {
	private movementQuery!: Query;

	constructor() {
		super();
		this.executionGroup = RunService.RenderStepped;
	}

	/**
	 * Configure queries is where you define the queries that you want to use
	 * in your system. This is called when the system is first scheduled.
	 */
	public configureQueries(world: World): void {
		this.movementQuery = world.createQuery();
	}

	/**
	 * The onUpdate method is called every time the execution group fires.
	 */
	public onUpdate(world: World): void {
		this.movementQuery.forEach((entityId: EntityId) => {
			print(entityId);
		});
	}
}
