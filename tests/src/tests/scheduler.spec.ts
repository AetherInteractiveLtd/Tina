/// <reference types="@rbxts/testez/globals" />

import { Process } from "@rbxts/tina/out/lib/process/process";
import Scheduler from "@rbxts/tina/out/lib/process/scheduler";

export = () => {
	describe("Scheduler", () => {
		it("should exist", () => {
			expect(Scheduler).to.be.ok();
		});

		it("should be able to add and remove processes from it", () => {
			const process = new Process("james", Scheduler);
			expect(Scheduler.hasProcess(process.name)).to.equal(false);
			Scheduler.addProcess(process);
			expect(Scheduler.hasProcess(process.name)).to.equal(true);
			Scheduler.removeProcess(process);
			expect(Scheduler.hasProcess(process.name)).to.equal(false);
		});

		it("should call unsuspended processes", () => {
			const process = new Process("unsuspended", Scheduler);
			Scheduler.addProcess(process);

			const [status] = new Promise<void>((resolve) => {
				process.do(() => {
					resolve();
				});
			})
				.timeout(0.5, "Timed out")
				.awaitStatus();

			expect(status).to.equal(Promise.Status.Resolved);
			Scheduler.removeProcess(process);
		});

		it("should not call suspended processes", () => {
			const process = new Process("suspended", Scheduler);
			Scheduler.addProcess(process);
			process.suspend(1000); // 20 ticks = 1 second at 20 TPS

			const [status] = new Promise<string>((resolve) => {
				process.do(() => {
					resolve("Resolved");
				});
			})
				.timeout(0.5, "Timed out")
				.awaitStatus();

			// Should timeout
			expect(status).to.equal(Promise.Status.Rejected);
			Scheduler.removeProcess(process);
		});

		// it("should start automatically when a process is added", () => {
		// 	expect(Scheduler.isStarted).to.equal(false)
		// });

		// it("should stop automatically when all processes are removed", () => {
		// });
	});
};
