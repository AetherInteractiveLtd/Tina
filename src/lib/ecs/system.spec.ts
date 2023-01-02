/// <reference types="@rbxts/testez/globals" />

import { Query } from "./query";
import { System, SystemManager } from "./system";
import { World, WorldOptions } from "./world";

function shallowEquals<T extends defined>(a: Array<T>, b: Array<T>): boolean {
	return a.join() === b.join();
}

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
			system.priority = 0;
			system.onUpdate = (): void => {
				callCount += 1;
			};

			manager.scheduleSystem(system);
			manager.start(world);

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(1);
		});

		it("should be able to schedule multiple systems", () => {
			let callCount = 0;

			const system1 = {} as System;
			system1.priority = 0;
			system1.onUpdate = (): void => {
				callCount += 1;
			};

			const system2 = {} as System;
			system2.priority = 0;
			system2.onUpdate = (): void => {
				callCount += 1;
			};

			manager.scheduleSystems([system1, system2]);
			manager.start(world);

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(2);
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

		it("should call systems in correct priority order", () => {
			const systemOrder: Array<number> = [];

			const system1 = {} as System;
			system1.priority = 1;
			system1.onUpdate = (): void => {
				systemOrder.push(4);
			};

			const system2 = {} as System;
			system2.priority = 1000;
			system2.onUpdate = (): void => {
				systemOrder.push(1);
			};

			const system3 = {} as System;
			system3.priority = 25;
			system3.onUpdate = (): void => {
				systemOrder.push(3);
			};

			const system4 = {} as System;
			system4.priority = 100;
			system4.onUpdate = (): void => {
				systemOrder.push(2);
			};

			manager.scheduleSystems([system1, system2, system3, system4]);
			manager.start(world);

			expect(shallowEquals(systemOrder, [])).to.equal(true);

			bindableEvent.Fire();
			print(systemOrder);
			expect(shallowEquals(systemOrder, [1, 2, 3, 4])).to.equal(true);
		});

		it("should allow non-default execution groups", () => {
			const tempBindableEvent = new Instance("BindableEvent");

			let callCount = 0;

			const system = {} as System;
			system.priority = 0;
			system.executionGroup = tempBindableEvent.Event;
			system.onUpdate = (): void => {
				callCount += 1;
			};

			manager.scheduleSystem(system);
			manager.start(world);

			expect(callCount).to.equal(0);

			tempBindableEvent.Fire();
			expect(callCount).to.equal(1);
		});

		it("should be ordered by execution group", () => {
			const tempBindableEvent = new Instance("BindableEvent");
			const systemOrder: Array<number> = [];

			const system1 = {} as System;
			system1.priority = 1;
			system1.executionGroup = tempBindableEvent.Event;
			system1.onUpdate = (): void => {
				systemOrder.push(3);
			};

			const system2 = {} as System;
			system2.priority = 100;
			system2.executionGroup = tempBindableEvent.Event;
			system2.onUpdate = (): void => {
				systemOrder.push(1);
			};

			const system3 = {} as System;
			system3.priority = 5;
			system3.executionGroup = tempBindableEvent.Event;
			system3.onUpdate = (): void => {
				systemOrder.push(2);
			};

			const system4 = {} as System;
			system4.priority = 1;
			system4.onUpdate = (): void => {
				systemOrder.push(6);
			};

			const system5 = {} as System;
			system5.priority = 100;
			system5.onUpdate = (): void => {
				systemOrder.push(4);
			};

			const system6 = {} as System;
			system6.priority = 5;
			system6.onUpdate = (): void => {
				systemOrder.push(5);
			};

			manager.scheduleSystems([system1, system2, system3, system4, system5, system6]);
			manager.start(world);

			expect(shallowEquals(systemOrder, [])).to.equal(true);

			tempBindableEvent.Fire();
			bindableEvent.Fire();

			print(systemOrder);
			expect(shallowEquals(systemOrder, [1, 2, 3, 4, 5, 6])).to.equal(true);

			tempBindableEvent.Destroy();
		});
	});

	afterAll(() => {
		bindableEvent.Destroy();
	});
};
