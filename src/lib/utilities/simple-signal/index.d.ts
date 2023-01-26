declare namespace Signal {
	export class Connection {
		public Disconnect(): void;
	}
}

declare class Signal<T extends Array<unknown> = []> {
	public Connect(handler: (...args: T) => void): Signal.Connection;
	public DisconnectAll(): void;
	public Fire(...args: T): void;
	public Wait(): LuaTuple<[]>;
	public Once(handler: (...args: T) => void): Signal.Connection;
}

export = Signal;
