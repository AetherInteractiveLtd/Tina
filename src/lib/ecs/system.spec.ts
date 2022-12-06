/// <reference types="@rbxts/testez/globals" />

import { defineSystem } from "./system";
import { World } from "./world";

let world: World;

export = (): void => {
	beforeEach(() => {
		world = new World({});
	});

	describe("A system should", () => {
		it("be able to be scheduled", () => {
			let x = 0;
			const system: () => void = defineSystem(() => {
				x += 1;
			});

			world.scheduleSystem(system);
			expect(x).to.equal(1);
		});
	});
};
