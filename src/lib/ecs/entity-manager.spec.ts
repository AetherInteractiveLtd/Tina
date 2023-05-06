/// <reference types="@rbxts/testez/globals" />

import { internal_resetGlobalState } from "./entity-manager";
import { SystemManager } from "./system";
import { World, WorldOptionsInternal } from "./world";

let world: World;

export = (): void => {
	beforeEach(() => {
		internal_resetGlobalState();
		world = new World({
			clearComponentData: false,
		} as WorldOptionsInternal);
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
			(
				(world as unknown as { scheduler: SystemManager }).scheduler as unknown as {
					clearPendingComponentData(): void;
				}
			).clearPendingComponentData();
			const entityId2 = world.add();
			expect(entityId).to.never.equal(entityId2);
			(
				(world as unknown as { scheduler: SystemManager }).scheduler as unknown as {
					clearPendingComponentData(): void;
				}
			).clearPendingComponentData();
			const entityId3 = world.add();
			expect(entityId).to.equal(entityId3);
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
