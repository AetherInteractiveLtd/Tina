import { Condition, ConditionCallback } from "./types";

import { isFunction } from "../utilities/checkers";

export class X {
	public static EVAL<T extends unknown[]>(condition: Condition<T>, ...args: T): boolean {
		return isFunction(condition) ? condition(...args) : condition;
	}

	public static AND(first: Condition, second: Condition): Condition {
		const firstEvaluation = isFunction(first) ? first() : first;
		const secondEvaluation = isFunction(second) ? second() : second;

		return firstEvaluation && secondEvaluation;
	}

	public static OR(first: Condition, second: Condition): Condition {
		const firstEvaluation = isFunction(first) ? first() : first;
		const secondEvaluation = isFunction(second) ? second() : second;

		return firstEvaluation || secondEvaluation;
	}

	public static NOT(value: Condition): Condition {
		const evaluation = isFunction(value) ? value() : value;

		return !evaluation;
	}

	public static NAND(first: Condition, second: Condition): Condition {
		const firstEvaluation = isFunction(first) ? first() : first;
		const secondEvaluation = isFunction(second) ? second() : second;

		return !(firstEvaluation && secondEvaluation);
	}

	public static NOR(first: Condition, second: Condition): Condition {
		const firstEvaluation = isFunction(first) ? first() : first;
		const secondEvaluation = isFunction(second) ? second() : second;

		return !(firstEvaluation || secondEvaluation);
	}

	public static XOR(first: Condition, second: Condition): Condition {
		const firstEvaluation = isFunction(first) ? first() : first;
		const secondEvaluation = isFunction(second) ? second() : second;

		return (firstEvaluation || secondEvaluation) && !(firstEvaluation && secondEvaluation);
	}

	public static XNOR(first: Condition, second: Condition): Condition {
		const firstEvaluation = isFunction(first) ? first() : first;
		const secondEvaluation = isFunction(second) ? second() : second;

		return firstEvaluation === secondEvaluation;
	}

	public static create(func: ConditionCallback) {
		return func;
	}
}
