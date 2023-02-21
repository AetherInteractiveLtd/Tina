/// <reference types="@rbxts/testez/globals" />

import { EventEmitter } from ".";
import { COND } from "../conditions";

export = (): void => {
	interface Events {
		event: [message: string];
		conditioning: [code: number];
		_default: [name: string];
	}

	class EventSpec extends EventEmitter<Events> {
		constructor() {
			super()
		}

		public test(): void {
			// Normal binding
			this.when("event").do(() => {})

			// Default binding
			this.when().do(() => {
				return true
			})
			
			// Conditions binding to a default event
			this.when().condition(COND.create(() => true))

			// Conditions + do's (binding a condition for a previous check to the do)
			this.when("conditioning").condition(COND.create((code: unknown) => {
				if (code  === 1) {
					return true
				}

				return false
			})).do((code: number) => {})		
		}
	}

	const event = new EventSpec()

	describe("EventEmitter", () => {
		it("should pass all binding tests correctly", () => {
			expect(() => event.test()).never.to.throw()
		})

		it("should emit correctly", () => {
			expect(() => {
				event.emit("event", "Hello there!")
				event.emit("conditioning", 1)
				event.emit("_default", "Hey there!")
			}).never.to.throw()
		})
	});
};
