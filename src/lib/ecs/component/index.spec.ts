/// <reference types="@rbxts/testez/globals" />

import { internal_resetGlobalState } from "../entity-manager";
import { World } from "../world";
import { ComponentInternalCreation, ComponentTypes } from ".";
import { ComponentInternal } from "./types";

let world: World;

export = (): void => {
	beforeEach(() => {
		internal_resetGlobalState();

		world = new World();
	});

	describe("a component should", () => {
		it("be able to be created", () => {
			const component = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
			});
			expect(component).to.be.ok();
		});

		it("not be able to be created after entities have been added", () => {
			world.add();

			expect(() => {
				ComponentInternalCreation.createComponent({
					x: ComponentTypes.Number,
				});
			}).to.throw();
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
			world.disableComponent(entity, component);
			world.flush();
			expect(world.hasComponent(entity, component)).to.equal(false);
		});

		it("be able to update its data", () => {
			const component = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
			});

			const component2 = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
			});

			const entity = world.add();
			world.addComponent(entity, component);
			world.flush();
			component.set(entity, {
				x: 1,
			});

			expect((component as ComponentInternal<{ x: Array<number> }>).x[entity]).to.equal(1);

			const entity2 = world.add();
			world.addComponent(entity2, component2, {
				x: 2,
			});
			world.flush();
			expect((component2 as ComponentInternal<{ x: Array<number> }>).x[entity2]).to.equal(2);
		});

		it("support custom data types", () => {
			const component = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
				y: ComponentTypes.String,

				custom: ComponentTypes.Custom<{ test: number }>(),
			});

			const entity = world.add();
			world.addComponent(entity, component, {
				x: 10,
				y: "String",

				custom: { test: 100 },
			});

			expect(component.x[entity]).to.equal(10);
			expect(component.y[entity]).to.equal("String");
			expect(component.custom[entity].test).to.equal(100);
		});

		it("be able to have a default value", () => {
			const component = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
				y: ComponentTypes.Boolean,

				custom: ComponentTypes.Custom<{ test?: number; test2: number }>(),
			});

			component.setDefaults = () => {
				return {
					x: 100,

					custom: { test2: 0 },
				};
			};

			const entity = world.add();
			const entity2 = world.add();

			world.addComponent(entity, component);
			world.addComponent(entity2, component, { x: 200, custom: { test: 1, test2: 2 } });

			world.flush();

			expect(component.x[entity]).to.equal(100);
			expect(component.custom[entity].test).to.equal(undefined);
			expect(component.custom[entity].test2).to.equal(0);

			expect(component.x[entity2]).to.equal(200);
			expect(component.custom[entity2].test).to.equal(1);
			expect(component.custom[entity2].test2).to.equal(2);
		});

		it("be able to reset its default values", () => {
			const component = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
				y: ComponentTypes.Boolean,

				custom: ComponentTypes.Custom<{ test?: number; test2: number }>(),
			});

			component.setDefaults = () => {
				return {
					x: 10,

					custom: { test2: 0 },
				};
			};

			const entity = world.add();

			world.addComponent(entity, component, {
				x: 200,
				y: true,
				custom: { test: 1, test2: 2 },
			});

			world.flush();

			expect(component.x[entity]).to.equal(200);
			expect(component.y[entity]).to.equal(true);
			expect(component.custom[entity].test).to.equal(1);
			expect(component.custom[entity].test2).to.equal(2);

			component.reset(entity);

			expect(component.x[entity]).to.equal(10);
			expect(component.y[entity]).to.equal(undefined);
			expect(component.custom[entity].test).to.equal(undefined);
			expect(component.custom[entity].test2).to.equal(0);
		});

		it("be able to clone its data from another entity", () => {
			const component = ComponentInternalCreation.createComponent({
				x: ComponentTypes.Number,
				y: ComponentTypes.Boolean,
			});

			const entity = world.add();
			world.addComponent(entity, component, { x: 200, y: true });

			world.flush();

			for (const _ of $range(1, 10)) {
				const spacer = world.add();
				world.addComponent(spacer, component, { x: 100, y: false });
			}

			world.flush();

			const entity2 = world.add();

			world.flush();

			component.clone(entity, entity2);

			expect(component.x[entity2]).to.equal(200);
			expect(component.y[entity2]).to.equal(true);
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

		// This test is... dumb? I think there's a better implementation
		// but I can't think of it right now, so just please someone think
		// of a better way. This doesn't actually check anything meaningful
		// and it's going to break if we ever change these fields.
		itFIXME("not hold any data", () => {
			const tag = ComponentInternalCreation.createTag();
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
			world.disableComponent(entity, component);
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
