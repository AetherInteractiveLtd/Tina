/// <reference types="@rbxts/testez/globals" />

import { ComponentTypes, createComponent } from "./component";
import { ECS } from "./observer";
import { World } from "./world";

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

			observer.forEach(_entityId => {
				callCount += 1;
			});

			world.flush();

			observer.forEach(_entityId => {
				callCount += 1;
			});

			expect(callCount).to.equal(1);

			observer.forEach(_entityId => {
				callCount += 1;
			});

			expect(callCount).to.equal(1);
		});

		it("be called when an entity is removed", () => {
			let callCount = 0;

			const component = createComponent({
				x: ComponentTypes.number,
			});

			const observer = world.createObserver(component).event(ECS.OnRemoved);

			const id = world.add();
			world.addComponent(id, component);

			world.flush();

			observer.forEach(_entityId => {
				callCount += 1;
			});

			world.removeComponent(id, component);

			observer.forEach(_entityId => {
				callCount += 1;
			});

			world.flush();

			observer.forEach(_entityId => {
				callCount += 1;
			});

			expect(callCount).to.equal(1);

			observer.forEach(_entityId => {
				callCount += 1;
			});

			expect(callCount).to.equal(1);
		});
	});
};
