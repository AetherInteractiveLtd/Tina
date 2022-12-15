import { FunctionUtil } from "../utilities/functions";
import { Condition, ConditionCallback } from "./types";

export class COND {
	public static create(callback: ConditionCallback): typeof callback {
		return callback;
	}

	public static eval<T extends Array<unknown>>(condition: Condition<T>, ...args: T): boolean {
		return FunctionUtil.isFunction(condition) ? condition(...args) : condition;
	}

	public static AND(first: Condition, second: Condition): Condition {
		const firstEvaluation = FunctionUtil.isFunction(first) ? first() : first;
		const secondEvaluation = FunctionUtil.isFunction(second) ? second() : second;

		return firstEvaluation && secondEvaluation;
	}

	public static OR(first: Condition, second: Condition): Condition {
		const firstEvaluation = FunctionUtil.isFunction(first) ? first() : first;
		const secondEvaluation = FunctionUtil.isFunction(second) ? second() : second;

		return firstEvaluation || secondEvaluation;
	}

	public static NOT(value: Condition): Condition {
		const evaluation = FunctionUtil.isFunction(value) ? value() : value;

		return !evaluation;
	}

	public static NAND(first: Condition, second: Condition): Condition {
		const firstEvaluation = FunctionUtil.isFunction(first) ? first() : first;
		const secondEvaluation = FunctionUtil.isFunction(second) ? second() : second;

		return !(firstEvaluation && secondEvaluation);
	}

	public static NOR(first: Condition, second: Condition): Condition {
		const firstEvaluation = FunctionUtil.isFunction(first) ? first() : first;
		const secondEvaluation = FunctionUtil.isFunction(second) ? second() : second;

		return !(firstEvaluation || secondEvaluation);
	}

	public static XOR(first: Condition, second: Condition): Condition {
		const firstEvaluation = FunctionUtil.isFunction(first) ? first() : first;
		const secondEvaluation = FunctionUtil.isFunction(second) ? second() : second;

		return (firstEvaluation || secondEvaluation) && !(firstEvaluation && secondEvaluation);
	}

	public static XNOR(first: Condition, second: Condition): Condition {
		const firstEvaluation = FunctionUtil.isFunction(first) ? first() : first;
		const secondEvaluation = FunctionUtil.isFunction(second) ? second() : second;

		return firstEvaluation === secondEvaluation;
	}
}
