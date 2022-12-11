/// <reference types="@rbxts/testez/globals" />

import { ComponentTypes } from "./component";
import { UnimplementedWorld, World } from "./world";

let world: UnimplementedWorld;

export = (): void => {
	beforeEach(() => {
		world = new World(
			{},
			{
				x: ComponentTypes.Number,
			},
		);
	});

	describe("a component should", () => {
		it("be able to be given to an entity", () => {
			const entity = world.add();
			// world.addComponent(entity, component);

			world.flush();

			expect(world.hasComponent(entity, "x")).to.equal(true);
		});

		// TODO: We could potentially change the typing of defineComponent to be more strict to not allow {}

		it("should be able to update its data", () => {
			const entity = world.add();
			// world.addComponent(entity, component);

			world.flush();

			// component.update(entity, {
			// 	x: 1,
			// });

			// expect(world.getComponent(entity, component)).to.equal({
			// 	x: 1,
			// });
		});
	});
};
