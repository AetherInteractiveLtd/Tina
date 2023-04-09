import Tina, { ComponentTypes } from "@rbxts/tina";

export const Position = Tina.createComponent({
	CFrame: ComponentTypes.CFrame
});

export const Velocity = Tina.createComponent({
	Vector3: ComponentTypes.Vector3
});

export const Immovable = Tina.createTag();

export const Interactive = Tina.createTag();
export const IsHovered = Tina.createTag();
export const Draggable = Tina.createTag();
export const IsBeingDragged = Tina.createComponent({
	start: ComponentTypes.CFrame
});