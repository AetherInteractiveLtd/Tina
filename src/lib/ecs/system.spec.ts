/// <reference types="@rbxts/testez/globals" />

import { System } from "./system";
import { World } from "./world";

const bindableEvent = new Instance("BindableEvent");

let world = {} as World;

export = (): void => {
	beforeEach(() => {
		world = new World({
			defaultExecutionGroup: bindableEvent.Event,
		});
	});

	describe("A system should", () => {
		it("be able to be scheduled", () => {
			let callCount = 0;

			const system = {} as System;
			system.onUpdate = (): void => {
				callCount += 1;
			};

			world.scheduleSystem(system);
			world.start();

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(1);
		});
	});

	afterEach(() => {
		bindableEvent.Destroy();
	});
};
