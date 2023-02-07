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
<<<<<<< HEAD:src/lib/util/ObservableValue.spec.ts
<<<<<<< HEAD:src/lib/util/ObservableValue.spec.ts
			value.when(newValue => {
=======
			value.subscribe(newValue => {
>>>>>>> 222a4d1 (Add support for function setters for state for nicer syntax):src/lib/utilities/ObservableValue.spec.ts
=======
			value.when(newValue => {
>>>>>>> 2da8b3a (Rename .subscribe to .when on State):src/lib/utilities/ObservableValue.spec.ts
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
