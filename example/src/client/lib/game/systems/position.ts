import { NOT, Query, System, World } from "@rbxts/tina";
import { Position, WorldObject } from "../components";
import { Immovable } from "../components/global";
import { Workspace } from "@rbxts/services";

export class SYSPosition extends System {
	private query!: Query;
	private updateQuery!: Query;
	
	configureQueries(world: World): void {
		this.query = world.createQuery(WorldObject, Position);
		this.updateQuery = world.createQuery(WorldObject, Position, NOT(Immovable));
	}
	
	onUpdate(world: World): void {
		for (const entityId of this.query.enteredQuery()) {
			let physical = WorldObject.physical[entityId];

			if (physical) {
				physical.Parent = Workspace;
				physical.ScaleTo(WorldObject.scale[entityId] ?? 1);

				physical.PivotTo(Position.CFrame[entityId]);
			} else {
				warn("A WorldObject was added that does not have a model, it will be safely removed from WorldObject.");
				world.removeComponent(entityId, WorldObject);
			}
		}

		for (const entityId of this.updateQuery.iter()) {
			let physical = WorldObject.physical[entityId];

			if (physical) {
				physical.ScaleTo(WorldObject.scale[entityId] ?? 1);
				
				physical.PivotTo(Position.CFrame[entityId]);
			} else {
				warn("A WorldObject is being updated that does not have a model, it will be safely removed from WorldObject.");
				world.removeComponent(entityId, WorldObject);
			}
		}

		for (const entityId of this.query.exitedQuery()) {
			let physical = WorldObject.physical[entityId];

			if (physical) {
				physical.Parent = undefined;
			}
		}
	}
}