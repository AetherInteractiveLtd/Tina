/// <reference types="@rbxts/testez/globals" />

import { Query } from "./query";
import { System, SystemManager } from "./system";
import { World, WorldOptions } from "./world";

const bindableEvent = new Instance("BindableEvent");

const world = {} as World;
(world.options as WorldOptions) = {};
world.options.defaultExecutionGroup = bindableEvent.Event;

let manager = {} as SystemManager;

export = (): void => {
	beforeEach(() => {
		manager = new SystemManager();
	});

	describe("A system should", () => {
		it("be able to be scheduled", () => {
			let callCount = 0;

			const system = {} as System;
			system.onUpdate = (): void => {
				callCount += 1;
			};

			manager.scheduleSystem(system);
			manager.start(world);

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(1);
		});

		it("should be able to configure queries", () => {
			const system = {} as System;
			let query;
			system.configureQueries = (world: World): void => {
				query = new Query(world).mask;
			};

			manager.scheduleSystem(system);
			manager.start(world);

			expect(query).to.be.ok();
		});
	});

	afterAll(() => {
		bindableEvent.Destroy();
	});
};
