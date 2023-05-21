import { ExecutionGroup } from "../../ecs/system";
import { Scheduler } from "../scheduler";
import { TProcessStatus } from "../scheduler/types";
import { IProcessImplementation } from "./types";

export abstract class Process implements IProcessImplementation {
	public lastTick: number = os.clock();

	public ticksPerSecond?: number;

	constructor(public readonly name: string, public executionGroup?: ExecutionGroup) {
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

	public delete(): void {
		return Scheduler.remove(this.name);
	}

	public abstract update(dt: number): void;
}
