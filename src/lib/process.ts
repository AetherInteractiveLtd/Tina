import { EventListener } from "./events";

const RunService = game.GetService("RunService");

export default function processHandler() {
	const TPS = 20; // TPS to be replaced with value from tina.yaml
	const processes = new Map<string, Process>();
	const scheduler = new ProcessScheduler(TPS);

	return (name: string) => {
		if (processes.has(name)) {
			return processes.get(name)!;
		}
		return new Process(name, scheduler);
	};
}

/**
 *
 */
export class Process extends EventListener<[]> {
	public isSuspended = false;
	public suspensionTime = -1;
	public name: string;

	constructor(name: string, private ticker: ProcessScheduler) {
		super();
		this.name = name;
	}

	public resume() {
		this.isSuspended = false;
		this.ticker.addProcess(this);
	}

	public suspend(seconds?: number) {
		if (seconds === undefined) {
			this.ticker.removeProcess(this);
			return;
		}

		this.suspensionTime = math.floor(seconds * this.ticker.TPS);
		this.isSuspended = true;
	}
}

/**
 *
 */
export class ProcessScheduler {
	public TPS: number;
	private timeElapsed = 0;
	private timeBetweenTicks: number;
	private processes = new Map<string, Process>();

	private isStarted = false;
	private connection?: RBXScriptConnection;

	constructor(TPS: number) {
		this.TPS = TPS;
		this.timeBetweenTicks = 1 / TPS;
	}

	private onHeartbeat(dt: number): void {
		this.timeElapsed += dt;
		if (this.timeElapsed >= this.timeBetweenTicks) {
			this.timeElapsed -= this.timeBetweenTicks;
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

	public removeProcess(process: Process) {
		this.processes.delete(process.name);

		// Check if there are still processes to run
		if (this.processes.size() === 0) {
			this.stop();
		}
	}

	public addProcess(process: Process) {
		if (!this.processes.has(process.name)) {
			this.processes.set(process.name, process);
			this.start();
		}
	}

	private start() {
		if (!this.isStarted) {
			this.isStarted = true;
			this.connection = RunService.Heartbeat.Connect((dt: number) => this.onHeartbeat(dt));
		}
	}

	private stop(): void {
		if (this.isStarted) {
			this.isStarted = false;
			this.connection?.Disconnect();
		}
	}
}
