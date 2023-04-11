import { Query, System, World } from "@rbxts/tina";
import { WorldObject } from "../components";
import { Draggable, Interactive, IsBeingDragged, IsHovered, Position } from "../components/global";
import { UserInputService, Workspace } from "@rbxts/services";
import { Deck } from "../components/objects/deck";

export class SYSHover extends System {
    private query!: Query;
	private currentlyHovered!: Query;

    configureQueries(world: World): void {
        this.query = world.createQuery(WorldObject, Interactive);
		this.currentlyHovered = world.createQuery(IsHovered);
    }

	wasDownLastTick = false;
	onUpdate(world: World): void {
		let mousePos = UserInputService.GetMouseLocation();
        const ray = Workspace.CurrentCamera!.ViewportPointToRay(mousePos.X, mousePos.Y);

		const interactableItems = this.query.items().map((entityId) => {
			let phys = WorldObject.physical[entityId];
			phys.GetDescendants().forEach(v => {
				if (v.IsA("BasePart")) {
					v.SetAttribute("ecsid", entityId);
				}
			});
			return phys;
		});

		const params = new RaycastParams();
		params.FilterType = Enum.RaycastFilterType.Include;
		params.FilterDescendantsInstances = interactableItems;

		print(interactableItems);

		const rayResult = Workspace.Raycast(ray.Origin, ray.Direction.mul(200), params);

		if (rayResult) {
			print("There was a result")

			let hoveredId = rayResult.Instance.GetAttribute("ecsid") as number;
			for (const entityId of this.currentlyHovered.iter()) {
				if (entityId !== hoveredId)	world.removeTag(entityId, IsHovered);
			}

			world.addTag(hoveredId, IsHovered);
			
			let isClicking = UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton1) && !this.wasDownLastTick;

			if (world.hasComponent(hoveredId, Deck) && isClicking) {
				createCard(world);
			} else if (
				world.hasTag(hoveredId, Draggable)
				&& UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton1)
				&& (UserInputService.IsKeyDown(Enum.KeyCode.LeftControl) ? true : isClicking)
			) {
				world.addComponent(hoveredId, IsBeingDragged, {
					start: new CFrame(rayResult.Position)
				});
			}
		} else {
			for (const entityId of this.currentlyHovered.iter()) {
				world.removeTag(entityId, IsHovered);
			}
		}
		this.wasDownLastTick = UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton1);
    }
}

export function createCard(world: World) {
	const Card = world.add();

	world.addComponent(Card, Position, {
		CFrame: new CFrame(0, 5, 0)
	});

	const cardModel = new Instance("Model");
	const card = new Instance("Part");
	card.Parent = cardModel;
	card.Size = new Vector3(5,0.3,7);
	card.Anchored = true;
	cardModel.PrimaryPart = card;

	world.addComponent(Card, WorldObject, {
		scale: 1,
		physical: cardModel,
		interactable: true,
		locked: false
	});

	world.addTag(Card, Interactive);
	world.addTag(Card, Draggable);

	return Card;
}
