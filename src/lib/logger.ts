type severityLevels = -1 | 0 | 1 | 2 | 3 | 4 | 5; // (-1 = meta, 0 = info, 1 = debug, 2 = warn, 3 = error, 4 = fatal, 5 = shutdown)
type outputObject = {
	level: severityLevels;
	text: string;
};

const output: outputObject[] = [];

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

	log(severity: severityLevels, ...toPrint: any[]) {
		let stringToPrint = "";
		toPrint.forEach((value) => {
			stringToPrint = `${stringToPrint}${tostring(value)} `;
		});

		output.unshift({
			level: severity,
			text: `[${this.name}]: ${stringToPrint}`,
		});
	}
	info(...args: string[]) {
		this.log(0, ...args);
	}
	debug(...args: any[]) {
		const traceback = debug.traceback();

		const splitStrings: string[] = string.split(traceback, "\n");
		for (const v of splitStrings) {
			this.log(-1, v);
		}

		this.log(1, ...args);
	}
	warn(...args: any[]) {
		this.log(2, ...args);
	}
	error(...args: any[]) {
		this.log(3, ...args);
	}
	fatal(...args: any[]) {
		this.log(4, ...args);
	}
}

export = new Scope("gamenamehere", false); // temporary args
