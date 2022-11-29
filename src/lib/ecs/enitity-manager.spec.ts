/// <reference types="@rbxts/testez/globals" />

import { World } from "./world";

let world: World;

export = (): void => {
	beforeEach(() => {
		world = new World({});
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
	});

	describe("A world with one entity should", () => {
		beforeEach(() => {
			world.add();
			world.flush();
		});

		it("have a size of 1", () => {
			expect(world.size()).to.equal(1);
		});

		it("have a size of 0 after an entity is destroyed", () => {
			world.remove(0);
			world.flush();
			expect(world.size()).to.equal(0);
		});
	});

	afterEach(() => {
		world.destroy();
	});
};
