type LoggerFunction = (message: string) => void;

export class Scope {
	private handler?: LoggerFunction;
	private maxMessages: number;
	private messages: Array<string> = [];

	public name: string;

	constructor(name: string) {
		this.name = name;
		this.maxMessages = 100;
	}

	private trimMessages(): void {
		if (this.maxMessages <= 0) return;
		if (this.messages.size() <= this.maxMessages) return;

		for (const i of $range(this.messages.size(), this.maxMessages)) {
			this.messages.remove(i);
		}
	}

	public log(...message: Array<defined>): this {
		const msg = message.map(v => tostring(v)).join(" ");
		this.messages.unshift(msg);
		this.trimMessages();

		/* Pass message into custom handler */
		this.handler?.(msg);

		return this;
	}

	public setHandler(handler: LoggerFunction): this {
		this.handler = handler;
		return this;
	}

	public setMaxMessages(value: number): this {
		this.maxMessages = value;
		this.trimMessages();
		return this;
	}

	public getMessages(): Array<string> {
		return [...this.messages];
	}

	public scope(scopeName: string): Scope {
		return Logger.scope(this.name + ":" + scopeName);
	}
}

export namespace Logger {
	const scopes = new Map<string, Scope>();

	export function scope(scopeName: string): Scope {
		if (scopes.has(scopeName)) return scopes.get(scopeName)!;

		const scope = new Scope(scopeName);
		scopes.set(scopeName, scope);
		return scope;
	}
}
