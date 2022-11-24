import { Process } from "./process";

const RunService = game.GetService("RunService");

/**
 *
 */
export class ProcessScheduler {
	static TPS = 20; // Grab value from tina.yaml when able
	public isStarted = false;
	private lastTick: number;
	private timeBetweenTicks: number;
	private connection?: RBXScriptConnection;
	private processes: Array<Process> = new Array();
	private processesToRemove: Array<Process> = new Array();
	/** Used to keep track of when the .update() method is running since .removeProcess() could be called during a Process callback. */
	private updating = false;

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
		this.updating = true;

		for (const process of this.processes) {
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

		// Remove processes in queue
		for (const process of this.processesToRemove) {
			this._removeProcess(process);
		}
		this.processesToRemove = new Array();

		this.updating = false;
	}

	public addProcess(process: Process): void {
		if (!this.processes.includes(process)) {
			this.processes.push(process);
			this.start();
		}
	}

	public removeProcess(process: Process): void {
		// If Processes are currently being updated then deffer removal until updating has finished
		if (this.updating) {
			this.processesToRemove.push(process);
		} else {
			this._removeProcess(process);
		}
	}

	private _removeProcess(process: Process): void {
		const index = this.processes.indexOf(process);
		if (index >= 0) {
			this.processes.remove(index);
			if (this.processes.size() === 0) {
				this.stop();
			}
		}
	}

	public hasProcess(name: string): boolean {
		return !!this.processes.find((p) => p.name === name);
	}

	public getProcess(name: string): Process | undefined {
		return this.processes.find((p) => p.name === name);
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

const Scheduler = new ProcessScheduler();
export default Scheduler;
