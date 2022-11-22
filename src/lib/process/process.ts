import { EventListener } from "../events";
import Scheduler from "./scheduler";

type ProcessScheduler = typeof Scheduler;

/**
 *
 */
export class Process extends EventListener<[]> {
	public name: string;
	public isSuspended = false;
	public suspensionTime = -1;

	private ticker: ProcessScheduler;

	constructor(name: string, ticker: ProcessScheduler) {
		super();
		this.name = name;
		this.ticker = ticker;
	}

	public resume() {
		this.isSuspended = false;
		this.ticker.addProcess(this);
	}

	public suspend(ticks = 1) {
		this.suspensionTime = ticks;
		this.isSuspended = true;
	}
}
