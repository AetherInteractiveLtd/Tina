/// <reference types="@rbxts/testez/globals" />

import { ComponentTypes, createComponent } from "./component";
import { ECS } from "./observer";
import { World, WorldOptions } from "./world";

const bindableEvent = new Instance("BindableEvent");

const world = new World({});

export = (): void => {
	beforeEach(() => {});

	describe("An observer should", () => {
		it("be called when an entity is added", () => {
			let callCount = 0;

			const component = createComponent({
				x: ComponentTypes.number,
			});

			const observer = world.createObserver(component).event(ECS.OnAdded);

			const id = world.add();
			world.addComponent(id, component);

			world.flush();

			observer.forEach(_entityId => {
				callCount += 1;
			});

			expect(callCount).to.equal(1);
		});
	});
};
