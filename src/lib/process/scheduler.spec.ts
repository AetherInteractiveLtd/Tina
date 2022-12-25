/// <reference types="@rbxts/testez/globals" />

import { Process } from "./process";
import Scheduler, { ProcessScheduler } from "./scheduler";

export = () => {
	describe("Scheduler", () => {
		it("should exist", () => {
			expect(Scheduler).to.be.ok();
		});

		it("should be able to add and remove processes from it", () => {
			const ticker = new ProcessScheduler();
			const process = new Process("addAndRemove", ticker);
			expect(ticker.hasProcess(process.name)).to.equal(false);
			ticker.addProcess(process);
			expect(ticker.hasProcess(process.name)).to.equal(true);
			ticker.removeProcess(process);
			expect(ticker.hasProcess(process.name)).to.equal(false);
		});

		it("should call unsuspended processes", () => {
			const ticker = new ProcessScheduler();
			ticker.start();
			const process = new Process("unsuspended", ticker);
			ticker.addProcess(process);

			let called = false;
			process.when().do(() => (called = true));
			task.wait(0.5);

			ticker.destroy();
			expect(called).to.equal(true);
		});

		it("should not call suspended processes", () => {
			const ticker = new ProcessScheduler();
			const process = new Process("suspended", ticker);
			ticker.start();
			ticker.addProcess(process);
			process.suspend(1000); // 20 ticks = 1 second at 20 TPS

			let called = false;
			process.when().do(() => (called = true));
			task.wait(0.5);

			ticker.destroy();

			// Should timeout
			expect(called).to.equal(false);
		});

		it("should be able to remove process during a tick", () => {
			const ticker = new ProcessScheduler();
			const process1 = new Process("1", ticker);
			const process2 = new Process("2", ticker);
			ticker.start();

			let called = false;
			process1.when().do(() => ticker.removeProcess(process1));
			process2.when().do(() => (called = true));
			process1.resume();
			process2.resume();
			task.wait(0.5);

			const hasProcess = ticker.hasProcess(process1.name);
			ticker.destroy();

			expect(hasProcess).to.equal(false);
			expect(called).to.equal(true);
		});
	});
};
