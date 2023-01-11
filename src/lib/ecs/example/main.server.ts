import { RunService } from "@rbxts/services";

import { Component } from "../component";
import { System } from "../system";
import { World } from "../world";
import { BasicSystem } from "./systems/basic-system";

const world = new World({
	defaultExecutionGroup: RunService.Heartbeat,
	name: "Example World",
});

// let components: Array<{}> = [];
// for (const component of components) {
// 	world.defineComponent({});
// }

// world.scheduleSystem(new BasicSystem());

// world.start();

// world.add();
