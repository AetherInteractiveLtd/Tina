/// <reference types="@rbxts/testez/globals" />

import { ComponentTypes } from "./component";
import { World } from "./world";

let world: World;

export = (): void => {
	beforeEach(() => {
		world = new World({});
	});

	describe("a component should", () => {
		it("be able to be created", () => {
			const component = world.defineComponent({
				x: 0,
			});

			expect(component).to.be.ok();
		});

		it("be able to be given to an entity", () => {
			const component = world.defineComponent({
				x: 0,
			});

			const entity = world.add();
			world.addComponent(entity, component);

			world.flush();

			expect(world.hasComponent(entity, component)).to.equal(true);
		});

		// TODO: We could potentially change the typing of defineComponent to be more strict to not allow {}
		it("should not be able to be created without any data", () => {
			expect(() => {
				world.defineComponent({});
			}).to.throw();
		});

		it("should be able to update its data", () => {
			const component = world.defineComponent({
				x: ComponentTypes.Number,
			});

			const entity = world.add();
			world.addComponent(entity, component);

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
