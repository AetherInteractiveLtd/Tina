/// <reference types="@rbxts/testez/globals" />

import { RunService } from "@rbxts/services";

import { Process } from "./process";
import { Scheduler } from "./scheduler";

export = (): void => {
	describe("Processes", () => {
		it("should extend from a process correctly", () => {
			class TestingProcess extends Process {
				public update(): void {}
			}

			const process = new TestingProcess("TestingProcess");

			expect(Scheduler.has("TestingProcess")).to.be.equal(false);

			process.delete();
		});

		it("should suspend process correctly", () => {
			class TestingProcess extends Process {
				constructor(name: string) {
					super(name);

					this.executionGroup = RunService.PostSimulation; // Another syntax
				}

				public update(): void {}
			}

			const process = new TestingProcess("SuspendedProcess");

			process.suspend(10); // Suspend it for 10 ticks

			expect(process.status()).to.be.equal("suspended");

			process.delete();
		});
	});
};
