/// <reference types="@rbxts/testez/globals" />

import Tina from "@rbxts/tina";
import { Process } from "@rbxts/tina/out/lib/process/process";
import Scheduler from "@rbxts/tina/out/lib/process/scheduler";

export = () => {
	describe("Process", () => {
		it("should create new process", () => {
			const process = new Process("myName", Scheduler);
			expect(process).to.be.ok();
			expect(process.name).to.equal("myName");
		});

		it("should return the same Process when using Tina.process() and new Process()", () => {
			const process1 = new Process("shouldMatchProcess", Scheduler);
			const process2 = Tina.process("shouldMatchProcess");
			expect(process1).to.equal(process2);
		});

		it("should add to ticker on .resume()", () => {
			const process = new Process("callMeAnything", Scheduler);
			expect(Scheduler.hasProcess(process.name)).to.equal(false);
			process.resume();
			expect(Scheduler.hasProcess(process.name)).to.equal(true);
			Scheduler.removeProcess(process);
		});

		it("should suspend on .suspend()", () => {
			const process = new Process("", Scheduler);
			expect(process.isSuspended).to.equal(false);

			process.suspend(23);
			expect(process.isSuspended).to.equal(true);
			expect(process.suspensionTime).to.equal(23);
		});
	});
};
