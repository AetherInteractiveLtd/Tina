import { RunService } from "@rbxts/services";
import Sift from "@rbxts/sift";
import { System, World } from "@rbxts/tina";
import {
	AnyComponent,
	Component,
	ComponentInternal,
	ComponentTypes,
	createComponent,
} from "@rbxts/tina/out/lib/ecs/component";
import { ALL, Query } from "@rbxts/tina/out/lib/ecs/query";

print("starting stress test!");

let startTime = os.clock();

const world = new World({});

const components = {};

// 300 components
for (const i of $range(1, 300)) {
	components[i as never] = createComponent({
		dummyData: ComponentTypes.number,
	}) as never;
}

// 50 archetypes
const archetypes = [];
for (const i of $range(0, 49)) {
	const archetype = {};

	for (const _ of $range(1, math.random(2, 30))) {
		const componentId = math.random(1, (components as Array<never>).size());
		(archetype as Array<never>).push(components[componentId as never] as never) as never;
	}

	archetypes[i] = archetype;
}

// 1000 entities
for (const _ of $range(0, 999)) {
	const id = world.add();

	const componentsToAdd = {};

	const archetypeId = math.random(1, archetypes.size());
	// eslint-disable-next-line roblox-ts/no-array-pairs
	for (const [_, component] of ipairs(archetypes[archetypeId] as Array<never>)) {
		(component as Component<{ dummyData: Array<number> }>).set(id, {
			dummyData: math.random(1, 5000),
		});

		(componentsToAdd[component] as never) = (component as ComponentInternal<{ dummyData: Array<number> }>)
			.dummyData[id] as never;
	}

	for (const [component, data] of pairs(componentsToAdd)) {
		world.addComponent(id, component as unknown as AnyComponent, {
			dummyData: data,
		});
	}
}

const contiguousComponents = Sift.Dictionary.values(components);

const systems: Array<System> = [];

// 200 Systems
for (const _ of $range(0, 199)) {
	class _System extends System {
		private query!: Query;

		public componentsToQuery: Array<ComponentInternal<{ dummyData: Array<number> }>> = [];

		public configureQueries(world: World): void {
			const numComponentsToQuery = math.random(1, 10);
			for (const _ of $range(0, numComponentsToQuery)) {
				this.componentsToQuery.push(
					contiguousComponents[math.random(1, contiguousComponents.size()) as never] as never,
				);
			}

			this.query = world.createQuery(ALL(...this.componentsToQuery));
		}

		public onUpdate(world: World): void {
			const firstComponent = this.componentsToQuery[0];

			this.query.forEach(entityId => {
				(firstComponent as Component<{ dummyData: Array<number> }>).set(entityId, {
					dummyData: firstComponent.dummyData[entityId] + 1,
				});
			});
		}
	}

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

// world.systemManager.scheduleSystems(systems);

const worldCreateTime = os.clock() - startTime;
let results = {};
startTime = os.clock();

// const queries = {};
// // eslint-disable-next-line roblox-ts/no-array-pairs
// for (const [_, componentsToQuery] of ipairs(systemComponentsToQuery as Array<Array<AnyComponent>>)) {
// 	const query = world.createQuery(ALL(...componentsToQuery));
// 	(queries as never)[componentsToQuery as never] = query as never;
// }

world.start();

RunService.Heartbeat.Connect(() => {
	let added = 0;
	let systemStartTime = os.clock();

	debug.profilebegin("systems");
	{
		// // eslint-disable-next-line roblox-ts/no-array-pairs
		// for (const [_, componentsToQuery] of ipairs(systemComponentsToQuery as Array<Array<AnyComponent>>)) {
		// 	debug.profilebegin("system");
		// 	{
		// 		const firstComponent = (
		// 			componentsToQuery as unknown as Array<{ dummyData: Array<number> }>
		// 		)[0] as ComponentInternal<{
		// 			dummyData: Array<number>;
		// 		}>;
		// 		(queries[componentsToQuery as never] as Query).forEach(entityId => {
		// 			(firstComponent as Component<{ dummyData: Array<number> }>).set(entityId, {
		// 				dummyData: firstComponent.dummyData[entityId] + 1,
		// 			});
		// 		});
		// 		added += 1;
		// 		world.flush();
		// 	}
		// 	debug.profileend();
		// }
		// world.

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
					added += 1;
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
	} else if ((results as Array<never>).size() < 1000) {
		(results as Array<never>).push((os.clock() - systemStartTime) as never) as never;
	} else {
		print("added", added);
		print("World created in", worldCreateTime * 1000, "ms");
		let sum = 0;
		for (const [_, result] of ipairs(results as Array<never>)) {
			sum += result;
		}

		print("Average frame time: %fms".format((sum / (results as Array<never>).size()) * 1000));

		results = undefined as never;

		// let n = 0;

		// world.entityManager.archetypes.forEach(() => {
		// 	n += 1;
		// });

		// for (const _ in pairs(world._entityArchetypeCache) do
		// 	n += 1
		// end

		print(
			"%d entities\n%d components\n%d systems\n%d archetypes".format(
				world.size(),
				(components as Array<never>).size(),
				systems.size(),
				world.entityManager.archetypes.size(),
			),
		);
	}
});
