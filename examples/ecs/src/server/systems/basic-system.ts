import { RunService } from "@rbxts/services";
import { Query, System, World } from "@rbxts/tina";
import { ALL } from "@rbxts/tina/out/lib/ecs/query";
import Position from "server/components/Position";


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
		this.movementQuery = world.createQuery(ALL(Position));
	}

	/**
	 * The onUpdate method is called every time the execution group fires.
	 */
	public onUpdate(world: World): void {
		this.movementQuery.forEach(entityId => {
			print(entityId);
			Position.update(world, entityId, {
				x = x + 1;
			});
		});
	}
}
