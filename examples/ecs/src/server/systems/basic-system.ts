import { RunService } from "@rbxts/services";
import { ALL, Query, System, World } from "@rbxts/tina";
import { Position } from "server/components/Position";
import { Velocity } from "server/components/Velocity";

import { OtherSystem } from "./another-system";

const position = Position.value;
const velocity = Velocity.value;

let id = 0;

/**
 * An example of a simple system.
 *
 * This system updates an entities Position and Velocity every frame.
 */
export const BasicSystem = new (class BasicSystem extends System {
	private movementQuery!: Query;

	constructor() {
		super();

		/*
		 * We can set the execution group of a system to any signal with a
		 * .connect event. Every time this signal is fired, the `onUpdate`
		 * method of the system will automatically be called.
		 */
		this.executionGroup = RunService.Heartbeat;

		/* We want to ensure that this system runs after the OtherSystem */
		this.after = [OtherSystem];
	}

	/**
	 * Configure queries is where you define the queries that you want to use
	 * in your system. This is called when the system is first scheduled.
	 *
	 * Typically you would pre-schedule all your systems before starting the
	 * world that the system belongs to. Scheduling systems is potentially
	 * expensive as we need to re-sort the systems if we wish to insert a new
	 * system in at run time.
	 */
	public configureQueries(world: World): void {
		id = world.add();
		world
			.addComponent(id, Position, { value: new Vector3(0, 0, 0) })
			.addComponent(id, Velocity, { value: new Vector3(1, 2, 3) });

		this.movementQuery = world.createQuery(ALL(Position, Velocity));
	}

	/**
	 * The onUpdate method is called every time the execution group fires.
	 */
	public onUpdate(_world: World): void {
		this.movementQuery.forEach(entityId => {
			position[entityId] = position[entityId].add(velocity[entityId]);
		});
	}
})();
