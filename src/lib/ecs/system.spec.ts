/// <reference types="@rbxts/testez/globals" />

import { ScriptContext } from "@rbxts/services";
import { Query } from "./query";
import { createEvent } from "./storage/event";
import { System, SystemManager } from "./system";
import { World, WorldOptions } from "./world";

function shallowEquals<T extends defined>(a: Array<T>, b: Array<T>): boolean {
	return a.join() === b.join();
}

const bindableEvent = new Instance("BindableEvent");

const world = {} as World;
(world.options as WorldOptions) = {};
world.options.defaultExecutionGroup = bindableEvent.Event;
world.flush = (): void => {};

let manager = {} as SystemManager;

/**
 * Normally these would be initialized by the abstract class, but as we are
 * using a mock here, we need to initialize them ourselves.
 */
function createSystem(): System {
	const system = {} as System;
	system.dt = 0;
	system.enabled = true;
	system.priority = 0;
	system.storage = [];
	system.onUpdate = (): void => {};
	return system;
}

export = (): void => {
	beforeEach(() => {
		manager = new SystemManager(world);
	});
	describe("A system should", () => {
		it("be able to be created using its constructor", () => {
			const system = new (class ASystemWithAName extends System {
				constructor() {
					super({
						priority: 1000,
					});
				}

				public onUpdate(): void {}
			})();

			expect(system).to.be.ok();
			expect(tostring(getmetatable(system))).to.equal("ASystemWithAName");
			expect(system.priority).to.equal(1000);
		});

		it("be able to be scheduled", () => {
			let callCount = 0;

			const system = createSystem();
			system.onUpdate = (): void => {
				callCount += 1;
			};

			void manager.scheduleSystem(system);
			void manager.start();

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(1);
		});

		it("be able to schedule multiple systems", () => {
			let callCount = 0;

			const system1 = createSystem();
			system1.onUpdate = (): void => {
				callCount += 1;
			};

			const system2 = createSystem();
			system2.onUpdate = (): void => {
				callCount += 1;
			};

			void manager.scheduleSystems([system1, system2]);
			void manager.start();

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(2);
		});

		it("be able to configure queries", () => {
			const system = createSystem();
			let query;
			system.configureQueries = (world: World): void => {
				query = new Query(world).mask;
			};
			system.onUpdate = (): void => {};

			void manager.scheduleSystem(system);
			void manager.start();

			expect(query).to.be.ok();
		});

		it("call systems in correct priority order", () => {
			const systemOrder: Array<number> = [];

			const system1 = createSystem();
			system1.priority = 1;
			system1.onUpdate = (): void => {
				systemOrder.push(4);
			};

			const system2 = createSystem();
			system2.priority = 1000;
			system2.onUpdate = (): void => {
				systemOrder.push(1);
			};

			const system3 = createSystem();
			system3.priority = 25;

			system3.onUpdate = (): void => {
				systemOrder.push(3);
			};

			const system4 = createSystem();
			system4.priority = 100;
			system4.onUpdate = (): void => {
				systemOrder.push(2);
			};

			void manager.scheduleSystems([system1, system2, system3, system4]);
			void manager.start();

			expect(shallowEquals(systemOrder, [])).to.equal(true);

			bindableEvent.Fire();
			expect(shallowEquals(systemOrder, [1, 2, 3, 4])).to.equal(true);
		});

		it("allow non-default execution groups", () => {
			const tempBindableEvent = new Instance("BindableEvent");

			let callCount = 0;

			const system = createSystem();
			system.executionGroup = tempBindableEvent.Event;
			system.onUpdate = (): void => {
				callCount += 1;
			};

			void manager.scheduleSystem(system);
			void manager.start();

			expect(callCount).to.equal(0);

			tempBindableEvent.Fire();
			expect(callCount).to.equal(1);
		});

		it("be able to stop all systems", () => {
			const tempBindableEvent = new Instance("BindableEvent");

			let callCount = 0;

			const system1 = createSystem();
			system1.onUpdate = (): void => {
				callCount += 1;
			};

			const system2 = createSystem();
			system2.onUpdate = (): void => {
				callCount += 10;
			};
			system2.executionGroup = tempBindableEvent.Event;

			void manager.scheduleSystems([system1, system2]);
			void manager.start();

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(1);

			tempBindableEvent.Fire();
			expect(callCount).to.equal(11);

			manager.stop();
			bindableEvent.Fire();
			tempBindableEvent.Fire();
			expect(callCount).to.equal(11);
		});

		it("be ordered by execution group", () => {
			const tempBindableEvent = new Instance("BindableEvent");
			const systemOrder: Array<number> = [];

			const event = tempBindableEvent.Event;

			const system1 = createSystem();
			system1.priority = 1;
			system1.executionGroup = event;
			system1.onUpdate = (): void => {
				systemOrder.push(3);
			};

			const system2 = createSystem();
			system2.priority = 100;

			system2.executionGroup = event;
			system2.onUpdate = (): void => {
				systemOrder.push(1);
			};

			const system3 = createSystem();
			system3.priority = 5;
			system3.executionGroup = event;
			system3.onUpdate = (): void => {
				systemOrder.push(2);
			};

			const system4 = createSystem();
			system4.priority = 1;
			system4.onUpdate = (): void => {
				systemOrder.push(6);
			};

			const system5 = createSystem();
			system5.priority = 5;
			system5.onUpdate = (): void => {
				systemOrder.push(5);
			};

			const system6 = createSystem();
			system6.priority = 100;
			system6.onUpdate = (): void => {
				systemOrder.push(4);
			};

			void manager.scheduleSystems([system1, system2, system3, system5, system6, system4]);
			void manager.start();

			expect(shallowEquals(systemOrder, [])).to.equal(true);

			tempBindableEvent.Fire();
			bindableEvent.Fire();

			expect(shallowEquals(systemOrder, [1, 2, 3, 4, 5, 6])).to.equal(true);

			tempBindableEvent.Destroy();
		});

		it("be able to call systems in order", () => {
			const systemOrder: Array<number> = [];

			const system1 = createSystem();
			system1.onUpdate = (): void => {
				systemOrder.push(3);
			};

			const system2 = createSystem();
			system2.after = [system1];

			system2.onUpdate = (): void => {
				systemOrder.push(2);
			};

			const system3 = createSystem();
			system3.after = [system2];
			system3.onUpdate = (): void => {
				systemOrder.push(1);
			};

			void manager.scheduleSystems([system2, system1, system3]);
			void manager.start();

			expect(shallowEquals(systemOrder, [])).to.equal(true);

			bindableEvent.Fire();

			expect(shallowEquals(systemOrder, [3, 2, 1])).to.equal(true);

			const systemOrder1: Array<number> = [];

			const system4 = createSystem();
			system4.onUpdate = (): void => {
				systemOrder1.push(3);
			};

			const system5 = createSystem();
			system5.after = [system4];
			system5.onUpdate = (): void => {
				systemOrder1.push(2);
			};

			const system6 = createSystem();
			system6.after = [system4, system5];
			system6.onUpdate = (): void => {
				systemOrder1.push(1);
			};

			manager = new SystemManager(world);
			void manager.scheduleSystems([system5, system4, system6]);
			void manager.start();

			expect(shallowEquals(systemOrder1, [])).to.equal(true);

			bindableEvent.Fire();

			expect(shallowEquals(systemOrder1, [3, 2, 1])).to.equal(true);
		});

		it("not allow systems to be scheduled after each other on different execution groups", async () => {
			const tempBindableEvent = new Instance("BindableEvent");

			const event = tempBindableEvent.Event;

			const system1 = createSystem();
			system1.priority = 1;
			system1.onUpdate = (): void => {};

			const system2 = createSystem();
			system2.executionGroup = event;
			system2.priority = 100;
			system2.after = [system1];
			system2.onUpdate = (): void => {};

			let errored = false;
			const promise = manager.scheduleSystems([system1, system2]).catch(() => {
				// do nothing
				errored = true;
			});

			await promise;

			expect(promise).to.be.ok();
			expect(errored).to.equal(true);

			tempBindableEvent.Destroy();
		});

		it("be able to disable and enable a system", () => {
			let callCount = 0;

			const system = createSystem();
			system.onUpdate = (): void => {
				callCount += 1;
			};

			void manager.scheduleSystems([system]);
			void manager.start();

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(1);

			manager.disableSystem(system);
			bindableEvent.Fire();
			expect(callCount).to.equal(1);

			manager.enableSystem(system);
			bindableEvent.Fire();
			expect(callCount).to.equal(2);
		});

		it("be able to unschedule a system", () => {
			let callCount = 0;

			const system = createSystem();
			system.onUpdate = (): void => {
				callCount += 1;
			};

			void manager.scheduleSystems([system]);
			void manager.start();

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(1);

			manager.unscheduleSystem(system);
			bindableEvent.Fire();
			expect(callCount).to.equal(1);
		});

		it("not allow yielding in a system", () => {
			let callCount = 0;

			const system = createSystem();
			system.onUpdate = (): void => {
				callCount += 1;
				task.wait();
				callCount += 1;
			};
			system.name = "YieldSystem";

			void manager.scheduleSystems([system]);

			void manager.start();
			bindableEvent.Fire();

			expect(callCount).to.equal(1);
		});

		it("should not be called more than once if a system is scheduled later", () => {
			let callCount = 0;

			const system = createSystem();
			system.onUpdate = (): void => {
				callCount += 1;
			};

			const system2 = createSystem();
			system2.onUpdate = (): void => {
				callCount += 1;
			};

			void manager.scheduleSystem(system);
			void manager.scheduleSystem(system2);

			void manager.start();

			bindableEvent.Fire();
			expect(callCount).to.equal(2);
		});

		it("be able to use storages", () => {
			const tempBindableEvent = new Instance("BindableEvent");
			const event = createEvent(tempBindableEvent.Event);

			const system = createSystem();
			system.storage.push(event);

			let callCount = 0;

			system.onUpdate = (): void => {
				for (const [,] of event.items()) {
					callCount += 1;
				}
			};

			void manager.scheduleSystems([system]);
			void manager.start();

			expect(callCount).to.equal(0);

			bindableEvent.Fire();

			expect(callCount).to.equal(0);

			tempBindableEvent.Fire();
			bindableEvent.Fire();

			expect(callCount).to.equal(1);

			manager.disableSystem(system);

			tempBindableEvent.Fire();
			bindableEvent.Fire();

			expect(callCount).to.equal(1);

			manager.enableSystem(system);

			tempBindableEvent.Fire();
			bindableEvent.Fire();

			expect(callCount).to.equal(2);

			manager.unscheduleSystem(system);

			tempBindableEvent.Fire();
			bindableEvent.Fire();

			expect(callCount).to.equal(2);

			tempBindableEvent.Destroy();
		});

		it("should not send multiple duplicate errors to the console", () => {
			const system = createSystem();
			system.onUpdate = (): void => {
				throw ("test");
			};
			system.name = "multipleErrorTest"

			manager.scheduleSystem(system);
			manager.start();

			let errorCount = 0;

			const connection = ScriptContext.Error.Connect(() => {
				errorCount += 1;
			});

			bindableEvent.Fire();
			bindableEvent.Fire();
			bindableEvent.Fire();

			expect(errorCount).to.equal(1);

			connection.Disconnect();
		});
	});

	afterEach(() => {
		manager.stop();
	});

	afterAll(() => {
		bindableEvent.Destroy();
	});
};
