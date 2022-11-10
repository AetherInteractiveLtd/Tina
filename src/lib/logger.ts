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

const backslash = string.char(92); // for some reason I can't store a backslash as a single character. ._.

class Scope {
	name = "unnamed";

	constructor(scopeName: string, printToFile: boolean) {
		this.name = scopeName;
	}

	static scope(scopeName: string, printToFile: boolean) {
		return new this(scopeName, printToFile);
	}

	static getOutput() {
		return output;
	}

	log(severity: ESeverityLevels, ...toPrint: defined[]) {
		let stringToPrint = "";
		toPrint.forEach((value) => {
			stringToPrint = `${stringToPrint}${tostring(value)} `;
		});

		output.push({
			level: severity,
			text: `[${this.name}]: ${stringToPrint}`,
		});
	}
	info(...args: string[]) {
		this.log(0, ...args);
	}
	debug(...args: string[]) {
		const traceback = debug.traceback();

		const splitStrings: string[] = string.split(traceback, "\n");
		for (const v of splitStrings) {
			this.log(-1, v);
		}

		this.log(1, ...args);
	}
	warn(...args: string[]) {
		this.log(2, ...args);
	}
	error(...args: string[]) {
		this.log(3, ...args);
	}
	fatal(...args: string[]) {
		this.log(4, ...args);
	}
}

export = new Scope("gamenamehere", false); // temporary args
