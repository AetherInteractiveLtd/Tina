/// <reference types="@rbxts/testez/globals" />

import { World } from "./world";

let world: World;

const bindableEvent = new Instance("BindableEvent");

export = (): void => {
	beforeEach(() => {
		world = new World({});
	});

	describe("A system should", () => {
		it("be able to be scheduled", () => {
			let callCount = 0;
			const system = (): void => {
				callCount += 1;
			};

			world.scheduleSystem(system);
			// world.start( { default = bindableEvent.Event } );
			expect(callCount).to.equal(0);
		});
	});

	afterEach(() => {
		bindableEvent.Destroy();
	});
};
