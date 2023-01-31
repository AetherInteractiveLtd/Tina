import { RunService } from "@rbxts/services";
import { World } from "@rbxts/tina";

import { Position } from "./components/Position";
import { Velocity } from "./components/Velocity";
// import { Component } from "../../component";
// import { System } from "../../system";
import { BasicSystem } from "./systems/basic-system";

// const world = new World({
// 	defaultExecutionGroup: RunService.Heartbeat,
// 	name: "Example World",
// });

// // let components: Array<{}> = [];
// // for (const component of components) {
// // 	world.defineComponent({});
// // }

// // for (const module of script.Parent?.systems.GetChildren()) {

// world.scheduleSystem(new BasicSystem());

// world.start();

// const id = world.add();
// world.addComponent(id, Position, { x: 0, y: 0, z: 0 }).addComponent(id, Velocity, { x: 1, y: 2, z: 3 });

// task.wait(3);

// world.removeComponent(id, Position);
// task.wait(1);

// world.addComponent(id, Position);
