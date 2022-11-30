/// <reference types="@rbxts/testez/globals" />

import { EntityId } from "../types/ecs";
import { Component, ComponentArray } from "./component";
import { ALL, ANY, View } from "./view";
import { World } from "./world";

const components = new Array<Component>(32);

const world = {} as World;

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
			component.initialiseComponent(world, i, []);
			components.push(component as unknown as Component);
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

		describe("match", () => {
			it("empty", () => {
				const view = new View({} as World).mask;
				for (let i = 0; i < 20; i++) {
					expect(View.match(new Array<number>(math.floor(math.random() * 1000)), view)).to.equal(true);
				}
			});

			it("ALL", () => {
				const view = new View(world, ALL(components[0], components[2], components[3])).mask;
				expect(View.match([13], view)).to.equal(true);
				expect(View.match([14], view)).to.equal(false);
				expect(View.match([15, 0], view)).to.equal(true);
				expect(View.match([16, 0], view)).to.equal(false);
			});
		});
	});
};
