/// <reference types="@rbxts/testez/globals" />

import { internal_resetGlobalState } from "./entity-manager";
import { World } from "./world";

let world: World;

export = (): void => {
	beforeEach(() => {
		internal_resetGlobalState();
		world = new (World as any)() as World;
	});

	describe("An entity should", () => {
		it("be created", () => {
			const entityId = world.add();
			expect(entityId).to.be.ok();
		});

		it("be destroyed", () => {
			const entityId = world.add();
			world.remove(entityId);
			world.flush();
			expect(world.has(entityId)).to.equal(false);
		});

		// allocate and reuse ids
		it("reuse ids", () => {
			const entityId = world.add(); // 0
			world.add(); // 1
			world.add(); // 2
			world.flush();
			world.remove(entityId);
			world.flush();
			const entityId2 = world.add();
			expect(entityId).to.equal(entityId2);
		});

		it("be able to check if it's alive", () => {
			const entityId = world.add();
			expect(world.has(entityId)).to.equal(true);
			world.remove(entityId);
			world.flush();
			expect(world.has(entityId)).to.equal(false);
		});
	});

	describe("A world with one entity should", () => {
		let id: number;
		beforeEach(() => {
			id = world.add();
			world.flush();
		});

		it("have a size of 1", () => {
			expect(world.size()).to.equal(1);
		});

		it("have a size of 0 after an entity is destroyed", () => {
			world.remove(id);
			world.flush();
			expect(world.size()).to.equal(0);
		});
	});

	afterEach(() => {
		world.destroy();
	});
};
