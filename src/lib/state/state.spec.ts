/// <reference types="@rbxts/testez/globals" />

import Tina, { State } from "../..";

/**
 * For now it only tests Local State, we will figure out something along the way.
 */
export = (): void => {
	describe("State", () => {
		it("should build State correctly", () => {
			expect(() => {
				return Tina.buildState({
					testing_field: State.create<never>(),

					testing_namespace: State.namespace({
						testing_function_setter: State.create<number>(() => {
							return 0; // Testing for initial setters.
						}),

						testing_value_setter: State.create<string>("Hello, world!"),
					}),
				});
			}).never.to.throw();
		});

		it("should listen for State changes correctly", () => {
			const testingState = Tina.buildState({
				local: State.namespace({
					round: State.create(0),
				}),
			});

			expect(() => {
				testingState.local.round
					.when()
					.condition((value: number) => {
						return value !== 3;
					})
					.do((value: number) => {
						// Do something with the new state.
					});
			}).never.to.throw();
		});

		it("should retrieve State correctly", () => {
			const testingState = Tina.buildState({
				local: State.namespace({
					data: State.create({ value: 0 }),
				}),
			});

			expect(testingState.local.data.get().value).to.equal(0);
		});

		it("should set State correctly", () => {
			const testingState = Tina.buildState({
				local: State.namespace({
					game_ticks: State.create<number>(),

					game_data: State.create({
						plain_data: "Hello, world!",
						some_other_data: 0,
					}),
				}),
			});

			expect(() => {
				testingState.local.game_data.set({ plain_data: "Lol" }); // No need on setting all the object once again.

				testingState.local.game_ticks.set(t => {
					return t !== undefined ? tick() - t : 0;
				});
			}).never.to.throw();

			expect(testingState.local.game_data.get().plain_data).to.equal("Lol");
		});
	});
};
