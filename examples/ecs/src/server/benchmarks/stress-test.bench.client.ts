import { RunService } from "@rbxts/services";
import Sift from "@rbxts/sift";
import Tina, { System, World } from "@rbxts/tina";
import { Component, ComponentInternal, ComponentTypes } from "@rbxts/tina/out/lib/ecs/component";
import { ALL, Query } from "@rbxts/tina/out/lib/ecs/query";

print("starting stress test!");

let startTime = os.clock();

const world = Tina.createWorld({});

type BenchmarkComponent = Component<{ dummyData: Array<number> }>;
type BenchmarkComponentInternal = ComponentInternal<{ dummyData: Array<number> }>;

const components: Record<number, BenchmarkComponent> = {};

// 300 components
for (const i of $range(1, 300)) {
	components[i] = Tina.createComponent({
		dummyData: ComponentTypes.Number,
	});
}

// 50 usable archetypes
const archetypes: Array<Array<BenchmarkComponent>> = [];
for (const i of $range(0, 50)) {
	const archetype: Array<BenchmarkComponent> = [];

	for (const _ of $range(1, math.random(2, 30))) {
		const componentId = math.random(1, (components as Array<never>).size());
		archetype.push(components[componentId]);
	}

	archetypes[i] = archetype;
}

// 1000 entities
for (const _ of $range(1, 1000)) {
	const id = world.add();

	const archetypeId = math.random(0, archetypes.size() - 1);
	for (const component of archetypes[archetypeId]) {
		component.set(id, {
			dummyData: math.random(1, 5000),
		});

		world.addComponent(id, component);
	}
}

const contiguousComponents = Sift.Dictionary.values(components);

const systems: Array<System> = [];

let called = 0;

class _System extends System {
	private query!: Query;

	public componentsToQuery: Array<BenchmarkComponentInternal> = [];

	public configureQueries(world: World): void {
		const numComponentsToQuery = math.random(1, 10);
		for (const _ of $range(1, numComponentsToQuery)) {
			this.componentsToQuery.push(
				contiguousComponents[math.random(1, contiguousComponents.size() - 1)] as BenchmarkComponentInternal,
			);
		}

		this.query = world.createQuery(ALL(...this.componentsToQuery));
	}

	public onUpdate(world: World): void {
		const firstComponent = this.componentsToQuery[0];

		this.query.forEach(entityId => {
			called += 1;
			firstComponent.dummyData[entityId] = firstComponent.dummyData[entityId] + 1;

			// (firstComponent as BenchmarkComponent).set(entityId, {
			// 	dummyData: firstComponent.dummyData[entityId] + 1,
			// });
		});
	}
}

// 200 Systems
for (const _ of $range(0, 199)) {
	systems.push(new _System());
}

function setupSystem(system: System): void {
	if (!system.onUpdate) {
		error("System must have an onUpdate method");
	}

	if (system.configureQueries !== undefined) {
		system.configureQueries(world);
	}

	system.lastCalled = os.clock();
}

for (const system of systems) {
	setupSystem(system);
}

const worldCreateTime = os.clock() - startTime;
let results: Array<number> | undefined = [];
startTime = os.clock();

world.start().catch(err => {
	warn(err);
});

RunService.Heartbeat.Connect(() => {
	called = 0;
	const systemStartTime = os.clock();

	debug.profilebegin("systems");
	{
		for (const system of systems) {
			debug.profilebegin("system");
			{
				if (!system.enabled) {
					continue;
				}

				const systemName = system.name;

				system.dt = os.clock() - system.lastCalled;
				system.lastCalled = os.clock();

				debug.profilebegin("system: " + systemName);
				// system.onUpdate(this.world);

				const thread = coroutine.create(() => {
					system.onUpdate(world);
				});

				const [success, result] = coroutine.resume(thread);
				if (coroutine.status(thread) !== "dead") {
					coroutine.close(thread);
					task.spawn(error, `System ${systemName} yielded! Yielding in systems is not supported!`);
				}

				if (!success) {
					task.spawn(error, `System: ${systemName} errored! ${result} + \n ${debug.traceback}`);
				}
			}
			debug.profileend();
		}
	}
	debug.profileend();

	if (os.clock() - startTime < 4) {
		return;
	}

	if (results === undefined) {
		return;
	} else if (results.size() < 1000) {
		results.push(os.clock() - systemStartTime);
	} else {
		print("added", called);
		print("World created in", worldCreateTime * 1000, "ms");
		let sum = 0;
		for (const result of results) {
			sum += result;
		}

		print("Average frame time: %fms".format((sum / results.size()) * 1000));

		results = undefined;

		print(
			"%d entities\n%d components\n%d systems\n%d archetypes".format(
				world.size(),
				(components as Array<never>).size(),
				systems.size(),
				// (world.entityManager as EntityManager).archetypes.size(),
			),
		);
	}
});
