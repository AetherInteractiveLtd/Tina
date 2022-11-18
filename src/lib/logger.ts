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

const output: IOutputObject[] = [];

class Scope {
	name = "unnamed";

	constructor(scopeName: string, printToFile = false) {
		this.name = scopeName;
	}

	static scope(scopeName: string, printToFile = false) {
		return new this(scopeName, printToFile);
	}

	static getOutput() {
		return output;
	}

	log(severity: ESeverityLevels, ...toPrint: unknown[]) {
		let stringToPrint = "";
		(toPrint as defined[]).forEach((value) => {
			stringToPrint = `${stringToPrint} ${tostring(value)} `;
		});

		output.push({
			level: severity,
			text: `[${this.name}]: ${stringToPrint}`,
		});
	}
	info(...args: unknown[]) {
		this.log(0, ...args);
	}
	debug(...args: unknown[]) {
		const traceback = debug.traceback();

		const splitStrings: string[] = string.split(traceback, "\n");
		for (const v of splitStrings) {
			this.log(-1, v);
		}

		this.log(1, ...args);
	}
	warn(...args: unknown[]) {
		this.log(2, ...args);
	}
	error(...args: unknown[]) {
		this.log(3, ...args);
	}
	fatal(...args: unknown[]) {
		this.log(4, ...args);
	}
}

export = new Scope("gamenamehere", false); // temporary args
