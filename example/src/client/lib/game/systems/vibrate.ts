import { ANY, Query, System, World } from "@rbxts/tina";
import { WorldObject } from "../components";
import { Vibrating } from "../components/misc";
import { IsHovered } from "../components/global";

export class SYSVibrate extends System {
	private query!: Query;
	configureQueries(world: World): void {
		this.query = world.createQuery(WorldObject, Vibrating);
	}

	onUpdate(world: World): void {
		for (const entityId of this.query.iter()) {
			WorldObject.tick[entityId] += 1;
			WorldObject.scale[entityId] = (math.sin(WorldObject.tick[entityId] * 0.1) + 1) / 2 + 0.5;
			print(WorldObject.scale[entityId]);
		}
	}
}
