enum ESeverityLevels {
	meta = -1,
	info = 0,
	debug = 1,
	warn = 2,
	error = 3,
	fatal = 4,
	shutdown = 5,
}

interface IOutputObject {
	level: ESeverityLevels;
	text: string;
}

const output: Array<IOutputObject> = [];

class Scope {
	public name = "unnamed";

	constructor(scopeName: string, printToFile = false) {
		this.name = scopeName;
	}

	public static scope(scopeName: string, printToFile = false): Scope {
		return new this(scopeName, printToFile);
	}

	public static getOutput(): typeof output {
		return output;
	}

	public log(severity: ESeverityLevels, ...toPrint: Array<unknown>): void {
		let stringToPrint = "";
		(toPrint as Array<defined>).forEach(value => {
			stringToPrint = `${stringToPrint} ${tostring(value)} `;
		});

		output.push({
			level: severity,
			text: `[${this.name}]: ${stringToPrint}`,
		});
	}

	public info(...args: Array<unknown>): void {
		this.log(0, ...args);
	}

	public debug(...args: Array<unknown>): void {
		const traceback = debug.traceback();

		const splitStrings: Array<string> = string.split(traceback, "\n");
		for (const v of splitStrings) {
			this.log(-1, v);
		}

		this.log(1, ...args);
	}

	public warn(...args: Array<unknown>): void {
		this.log(2, ...args);
	}

	public error(...args: Array<unknown>): void {
		this.log(3, ...args);
	}

	public fatal(...args: Array<unknown>): void {
		this.log(4, ...args);
	}
}

export = new Scope("gamenamehere", false); // temporary args
