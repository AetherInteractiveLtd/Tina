import { RunService } from "@rbxts/services";
import { Query, System, World } from "@rbxts/tina";
import { ALL } from "@rbxts/tina/out/lib/ecs/query";
import { Position, PositionProxy } from "server/components/Position";
import { Velocity, VelocityProxy } from "server/components/Velocity";

/**
 * An example of a simple system.
 *
 * This system updates an entities Position and Velocity every frame.
 */
export class BasicSystem extends System {
	private movementQuery!: Query;

	private positionProxy = new PositionProxy();
	private velocityProxy = new VelocityProxy();

	constructor() {
		super();

		/**
		 * We can set the execution group of a system to any signal with a
		 * .connect event. Every time this signal is fired, the `onUpdate`
		 * method of the system will automatically be called.
		 */
		this.executionGroup = RunService.Heartbeat;
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
		this.movementQuery = world.createQuery(ALL(Position, Velocity));
	}

	/**
	 * The onUpdate method is called every time the execution group fires.
	 */
	public onUpdate(_world: World): void {
		const position = this.positionProxy;
		const velocity = this.velocityProxy;
		print("onUpdate");

		this.movementQuery.forEach(entityId => {
			// const xVelocity = Velocity.x[entity.entityId];

			position.entityId = entityId;
			velocity.entityId = entityId;

			Position.set(entityId, {
				x: position.getX() + velocity.getX(),
				y: position.getY() + velocity.getY(),
				z: position.getZ() + velocity.getZ(),
			});

			// print(position.getX(), position.getY(), position.getZ());
		});
	}
}
