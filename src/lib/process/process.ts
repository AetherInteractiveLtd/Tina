import { EventEmitter } from "../events";
import Scheduler from "./scheduler";

type ProcessScheduler = typeof Scheduler;
interface Events {
	_default: [dt: number];
}

export class Process extends EventEmitter<Events> {
	public static processes = new Map<string, Process>();

	public name: string;
	public isSuspended = false;
	public suspensionTime = -1;

	private ticker: ProcessScheduler;

	constructor(name: string, ticker: ProcessScheduler) {
		super();

		this.name = name;
		this.ticker = ticker;

		// Add to static list of all created Processes
		Process.processes.set(name, this);
	}

	public resume(): void {
		this.isSuspended = false;
		this.ticker.addProcess(this);
	}

	public suspend(ticks = 1): void {
		this.suspensionTime = ticks;
		this.isSuspended = true;
	}
}
