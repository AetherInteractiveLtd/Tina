import { Query, System, World } from "@rbxts/tina";
import { WorldObject } from "../components";
import { Draggable, Interactive, IsBeingDragged, Position } from "../components/global";
import { UserInputService, Workspace } from "@rbxts/services";
import { CardPlacementRegion, Region } from "../components/objects/region";

export class SYSDrag extends System {
    private query!: Query;
	private interactiveQuery!: Query;
	private regionsQuery!: Query;
	
    configureQueries(world: World): void {
        this.query = world.createQuery(WorldObject, Interactive, Draggable, IsBeingDragged);
		this.interactiveQuery = world.createQuery(WorldObject, Interactive);
		this.regionsQuery = world.createQuery(CardPlacementRegion, Region, Position);
    }

    onUpdate(world: World): void {
		for (const entityId of this.query.enteredQuery()) {
			WorldObject.physical[entityId].FindFirstChild("hlobj")?.Destroy();
			// add the highlight
			const highlight = new Instance("Highlight");
			highlight.Parent = WorldObject.physical[entityId];
			highlight.Name = "hlobj";
			highlight.Adornee = WorldObject.physical[entityId];
		}

        for (const entityId of this.query.iter()) {
			if (!UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton1)) {
				world.removeComponent(entityId, IsBeingDragged);
				continue;
			}

			let mousePos = UserInputService.GetMouseLocation();
			const ray = Workspace.CurrentCamera!.ViewportPointToRay(mousePos.X, mousePos.Y);

			const interactableItems = this.interactiveQuery.items().map((entityId) => WorldObject.physical[entityId]);
	
			const params = new RaycastParams();
			params.FilterType = Enum.RaycastFilterType.Exclude;
			params.FilterDescendantsInstances = interactableItems;
	
			print(interactableItems);
	
			const rayResult = Workspace.Raycast(ray.Origin, ray.Direction.mul(200), params);
			if (rayResult) {
				let wasInRegion = false;
				for (const regionId of this.regionsQuery.iter()) {
					print("Checking region");
					let center = Position.CFrame[regionId].Position;

					let lower = center.sub(Region.range[regionId].mul(0.5));
					let higher = lower.add(Region.range[regionId]);

					print(lower.X, "<", rayResult.Position.X, "<", higher.X);
					print(lower.Z, "<", rayResult.Position.Z, "<", higher.Z);

					if (
						rayResult.Position.X > lower.X && rayResult.Position.X < higher.X
						&& rayResult.Position.Z > lower.Z && rayResult.Position.Z < higher.Z
					) {
						print("Was in region.")
						Position.CFrame[entityId] = Position.CFrame[regionId];
						wasInRegion = true;
						continue;
					}
				}
				if (!wasInRegion)
					Position.CFrame[entityId] = new CFrame(rayResult.Position);
			} else {
				Position.CFrame[entityId] = new CFrame(ray.Origin.add(ray.Direction.mul(200)));
			}
		} 

		for (const entityId of this.query.exitedQuery()) {
            WorldObject.physical[entityId].FindFirstChild("hlobj")?.Destroy();
		}
    }
}