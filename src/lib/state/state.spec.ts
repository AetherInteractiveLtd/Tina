/// <reference types="@rbxts/testez/globals" />

import { State } from "./state";

export = () => {
	describe("State", () => {
		enum TestEnum {
			A,
			B,
			C,
		}

		it("should create new state", () => {
			const state: State<TestEnum> = new State(TestEnum.A);
			expect(state).to.be.ok();
		});
		it("should retain initial value", () => {
			const state: State<TestEnum> = new State(TestEnum.A);
			expect(state.get()).to.equal(TestEnum.A);
		});
		it("should update value", async () => {
			const state: State<TestEnum> = new State(TestEnum.A);
			await state.set(TestEnum.B);
			expect(state.get()).to.equal(TestEnum.B);
		});
		it("should update value multiple times", async () => {
			const state: State<TestEnum> = new State(TestEnum.A);
			await state.set(TestEnum.B);
			await state.set(TestEnum.C);
			expect(state.get()).to.equal(TestEnum.C);
		});
		it("should emit event when value is updated", async () => {
			const state: State<TestEnum> = new State(TestEnum.A);
			let emitted = false;
			state.when().do(value => {
				expect(value).to.equal(TestEnum.B);
				emitted = true;
			});
			await state.set(TestEnum.B);
			expect(emitted).to.equal(true);
		});
		it("should not emit event when value is not updated", () => {
			const state: State<TestEnum> = new State(TestEnum.A);
			let emitted = false;
			state.when().do(_ => {
				emitted = true;
			});
			expect(emitted).to.equal(false);
		});
		it("should emit event when value is updated to the same value", async () => {
			const initial: TestEnum = TestEnum.A;
			const state: State<TestEnum> = new State(initial);
			let emitted = false;
			state.when().do(_ => {
				emitted = true;
				expect(state.get()).to.equal(initial);
			});
			await state.set(initial);
			expect(emitted).to.equal(true);
		});
	});
};
