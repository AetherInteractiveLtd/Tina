import Tina, { ComponentTypes, GetComponentSchema } from "@rbxts/tina";

export const Position = Tina.createComponent({
	value: ComponentTypes.Vector3,
});

export type Position = GetComponentSchema<typeof Position>;
