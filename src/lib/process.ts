import { EventListener } from "./events";

const RunService = game.GetService("RunService");

/**
 *
 */
class Process extends EventListener<[]> {
	constructor(public name: string, private ticker: ProcessScheduler) {
		super();
	}

	public resume() {
		// Send message to Tina to connect this
		this.ticker.resume(this);
	}

	public suspend(seconds?: number) {
		// Send message to Tina to reconnect this after x seconds
		this.ticker.suspend(this, seconds);
	}
}

/**
 *
 */
class ProcessScheduler {
	private timeElapsed = 0;
	private timeBetweenTicks: number;
	private TPS: number;

	private activeProcesses = new Map<string, Process>();
	private suspendedProcesses = new Map<Process, number>();

	private isStarted = false;
	private connection?: RBXScriptConnection;

	constructor(TPS: number) {
		this.TPS = TPS;
		this.timeBetweenTicks = 1 / TPS;
	}

	public stop(): void {
		if (this.isStarted) {
			this.isStarted = false;
			this.connection?.Disconnect();
		}
	}

	private onHeartbeat(dt: number): void {
		this.timeElapsed += dt;
		if (this.timeElapsed >= this.timeBetweenTicks) {
			this.timeElapsed -= this.timeBetweenTicks;
			this.update();
		}
	}

	private update(): void {
		// Update suspended processes
		for (const [process, remainingTime] of pairs(this.suspendedProcesses)) {
			const nextTime = remainingTime - 1;
			if (nextTime < 0) {
				this.suspendedProcesses.delete(process);
				this.activeProcesses.set(process.name, process);
			} else {
				this.suspendedProcesses.set(process, nextTime);
			}
		}

		// Run active processes
		for (const [_, process] of pairs(this.activeProcesses)) {
			process.call();
		}
	}

	public suspend(process: Process, seconds?: number) {
		if (seconds === undefined) {
			this.activeProcesses.delete(process.name);

			// Check if there are still processes to run
			if (this.activeProcesses.size() === 0 && this.suspendedProcesses.size() === 0) {
				this.stop();
			}

			return;
		}

		this.suspendedProcesses.set(process, math.floor(seconds * this.TPS));
	}

	public resume(process: Process) {
		if (!this.activeProcesses.has(process.name)) {
			this.activeProcesses.set(process.name, process);
		}
		this.startIfPossible();
	}

	private startIfPossible() {
		if (!this.isStarted) {
			this.isStarted = true;
			this.connection = RunService.Heartbeat.Connect((dt: number) => this.onHeartbeat(dt));
		}
	}
}
