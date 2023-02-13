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

export class Scope {
	public name = "unnamed";

	public setName(name: string): void {
		this.name = name;
	}

	constructor(scopeName: string, printToFile = false) {
		this.name = scopeName;
		if (printToFile) {
			this.warn("Printing to File is not yet Supported. printToFile ignored.");
		}
	}

	public static scope(scopeName: string, printToFile = false): Scope {
		return new this(scopeName, printToFile);
	}

	/** @hidden */
	public static getOutput(): Array<IOutputObject> {
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
			// TODO: we probably want to do some cool RichText stuff here?
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
