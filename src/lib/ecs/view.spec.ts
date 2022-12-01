/// <reference types="@rbxts/testez/globals" />

import { EntityId } from "../types/ecs";
import { Component, ComponentArray } from "./component";
import { ALL, ANY, NOT, View } from "./view";
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

			it("NOT", () => {
				const view = new View(world, NOT(components[1])).mask;
				expect(View.match([0], view)).to.equal(true);
				expect(View.match([5], view)).to.equal(true);
				expect(View.match([7], view)).to.equal(false);
				expect(View.match([13, 4], view)).to.equal(true);
				expect(View.match([15, 0], view)).to.equal(false);
			});

			it("ANY", () => {
				const view = new View(world, ANY(components[0], components[2], components[5])).mask;
				expect(View.match([0], view)).to.equal(false);
				expect(View.match([10], view)).to.equal(false);
				expect(View.match([13], view)).to.equal(true);
				expect(View.match([15, 5], view)).to.equal(true);
				expect(View.match([16, 0], view)).to.equal(false);
			});

			// TODO: Move away from 32 bit operators since lua doesn't support them
			it("more than 32 components", () => {
				const view = new View(world, ALL(components[0], components[32])).mask;
				expect(View.match([1, 1], view)).to.equal(true);
				expect(View.match([1, 2, 1], view)).to.equal(false);
				expect(View.match([3, 3, 0], view)).to.equal(true);
				// expect(View.match([1], view)).to.equal(false);
				expect(View.match([0, 1], view)).to.equal(false);
			});

			it("complex query #1", () => {
				const view = new View(world, ALL(components[1], ANY(components[2], NOT(components[0])))).mask;
				expect(View.match([2], view)).to.equal(true);
				expect(View.match([3], view)).to.equal(false);
				expect(View.match([5, 0], view)).to.equal(false);
				expect(View.match([6, 1], view)).to.equal(true);
				expect(View.match([7, 43], view)).to.equal(true);
			});

			it("complex query #2", () => {
				const view = new View(world, ALL(NOT(ANY(components[0], components[1])), components[3])).mask;
				expect(View.match([1], view)).to.equal(false);
				expect(View.match([8], view)).to.equal(true);
				expect(View.match([9, 0], view)).to.equal(false);
				expect(View.match([10, 10], view)).to.equal(false);
				expect(View.match([12, 2], view)).to.equal(true);
			});

			it("complex query #3", () => {
				const view = new View(
					world,
					ALL(ANY(components[0], components[3]), ANY(components[2], NOT(components[4]))),
				).mask;
				expect(View.match([1], view)).to.equal(true);
				expect(View.match([2], view)).to.equal(false);
				expect(View.match([8, 0], view)).to.equal(true);
				expect(View.match([17, 1], view)).to.equal(false);
				expect(View.match([21, 9], view)).to.equal(true);
				expect(View.match([29, 16], view)).to.equal(true);
			});
		});
	});
};
