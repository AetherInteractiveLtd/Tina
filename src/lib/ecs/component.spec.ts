/// <reference types="@rbxts/testez/globals" />

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

		// TODO: We could potentially change the typing of defineComponent to be more strict to not allow {}
		it("should not be able to be created without any data", () => {
			expect(() => {
				world.defineComponent({});
			}).to.throw();
		});
	});
};
