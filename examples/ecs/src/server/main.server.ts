import { RunService } from "@rbxts/services";
import Tina from "@rbxts/tina";

import { OtherSystem } from "./systems/another-system";
import { BasicSystem } from "./systems/basic-system";

const world = Tina.createWorld({
	defaultExecutionGroup: RunService.Heartbeat,
	name: "Example World",
});

world
	.scheduleSystems(BasicSystem, OtherSystem)
	.andThen(async () => {
		await world.start();
	})
	.catch(err => warn(err));
