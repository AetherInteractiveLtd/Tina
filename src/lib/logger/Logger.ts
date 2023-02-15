type LoggerFunction = (
	severity: number,
	message: string,
	source: string,
	scopeStack: Array<string>,
) => void;

export class Scope {
	private handler?: LoggerFunction;
	private maxMessages: number;
	private messages: Array<string> = [];

	public scopeName: Array<string>;

	constructor(name: string | Array<string>) {
		this.scopeName = typeIs(name, "string") ? [name] : name;
		this.maxMessages = 100;
	}

	private trimMessages(): void {
		if (this.maxMessages <= 0) return;
		if (this.messages.size() <= this.maxMessages) return;

		for (const i of $range(this.messages.size(), this.maxMessages)) {
			this.messages.remove(i);
		}
	}

	public log(severity: number, ...message: Array<defined>): this {
		const msg = message.map(v => tostring(v)).join(" ");
		this.messages.unshift(msg);
		this.trimMessages();

		const info = debug.info(3, "sln");

		/* Pass message into custom handler */
		this.handler?.(severity, msg, `${info[0]} ${info[1]} ${info[2]}`, this.scopeName);

		Logger.callForAll.forEach(v => {
			v(severity, msg, `${info[0]} ${info[1]} ${info[2]}`, this.scopeName);
		});

		return this;
	}

	public info(...message: Array<defined>): this {
		this.log(0, ...message);

		return this;
	}

	public warn(...message: Array<defined>): this {
		this.log(1, ...message);

		return this;
	}

	public debug(...message: Array<defined>): this {
		this.log(2, ...message);

		return this;
	}

	public error(...message: Array<defined>): this {
		this.log(3, ...message);

		return this;
	}

	public fatal(...message: Array<defined>): this {
		this.log(3, ...message);

		error(...message);
	}

	public setSink(handler: LoggerFunction): this {
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
		this.scopeName.push(scopeName);
		return Logger.scope(this.scopeName);
	}
}

export namespace Logger {
	const scopes = new Map<string, Scope>();

	export const callForAll: Array<LoggerFunction> = [];

	export function scope(scopeId: string | Array<string>): Scope {
		const scopeName = typeIs(scopeId, "string") ? [scopeId] : scopeId;
		const scopeField = scopeName.join("/");

		if (scopes.has(scopeField)) return scopes.get(scopeField)!;

		const scope = new Scope(scopeName);
		scopes.set(scopeField, scope);
		return scope;
	}

	export function consumeAll(arg: LoggerFunction): void {
		callForAll.push(arg);
	}
}
