/// <reference types="@rbxts/testez/globals" />

import { ScriptContext } from "@rbxts/services";

import { Query } from "./query";
import { bindEvent } from "./storage/event";
import { StorageObject, System, SystemManager } from "./system";
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

class MockSystem extends System {
	public dt = 0;
	public enabled = true;
	public priority = 0;
	public storage: Array<StorageObject> = [];

	public onUpdate(): void {}
}

class MockSystem1 extends MockSystem {}
class MockSystem2 extends MockSystem {}
class MockSystem3 extends MockSystem {}
class MockSystem4 extends MockSystem {}
class MockSystem5 extends MockSystem {}

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
			expect(system.priority).to.equal(1000);
		});

		it("be able to be scheduled", () => {
			let callCount = 0;

			const system = new MockSystem();
			system.onUpdate = (): void => {
				callCount += 1;
			};

			void manager.scheduleSystem(system as System);
			void manager.start();

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(1);
		});

		it("be able to schedule multiple systems", () => {
			let callCount = 0;

			const system1 = new MockSystem();
			system1.onUpdate = (): void => {
				callCount += 1;
			};

			const system2 = new MockSystem1();
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
			const system = new MockSystem();
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

			const system1 = new MockSystem();
			system1.priority = 1;
			system1.onUpdate = (): void => {
				systemOrder.push(4);
			};

			const system2 = new MockSystem1();
			system2.priority = 1000;
			system2.onUpdate = (): void => {
				systemOrder.push(1);
			};

			const system3 = new MockSystem2();
			system3.priority = 25;

			system3.onUpdate = (): void => {
				systemOrder.push(3);
			};

			const system4 = new MockSystem3();
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

		it("have its explicit dependencies used over its priority order", () => {
			const systemOrder: Array<number> = [];

			const system1 = new MockSystem();
			system1.priority = math.huge;
			system1.onUpdate = (): void => {
				systemOrder.push(2);
			};

			const system2 = new MockSystem1();
			system2.priority = -math.huge;
			system2.before = [MockSystem];
			system2.onUpdate = (): void => {
				systemOrder.push(1);
			};

			const system3 = new MockSystem2();
			system3.priority = -math.huge;
			system3.onUpdate = (): void => {
				systemOrder.push(4);
			};

			const system4 = new MockSystem3();
			system4.priority = 0;
			system4.after = [MockSystem1];
			system4.onUpdate = (): void => {
				systemOrder.push(3);
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

			const system = new MockSystem();
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

			const system1 = new MockSystem();
			system1.onUpdate = (): void => {
				callCount += 1;
			};

			const system2 = new MockSystem1();
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

			const system1 = new MockSystem();
			system1.priority = 1;
			system1.executionGroup = event;
			system1.onUpdate = (): void => {
				systemOrder.push(3);
			};

			const system2 = new MockSystem1();
			system2.priority = 100;

			system2.executionGroup = event;
			system2.onUpdate = (): void => {
				systemOrder.push(1);
			};

			const system3 = new MockSystem2();
			system3.priority = 5;
			system3.executionGroup = event;
			system3.onUpdate = (): void => {
				systemOrder.push(2);
			};

			const system4 = new MockSystem3();
			system4.priority = 1;
			system4.onUpdate = (): void => {
				systemOrder.push(6);
			};

			const system5 = new MockSystem4();
			system5.priority = 5;
			system5.onUpdate = (): void => {
				systemOrder.push(5);
			};

			const system6 = new MockSystem5();
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

		it("be able to call after systems in order", () => {
			let systemOrder: Array<number> = [];

			const system1 = new MockSystem();
			system1.onUpdate = (): void => {
				systemOrder.push(3);
			};

			const system2 = new MockSystem1();
			system2.after = [MockSystem];

			system2.onUpdate = (): void => {
				systemOrder.push(2);
			};

			const system3 = new MockSystem2();
			system3.after = [MockSystem1];
			system3.onUpdate = (): void => {
				systemOrder.push(1);
			};

			const order1 = [system1, system2, system3];
			const order2 = [system3, system2, system1];
			const order3 = [system2, system3, system1];
			const order4 = [system1, system3, system2];
			const order5 = [system3, system1, system2];
			const order6 = [system2, system1, system3];

			for (const systems of [order1, order2, order3, order4, order5, order6]) {
				systemOrder = [];
				manager = new SystemManager(world);
				void manager.scheduleSystems(systems);
				void manager.start();

				expect(shallowEquals(systemOrder, [])).to.equal(true);

				bindableEvent.Fire();

				expect(shallowEquals(systemOrder, [3, 2, 1])).to.equal(true);
				manager.stop();
			}

			let systemOrder1: Array<number> = [];

			const system4 = new MockSystem3();
			system4.onUpdate = (): void => {
				systemOrder1.push(3);
			};

			const system5 = new MockSystem4();
			system5.after = [MockSystem3];
			system5.onUpdate = (): void => {
				systemOrder1.push(2);
			};

			const system6 = new MockSystem5();
			system6.after = [MockSystem3, MockSystem4];
			system6.onUpdate = (): void => {
				systemOrder1.push(1);
			};

			const otherOrder1 = [system4, system5, system6];
			const otherOrder2 = [system6, system5, system4];
			const otherOrder3 = [system5, system6, system4];
			const otherOrder4 = [system4, system6, system5];
			const otherOrder5 = [system6, system4, system5];
			const otherOrder6 = [system5, system4, system6];

			for (const systems of [
				otherOrder1,
				otherOrder2,
				otherOrder3,
				otherOrder4,
				otherOrder5,
				otherOrder6,
			]) {
				systemOrder1 = [];

				manager = new SystemManager(world);
				void manager.scheduleSystems(systems);
				void manager.start();

				expect(shallowEquals(systemOrder1, [])).to.equal(true);

				bindableEvent.Fire();

				expect(shallowEquals(systemOrder1, [3, 2, 1])).to.equal(true);
				manager.stop();
			}
		});

		it("be able to call before systems in order", () => {
			let systemOrder: Array<number> = [];

			const system1 = new MockSystem();
			system1.onUpdate = (): void => {
				systemOrder.push(3);
			};

			const system2 = new MockSystem1();
			system2.before = [MockSystem];

			system2.onUpdate = (): void => {
				systemOrder.push(2);
			};

			const system3 = new MockSystem2();
			system3.before = [MockSystem1];
			system3.onUpdate = (): void => {
				systemOrder.push(1);
			};

			const order1 = [system1, system2, system3];
			const order2 = [system3, system2, system1];
			const order3 = [system2, system3, system1];
			const order4 = [system1, system3, system2];
			const order5 = [system3, system1, system2];
			const order6 = [system2, system1, system3];

			for (const systems of [order1, order2, order3, order4, order5, order6]) {
				systemOrder = [];
				manager = new SystemManager(world);
				void manager.scheduleSystems(systems);
				void manager.start();

				expect(shallowEquals(systemOrder, [])).to.equal(true);

				bindableEvent.Fire();

				expect(shallowEquals(systemOrder, [1, 2, 3])).to.equal(true);
				manager.stop();
			}

			let systemOrder1: Array<number> = [];

			const system4 = new MockSystem3();
			system4.onUpdate = (): void => {
				systemOrder1.push(3);
			};

			const system5 = new MockSystem4();
			system5.before = [MockSystem3];
			system5.onUpdate = (): void => {
				systemOrder1.push(2);
			};

			const system6 = new MockSystem5();
			system6.before = [MockSystem3, MockSystem4];
			system6.onUpdate = (): void => {
				systemOrder1.push(1);
			};

			const otherOrder1 = [system4, system5, system6];
			const otherOrder2 = [system6, system5, system4];
			const otherOrder3 = [system5, system6, system4];
			const otherOrder4 = [system4, system6, system5];
			const otherOrder5 = [system6, system4, system5];
			const otherOrder6 = [system5, system4, system6];

			for (const systems of [
				otherOrder1,
				otherOrder2,
				otherOrder3,
				otherOrder4,
				otherOrder5,
				otherOrder6,
			]) {
				systemOrder1 = [];

				manager = new SystemManager(world);
				void manager.scheduleSystems(systems);
				void manager.start();

				expect(shallowEquals(systemOrder1, [])).to.equal(true);

				bindableEvent.Fire();

				expect(shallowEquals(systemOrder1, [1, 2, 3])).to.equal(true);
				manager.stop();
			}
		});

		it("not allow cyclic dependencies", () => {
			const system1 = new MockSystem();
			system1.after = [MockSystem];
			system1.onUpdate = (): void => {};

			let errored = false;
			const promise = manager.scheduleSystems([system1]).catch(() => {
				errored = true;
			});

			promise.await();

			expect(promise).to.be.ok();
			expect(errored).to.equal(true);
			manager.stop();

			const system2 = new MockSystem1();
			system2.before = [MockSystem2];
			system2.onUpdate = (): void => {};

			const system3 = new MockSystem2();
			system3.before = [MockSystem1];
			system3.onUpdate = (): void => {};

			let errored1 = false;
			const promise1 = manager.scheduleSystems([system2, system3]).catch(() => {
				errored1 = true;
			});

			promise1.await();

			expect(promise1).to.be.ok();
			expect(errored1).to.equal(true);
			manager.stop();

			const system4 = new MockSystem3();
			system4.before = [MockSystem4];
			system4.onUpdate = (): void => {};

			const system5 = new MockSystem4();
			system5.before = [MockSystem5];
			system5.onUpdate = (): void => {};

			const system6 = new MockSystem5();
			system6.before = [MockSystem3];
			system6.onUpdate = (): void => {};

			let errored2 = false;
			const promise2 = manager.scheduleSystems([system4, system5, system6]).catch(() => {
				errored2 = true;
			});

			promise2.await();

			expect(promise2).to.be.ok();
			expect(errored2).to.equal(true);
			manager.stop();
		});

		it("not allow systems to be scheduled after each other on different execution groups", () => {
			const tempBindableEvent = new Instance("BindableEvent");

			const event = tempBindableEvent.Event;

			const system1 = new MockSystem();
			system1.priority = 1;
			system1.onUpdate = (): void => {};

			const system2 = new MockSystem1();
			system2.executionGroup = event;
			system2.priority = 100;
			system2.after = [MockSystem];
			system2.onUpdate = (): void => {};

			let errored = false;
			const promise = manager.scheduleSystems([system1, system2]).catch(() => {
				errored = true;
			});

			promise.await();

			expect(promise).to.be.ok();
			expect(errored).to.equal(true);

			tempBindableEvent.Destroy();
		});

		it("be able to disable and enable a system", () => {
			let callCount = 0;

			const system = new MockSystem();
			system.onUpdate = (): void => {
				callCount += 1;
			};

			void manager.scheduleSystems([system]);
			void manager.start();

			expect(callCount).to.equal(0);

			bindableEvent.Fire();
			expect(callCount).to.equal(1);

			manager.disableSystem(MockSystem);
			bindableEvent.Fire();
			expect(callCount).to.equal(1);

			manager.enableSystem(MockSystem);
			bindableEvent.Fire();
			expect(callCount).to.equal(2);
		});

		it("be able to unschedule a system", () => {
			let callCount = 0;

			const system = new MockSystem();
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

			const system = new MockSystem();
			system.onUpdate = (): void => {
				callCount += 1;
				task.wait();
				callCount += 1;
			};

			void manager.scheduleSystems([system]);

			void manager.start();
			bindableEvent.Fire();

			expect(callCount).to.equal(1);
		});

		it("should not be called more than once if a system is scheduled later", () => {
			let callCount = 0;

			const system = new MockSystem();
			system.onUpdate = (): void => {
				callCount += 1;
			};

			const system2 = new MockSystem1();
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
			const event = bindEvent(tempBindableEvent.Event);

			const system = new MockSystem();
			system.storage.push(event);

			let callCount = 0;

			system.onUpdate = (): void => {
				for (const [,] of event.iter()) {
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

			manager.disableSystem(MockSystem);

			tempBindableEvent.Fire();
			bindableEvent.Fire();

			expect(callCount).to.equal(1);

			manager.enableSystem(MockSystem);

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
			const system = new MockSystem();
			system.onUpdate = (): void => {
				throw "test";
			};

			void manager.scheduleSystem(system);
			void manager.start();

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
