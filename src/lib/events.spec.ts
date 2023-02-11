/// <reference types="@rbxts/testez/globals" />

import { EventEmitter } from "..";

export = (): void => {
	interface Events {
		event: [message: string];
		testingBind: [];
		_default: [];
	}

	class Class extends EventEmitter<Events> {
		public testBinds(): void {
			this.when("event")
				.do(print) // Binding outputting functions is fine as well
				.do(function () {})
				.do(() => {}); // Both ways work the same, demonstration
		}

		public testEmits(): void {
			this.emit("event", "Emitting premated test passed.");
		}

		public testAsyncEmits(): void {
			this.emit("event", "Asynchronous emitting premade test passed.");
		}

		public testBinding<X>(key: keyof Events, func: (...args: Array<unknown>) => X): void {
			this.when(key).do(func);
		}

		public testEmitting<T extends keyof Events>(key: keyof Events, ...args: Events[T]): void {
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
				Events.testBinding("testingBind", (...args: Array<unknown>) => print(...args));
			}).never.to.throw();
		});

		it("should emit event correctly", () => {
			expect(() => {
				Events.testEmitting("testingBind", "Previous binding of this function passed. Emitting passed.");
			}).never.to.throw();
		});

		it("should default to _default key if no key is specified", () => {
			let called = 0;
			Events.when().do(() => {
				called++;
			});
			Events.emit("_default");
			expect(called).to.equal(1);
		});
	});
};
