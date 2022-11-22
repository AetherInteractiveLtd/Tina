import { EventListener } from "./events";

const RunService = game.GetService("RunService");

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

/**
 *
 */
class ProcessScheduler {
	static TPS = 20; // Grab value from tina.yaml when able
	private lastTick: number;
	private timeBetweenTicks: number;
	private isStarted = false;
	private connection?: RBXScriptConnection;
	private processes = new Map<string, Process>();

	constructor() {
		this.timeBetweenTicks = 1 / ProcessScheduler.TPS;
		this.lastTick = os.time();
	}

	private onHeartbeat(): void {
		const currentTick = os.time();
		const deltaTime = currentTick - this.lastTick;
		if (deltaTime >= this.timeBetweenTicks) {
			// Adjust lastTick to based on timeBetweenTicks to keep interval relatively stable
			this.lastTick = currentTick - (deltaTime % this.timeBetweenTicks);
			this.update();
		}
	}

	private update(): void {
		for (const [_, process] of pairs(this.processes)) {
			// Update suspended processes
			if (process.isSuspended) {
				process.suspensionTime -= 1;
				if (process.suspensionTime < 0) {
					process.isSuspended = false;
				}
			}

			// Run active processes
			if (!process.isSuspended) {
				process.call();
			}
		}
	}

	public removeProcess(process: Process): void {
		this.processes.delete(process.name);

		// Check if there are still processes to run
		if (this.processes.size() === 0) {
			this.stop();
		}
	}

	public addProcess(process: Process): void {
		if (!this.processes.has(process.name)) {
			this.processes.set(process.name, process);
			this.start();
		}
	}

	public hasProcess(name: string): boolean {
		return this.processes.has(name);
	}

	public getProcess(name: string): Process | undefined {
		return this.processes.get(name);
	}

	private start(): void {
		if (!this.isStarted) {
			this.isStarted = true;
			this.connection = RunService.Heartbeat.Connect(() => this.onHeartbeat());
		}
	}

	private stop(): void {
		if (this.isStarted) {
			this.isStarted = false;
			this.connection?.Disconnect();
		}
	}
}

export const Scheduler = new ProcessScheduler();
