/// <reference types="@rbxts/testez/globals" />

import { EntityId } from "../types/ecs";
import { Tree, Type } from "./component";
import { ALL, ANY, NOT, Query } from "./query";
import { World } from "./world";

const components = new Array<MockComponent<defined>>(32);

const world = {} as World;

type MockComponent<T extends Tree<Type>> = {
	componentData: Array<never>;
	componentId: number;
	set(): void;
	get<U extends keyof T>(entityId: EntityId, key: U): T[U] extends Array<infer K> ? K : never;
};

function createMockComponent<T extends Tree<Type>>(id: number): MockComponent<T> {
	return {
		componentData: [],
		componentId: id,
		set(): void {},
		get<U extends keyof T>(entityId: EntityId, key: U): T[U] extends Array<infer K> ? K : never {
			return undefined as never;
		},
	};
}

export = (): void => {
	beforeEach(() => {
		for (let i = 0; i < 33; i++) {
			components.push(createMockComponent(i));
		}
	});

	describe("A query should", () => {
		it("should throw if no arguments provided", () => {
			expect(() => {
				ALL();
			}).to.throw();

			expect(() => {
				ANY();
			}).to.throw();
		});

		describe("match", () => {
			it("empty", () => {
				const query = new Query({} as World).mask;

				for (let i = 0; i < 20; i++) {
					expect(Query.match(new Array<number>(math.floor(math.random() * 1000)), query)).to.equal(true);
				}
			});

			it("ALL", () => {
				const query = new Query(world, ALL(components[0], components[2], components[3])).mask;
				expect(Query.match([13], query)).to.equal(true);
				expect(Query.match([14], query)).to.equal(false);
				expect(Query.match([15, 0], query)).to.equal(true);
				expect(Query.match([16, 0], query)).to.equal(false);
			});

			it("NOT", () => {
				const query = new Query(world, NOT(components[1])).mask;
				expect(Query.match([0], query)).to.equal(true);
				expect(Query.match([5], query)).to.equal(true);
				expect(Query.match([7], query)).to.equal(false);
				expect(Query.match([13, 4], query)).to.equal(true);
				expect(Query.match([15, 0], query)).to.equal(false);
			});

			it("ANY", () => {
				const query = new Query(world, ANY(components[0], components[2], components[5])).mask;
				expect(Query.match([0], query)).to.equal(false);
				expect(Query.match([10], query)).to.equal(false);
				expect(Query.match([13], query)).to.equal(true);
				expect(Query.match([15, 5], query)).to.equal(true);
				expect(Query.match([16, 0], query)).to.equal(false);
			});

			// TODO: Move away from 32 bit operators since lua doesn't support them
			it("more than 32 components", () => {
				const query = new Query(world, ALL(components[0], components[32])).mask;
				expect(Query.match([1, 1], query)).to.equal(true);
				expect(Query.match([1, 2, 1], query)).to.equal(false);
				expect(Query.match([3, 3, 0], query)).to.equal(true);
				// expect(query.match([1], query)).to.equal(false);
				expect(Query.match([0, 1], query)).to.equal(false);
			});

			it("complex query #1", () => {
				const query = new Query(world, ALL(components[1], ANY(components[2], NOT(components[0])))).mask;
				expect(Query.match([2], query)).to.equal(true);
				expect(Query.match([3], query)).to.equal(false);
				expect(Query.match([5, 0], query)).to.equal(false);
				expect(Query.match([6, 1], query)).to.equal(true);
				expect(Query.match([7, 43], query)).to.equal(true);
			});

			it("complex query #2", () => {
				const query = new Query(world, ALL(NOT(ANY(components[0], components[1])), components[3])).mask;
				expect(Query.match([1], query)).to.equal(false);
				expect(Query.match([8], query)).to.equal(true);
				expect(Query.match([9, 0], query)).to.equal(false);
				expect(Query.match([10, 10], query)).to.equal(false);
				expect(Query.match([12, 2], query)).to.equal(true);
			});

			it("complex query #3", () => {
				const query = new Query(
					world,
					ALL(ANY(components[0], components[3]), ANY(components[2], NOT(components[4]))),
				).mask;
				expect(Query.match([1], query)).to.equal(true);
				expect(Query.match([2], query)).to.equal(false);
				expect(Query.match([8, 0], query)).to.equal(true);
				expect(Query.match([17, 1], query)).to.equal(false);
				expect(Query.match([21, 9], query)).to.equal(true);
				expect(Query.match([29, 16], query)).to.equal(true);
			});
		});
	});
};
