import { ComponentTypes, createComponent, GetComponentSchema } from "@rbxts/tina/out/lib/ecs/component";

import { Vector3Proxy } from "./Velocity";

export const Position = createComponent({
	x: ComponentTypes.number,
	y: ComponentTypes.number,
	z: ComponentTypes.number,
});

export class PositionProxy extends Vector3Proxy {
	constructor() {
		super(Position as unknown as GetComponentSchema<typeof Position>, -1);
	}
}
