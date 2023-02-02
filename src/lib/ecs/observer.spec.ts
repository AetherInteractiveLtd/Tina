/// <reference types="@rbxts/testez/globals" />

import { ComponentTypes, createComponent } from "./component";
import { ECS } from "./observer";
import { World } from "./world";

function shallowEquals<T extends defined>(a: Array<T>, b: Array<T>): boolean {
	return a.join() === b.join();
}

const world = new World({});

export = (): void => {
	beforeEach(() => {});

	describe("An observer should", () => {
		it("be called when an entity is added", () => {
			const calledFn: Array<number> = [];

			const component = createComponent({
				x: ComponentTypes.number,
			});

			const observer = world.createObserver(component).event(ECS.OnAdded);

			const id = world.add();
			world.addComponent(id, component);

			observer.forEach(_entityId => {
				calledFn.push(1);
			});

			world.flush();

			observer.forEach(_entityId => {
				calledFn.push(2);
			});

			expect(shallowEquals(calledFn, [2])).to.equal(true);

			observer.forEach(_entityId => {
				calledFn.push(3);
			});

			expect(shallowEquals(calledFn, [2])).to.equal(true);
		});

		it("be called when an entity is removed", () => {
			const calledFn: Array<number> = [];

			const component = createComponent({
				x: ComponentTypes.number,
			});

			const observer = world.createObserver(component).event(ECS.OnRemoved);

			const id = world.add();
			world.addComponent(id, component);

			world.flush();

			observer.forEach(_entityId => {
				calledFn.push(1);
			});

			world.removeComponent(id, component);

			observer.forEach(_entityId => {
				calledFn.push(2);
			});

			world.flush();

			observer.forEach(_entityId => {
				calledFn.push(3);
			});

			expect(shallowEquals(calledFn, [3])).to.equal(true);

			observer.forEach(_entityId => {
				calledFn.push(4);
			});

			expect(shallowEquals(calledFn, [3])).to.equal(true);
		});

		it("also have a required component", () => {
			let callCount = 0;

			const component = createComponent({
				x: ComponentTypes.number,
			});

			const component2 = createComponent({
				y: ComponentTypes.number,
			});

			const observer = world.createObserver(component).with(component2).event(ECS.OnAdded);

			const id = world.add();
			const id2 = world.add();
			world.addComponent(id, component);
			world.addComponent(id2, component);
			world.addComponent(id2, component2);

			world.flush();

			observer.forEach(_entityId => {
				callCount += 1;
			});

			expect(callCount).to.equal(1);
		});

		it("should be called when a components data is changed", () => {
			const calledFn: Array<number> = [];

			const component = createComponent({
				x: ComponentTypes.number,
			});

			const observer = world.createObserver(component).event(ECS.OnSet);

			const id = world.add();
			world.addComponent(id, component);

			world.flush();

			observer.forEach(_entityId => {
				calledFn.push(1);
			});

			component.set(id, { x: 1 });

			observer.forEach(_entityId => {
				calledFn.push(2);
			});

			expect(shallowEquals(calledFn, [])).to.equal(true);

			world.flush();

			observer.forEach(_entityId => {
				calledFn.push(3);
			});

			expect(shallowEquals(calledFn, [3])).to.equal(true);
		});
	});
};
