import Tina, { ComponentTypes } from "@rbxts/tina";

export const WorldObject = Tina.createComponent({
	/** The numerical scale of the Object's Model */
	scale: ComponentTypes.Number,
	/** The physical representation of the Object */
	physical: ComponentTypes.Custom<Model>(),
	/** Whether or not the object is interactable at all (whether it's a system object) */
	interactable: ComponentTypes.Boolean,
	/** Whether or not the system is locked from current interaction */
	locked: ComponentTypes.Boolean,
	/** Keeps the time for this component. */
	tick: ComponentTypes.Number
});

WorldObject.defaults = {
	scale: 1,
	interactable: true,
	locked: false,
	tick: 0,
}