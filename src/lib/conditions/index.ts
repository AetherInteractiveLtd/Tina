import { Condition } from "./types";

function isAFunction(func: Condition): func is Callback {
	return typeOf(func) === "function";
}

export class X {
	public static EVAL(condition: Condition): boolean {
		return isAFunction(condition) ? condition() : condition;
	}

	public static AND(first: Condition, second: Condition): Condition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return firstEvaluation && secondEvaluation;
	}

	public static OR(first: Condition, second: Condition): Condition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return firstEvaluation || secondEvaluation;
	}

	public static NOT(value: Condition): Condition {
		const evaluation = isAFunction(value) ? value() : value;

		return !evaluation;
	}

	public static NAND(first: Condition, second: Condition): Condition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return !(firstEvaluation && secondEvaluation);
	}

	public static NOR(first: Condition, second: Condition): Condition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return !(firstEvaluation || secondEvaluation);
	}

	public static XOR(first: Condition, second: Condition): Condition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return (firstEvaluation || secondEvaluation) && !(firstEvaluation && secondEvaluation);
	}

	public static XNOR(first: Condition, second: Condition): Condition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return firstEvaluation === secondEvaluation;
	}
}
