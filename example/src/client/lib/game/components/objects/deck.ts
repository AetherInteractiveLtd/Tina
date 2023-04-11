import Tina, { ComponentTypes } from "@rbxts/tina";

export const Deck = Tina.createComponent({
	maxSize: ComponentTypes.Number
});

Deck.defaults = {
	maxSize: 10
}