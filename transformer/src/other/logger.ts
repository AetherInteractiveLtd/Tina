import chalk from "chalk";

export class Logger {
	public constructor(public readonly debug: boolean) {}

	public write(message: string): void {
		process.stdout.write(message);
	}

	public writeLine(...messages: ReadonlyArray<unknown>): void {
		if (!this.debug) return;

		for (const message of messages) {
			const text = typeof message === "string" ? `${message}` : `${JSON.stringify(message, undefined, "\t")}`;

			const prefix = `[${chalk.gray("yaml-transformer")}]: `;
			this.write(`${prefix}${text.replace(/\n/g, `\n${prefix}`)}\n`);
		}
	}

	public info(...messages: Array<unknown>): void {
		this.writeLine(...messages.map((x) => chalk.blue(x)));
	}

	public warn(...messages: Array<unknown>): void {
		this.writeLine(...messages.map((x) => chalk.yellow(x)));
	}

	public error(...messages: Array<unknown>): void {
		this.writeLine(...messages.map((x) => chalk.red(x)));
	}
}
