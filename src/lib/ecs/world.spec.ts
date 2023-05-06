/// <reference types="@rbxts/testez/globals" />

import { RunService } from "@rbxts/services";

import { ComponentInternalCreation, ComponentTypes } from "./component";
import { internal_resetGlobalState } from "./entity-manager";
import { World, WorldOptionsInternal } from "./world";

export = (): void => {
	/**
	 * These are more like integration tests than unit tests.
	 */
	describe("A world should", () => {
		it("clear component data after the completion of the next frame.", () => {
			internal_resetGlobalState();
			const world = new World({
				clearComponentData: true,
			} as WorldOptionsInternal);

			try {
				const component = ComponentInternalCreation.createComponent({
					x: ComponentTypes.Number,
				});

				void world.start();

				const id = world.add();
				world.addComponent(id, component, {
					x: 1,
				});
				world.flush();

				world.removeComponent(id, component);
				world.flush();

				expect(world.hasComponent(id, component)).to.equal(false);
				expect(component.x[id]).to.equal(1);
				// TODO: We probably want to inject a event instead of waiting for the next frame.
				RunService.PostSimulation.Wait();
				expect(component.x[id]).to.equal(1);
				RunService.PostSimulation.Wait();
				RunService.PostSimulation.Wait();
				expect(component.x[id]).to.equal(undefined);

				world.destroy();
			} catch (e) {
				world.destroy();
				throw e;
			}
		});
	});
};
