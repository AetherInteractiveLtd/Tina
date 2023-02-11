import { Process } from "./process";

const RunService = game.GetService("RunService");

/**
 *
 */
export class ProcessScheduler {
	private static TPS = 20; // Grab value from tina.yaml when able
	private lastTick: number;
	private timeBetweenTicks: number;
	private connection?: RBXScriptConnection;
	private processes: Array<Process> = new Array();
	private processesToRemove: Array<Process> = new Array();

	/** Used to keep track of when the .update() method is running since .removeProcess() could be called during a Process callback. */
	private updating = false;

	constructor() {
		this.timeBetweenTicks = 1 / ProcessScheduler.TPS;
		this.lastTick = os.clock();
	}

	private onHeartbeat(): void {
		const currentTick = os.clock();
		const deltaTime = currentTick - this.lastTick;
		if (deltaTime >= this.timeBetweenTicks) {
			// Adjust lastTick to based on timeBetweenTicks to keep interval relatively stable
			this.lastTick = currentTick - (deltaTime % this.timeBetweenTicks);
			this.update(deltaTime);
		}
	}

	private update(dt: number): void {
		// Update has started
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
			if (process.isSuspended) continue;
			try {
				process.emit("_default", dt);
			} catch (error) {
				// TODO: log any errors properly.
			}
		}

		// Remove processes in queue
		for (const process of this.processesToRemove) {
			this._removeProcess(process);
		}
		this.processesToRemove = new Array();

		// Update has finished
		this.updating = false;
	}

	public addProcess(process: Process): void {
		if (this.processes.includes(process)) return;

		this.processes.push(process);
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
		if (index < 0) return;
		this.processes.remove(index);
	}

	public hasProcess(name: string): boolean {
		return !!this.processes.find(p => p.name === name);
	}

	public getProcess(name: string): Process | undefined {
		return this.processes.find(p => p.name === name);
	}

	public start(): void {
		if (this.connection) return; // TODO: log that they're doing something stupid.
		this.connection = RunService.Heartbeat.Connect(() => this.onHeartbeat());
	}

	/**
	 * @hidden
	 * Remove all references and disconnect all connections
	 */
	public destroy(): void {
		this.connection?.Disconnect();
		this.processes = new Array();
		this.processesToRemove = new Array();
	}
}

const Scheduler = new ProcessScheduler();
export default Scheduler;
