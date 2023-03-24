/// <reference types="@rbxts/testez/globals" />

import {
	ComponentInternal,
	ComponentInternalCreation,
	ComponentTypes,
	TagComponentInternal,
} from "./component";
import { internal_resetGlobalState } from "./entity-manager";
import { World } from "./world";

let world: World;

export = (): void => {
	beforeEach(() => {
		internal_resetGlobalState();
		world = new (World as any)() as World;
	});

	describe("a component should", () => {
		it("be able to be created", () => {
			const component = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
			});
			expect(component).to.be.ok();
		});

		it("be able to be given to an entity", () => {
			const component = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
			});
			const entity = world.add();
			world.addComponent(entity, component);
			world.flush();
			expect(world.hasComponent(entity, component)).to.equal(true);
		});

		it("be able to be removed from an entity", () => {
			const component = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
			});
			const entity = world.add();
			world.addComponent(entity, component);
			world.flush();
			world.removeComponent(entity, component);
			world.flush();
			expect(world.hasComponent(entity, component)).to.equal(false);
		});

		it("be able to update its data", () => {
			const component = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
			});
			const entity = world.add();
			world.addComponent(entity, component);
			world.flush();
			component.set(entity, {
				x: 1,
			});
			expect((component as ComponentInternal<{ x: Array<number> }>).x[entity]).to.equal(1);

			const component2 = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
			});
			const entity2 = world.add();
			world.addComponent(entity2, component2, {
				x: 2,
			});
			world.flush();
			expect((component2 as ComponentInternal<{ x: Array<number> }>).x[entity2]).to.equal(2);
		});

		it("be able to hold a single value", () => {
			const component = ComponentInternalCreation.createComponent(ComponentTypes.Number);
			const entity = world.add();
			world.addComponent(entity, component);
			component[entity] = 1;
			world.flush();
			expect((component as ComponentInternal<Array<number>>)[entity]).to.equal(1);

			component[entity] = 2;
			expect((component as ComponentInternal<Array<number>>)[entity]).to.equal(2);

		});
	});

	describe("a tag should", () => {
		it("be able to be created", () => {
			const tag = ComponentInternalCreation.createTag();
			expect(tag).to.be.ok();
		});

		it("be able to be given to an entity", () => {
			const tag = ComponentInternalCreation.createTag();
			const entity = world.add();
			world.addTag(entity, tag);
			world.flush();
			expect(world.hasTag(entity, tag)).to.equal(true);
		});

		it("be able to be removed from an entity", () => {
			const tag = ComponentInternalCreation.createTag();
			const entity = world.add();
			world.addTag(entity, tag);
			world.flush();
			world.removeTag(entity, tag);
			world.flush();
			expect(world.hasTag(entity, tag)).to.equal(false);
		});

		it("not hold any data", () => {
			const tag = ComponentInternalCreation.createTag() as TagComponentInternal;
			const entity = world.add();
			world.addTag(entity, tag);
			world.flush();

			for (const [key] of pairs(tag)) {
				expect(tag[key]).to.equal(tag.componentId);
			}
		});
	});

	describe("a flyweight component should", () => {
		it("be able to be created", () => {
			const component = ComponentInternalCreation.createFlyweight({
				x: ComponentTypes.Number,
			});
			expect(component).to.be.ok();
		});

		it("be able to be given to an entity", () => {
			const component = ComponentInternalCreation.createFlyweight({
				x: ComponentTypes.Number,
			});
			const entity = world.add();
			world.addComponent(entity, component);
			world.flush();
			expect(world.hasComponent(entity, component)).to.equal(true);
		});

		it("be able to be removed from an entity", () => {
			const component = ComponentInternalCreation.createFlyweight({
				x: ComponentTypes.Number,
			});
			const entity = world.add();
			world.addComponent(entity, component);
			world.flush();
			world.removeComponent(entity, component);
			world.flush();
			expect(world.hasComponent(entity, component)).to.equal(false);
		});

		it("to be able to hold data", () => {
			const component = ComponentInternalCreation.createFlyweight({
				x: 5,
			});

			expect(component.x).to.equal(5);

			component.set({
				x: 1,
			});

			expect(component.x).to.equal(1);

			component.set({
				x: 10000,
			});

			expect(component.x).to.equal(10000);
		});
	});
};
