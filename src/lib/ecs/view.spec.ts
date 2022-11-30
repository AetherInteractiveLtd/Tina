/// <reference types="@rbxts/testez/globals" />

import { EntityId } from "../types/ecs";
import { ComponentArray } from "./component";
import { ALL, ANY } from "./view";
import { World } from "./world";

const components = [];

class MockComponent {
	/** @hidden */
	public _componentData = {
		world: {},
		id: undefined as number | undefined,
	};

	/** @hidden */
	public componentArray: ComponentArray = [];

	/** @hidden */
	public initialiseComponent(world: World, id: number, componentArray: ComponentArray): void {
		this._componentData.world = world;
		this._componentData.id = id;
		this.componentArray = componentArray;
	}

	public update(entityId: EntityId): void {}
}

export = (): void => {
	beforeEach(() => {
		for (let i = 0; i < 33; i++) {
			const component = new MockComponent();
			component.initialiseComponent({} as World, i, []);
			components.push(component);
		}
	});

	describe("A view should", () => {
		it("should throw if no arguments provided", () => {
			expect(() => {
				ALL();
			}).to.throw();

			expect(() => {
				ANY();
			}).to.throw();
		});
	});
};
