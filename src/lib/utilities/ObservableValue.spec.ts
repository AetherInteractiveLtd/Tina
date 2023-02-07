/// <reference types="@rbxts/testez/globals" />

import { ObservableValue } from "./ObservableValue";

export = () => {
	describe("ObservableValue", () => {
		it("Should have an initial value when created", () => {
			const value = new ObservableValue(73);
			expect(value.getValue()).to.equal(73);
		});

		it("Should be able to update the value", () => {
			const value = new ObservableValue(0);
			value.set(258);
			expect(value.getValue()).to.equal(258);
		});

		it("Should be able to subscribe to value changes", () => {
			const value = new ObservableValue("Gaming");

			let currentValue: string | undefined;
			value.subscribe(newValue => {
				currentValue = newValue;
			});

			value.set("Anime");

			expect(currentValue).to.equal("Anime");
		});

		it("Should accept a function to the set method", () => {
			const value = new ObservableValue(900);
			value.set(v => v + 100);
			expect(value.getValue()).to.equal(1000);
		});
	});
};
