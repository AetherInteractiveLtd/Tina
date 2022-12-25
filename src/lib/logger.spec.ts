/// <reference types="@rbxts/testez/globals" />

import { EventEmitter } from "..";

export = () => {
	interface Events {
		event: [message: string];
		testingBind: [];
	}

	class Class extends EventEmitter<Events> {
		testBinds() {
			this.when("event")
				.do(print) // Binding outputting functions is fine as well
				.do(function () {})
				.do(() => {}); // Both ways work the same, demonstration
		}

		testEmits() {
			this.emit("event", "Emitting premated test passed.");
		}

		testAsyncEmits() {
			this.emit("event", "Asynchronous emitting premade test passed.")
				.andThen(() => print("Asynchronous emitting finished, passed."))
				.await();
		}

		testBinding<X>(key: keyof Events, func: (...args: unknown[]) => X) {
			this.when(key).do(func);
		}

		testEmitting<T extends keyof Events>(key: keyof Events, ...args: Events[T]) {
			this.emit(key, ...args);
		}
	}

	const Events = new Class();

	describe("EventEmitter", () => {
		it("should extend correctly from EventEmitter", () => {
			expect(Events).to.be.ok();
		});

		it("should NOT throw on binding functions", () => {
			expect(() => {
				Events.testBinds();
			}).never.to.throw();
		});

		it("should NOT throw on emit", () => {
			expect(() => {
				Events.testEmits();
			}).never.to.throw();
		});

		it("should print final message after emit done", () => {
			expect(() => {
				Events.testAsyncEmits();
			}).never.to.throw();
		});

		it("should bind function correctly", () => {
			expect(() => {
				Events.testBinding("testingBind", (...args: unknown[]) => print(...args));
			}).never.to.throw();
		});

		it("should emit event correctly", () => {
			expect(() => {
				Events.testEmitting("testingBind", "Previous binding of this function passed. Emitting passed.");
			}).never.to.throw();
		});
	});
};
