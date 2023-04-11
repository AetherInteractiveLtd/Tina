import { RunService } from "@rbxts/services";
import Tina, { World } from "@rbxts/tina";

import './components';
import { SYSPosition } from "./systems/position";
import { Position, WorldObject } from "./components";
import { Vibrating } from "./components/misc";
import { SYSVibrate } from "./systems/vibrate";
import { SYSHover } from "./systems/hovered";
import { Draggable, Interactive } from "./components/global";
import { SYSDrag } from "./systems/draggable";
import { Deck } from "./components/objects/deck";
import { CardPlacementRegion, Region } from "./components/objects/region";

const world = Tina.createWorld({
	defaultExecutionGroup: RunService.PostSimulation,
	name: "E"
});

world.scheduleSystems(new SYSPosition(), new SYSVibrate(), new SYSHover(), new SYSDrag());

world.start();

wait(1);

export function createDeck() {
	const DeckObj = world.add();

	world.addComponent(DeckObj, Position, {
		CFrame: new CFrame(10, 5, 0)
	});

	const deckModel = new Instance("Model");
	const deck = new Instance("Part");
	deck.Parent = deckModel;
	deck.Size = new Vector3(5,0.3,7);
	deck.Anchored = true;
	deckModel.PrimaryPart = deck;

	world.addComponent(DeckObj, WorldObject, {
		scale: 1,
		physical: deckModel,
		interactable: true,
		locked: false
	});

	world.addTag(DeckObj, Interactive);
	world.addComponent(DeckObj, Deck, {
		maxSize: 10
	});

	return DeckObj;
}

createDeck();

export function createRegionForCards() {
	const CardRegion = world.add();

	world.addComponent(CardRegion, Position, {
		CFrame: new CFrame(20, 5, 0)
	})
	world.addComponent(CardRegion, Region, {
		range: new Vector3(5, 0, 10)
	})
	world.addTag(CardRegion, CardPlacementRegion);

	return CardRegion;
}


createRegionForCards();