import { EventEmitter } from "../../events";
import { Scheduler } from "../scheduler";
import { TProcessStatus } from "../scheduler/types";
import { IProcessImplementation } from "./types";

interface IProcessEvent {
	_default: [dt: number];
}

export class Process extends EventEmitter<IProcessEvent> implements IProcessImplementation {
	public lastTick: number = os.clock();

	public ticksPerSecond?: number;

	constructor(public readonly name: string, public readonly executionGroup?: RBXScriptSignal) {
		super();

		Scheduler.add(name, this);
	}

	public resume(): void {
		return Scheduler.unsuspend(this.name);
	}

	public suspend(ticks: number): void {
		return Scheduler.suspend(this.name, ticks);
	}

	public status(): TProcessStatus {
		return Scheduler.status(this.name);
	}

	public _update(dt: number): void {
		return this.emit("_default", dt);
	}
}
