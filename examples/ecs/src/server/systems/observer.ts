import { RunService } from "@rbxts/services";
import { Observer, System, World } from "@rbxts/tina";
import { Position } from "server/components/Position";
import { Velocity } from "server/components/Velocity";

/**
 * An example of a simple system.
 *
 * This system updates an entities Position and Velocity every frame.
 */
export class ObserverSystem extends System {
	private positionChanged!: Observer<Position>;
	private positionWithVelocity!: Observer<Position>;

	constructor() {
		super();
		this.executionGroup = RunService.Heartbeat;
	}

	/**
	 * Here we are going to create a few different observers. Observers are a
	 * way to listen for changes to the world. Observers can be used to listen
	 * for when a component is added, removed or changed.
	 *
	 * Observers are created by calling `world.createObserver` and passing in
	 * the component that you want to listen for. You can then chain on any
	 * number of `event` calls to register for the events that you want to
	 * listen for.
	 *
	 * You can also chain on a `with` call to ensure that the entity has a
	 * specific component.
	 */
	public configureQueries(world: World): void {
		this.positionChanged = world.createObserver(Position);

		this.positionWithVelocity = world.createObserver(Position).with(Velocity);
	}

	/**
	 * The onUpdate method is called every time the execution group fires.
	 */
	public onUpdate(_world: World): void {
		this.positionChanged.forEach(entityId => {
			// This will be called when the Position component is updated on an
			// entity. There is no check to see if the value actually changed,
			// this will be called every time the component `set' method is
			// called.
		});

		this.positionWithVelocity.forEach(entityId => {
			// This will be called when the Position component is updated on an
			// entity that also has a Velocity component.
			// This is syntactic sugar for the following in the forEach loop:
			// if (!world.hasComponent(entityId, Velocity)) return;
		});
	}
}
