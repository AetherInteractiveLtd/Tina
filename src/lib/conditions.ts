type TCondition = (() => boolean) | boolean;

function isAFunction(func: TCondition): func is Callback {
	return typeOf(func) === "function";
}

export class X {
	public static EVAL(condition: TCondition): boolean {
		return isAFunction(condition) ? condition() : condition;
	}

	public static AND(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return firstEvaluation && secondEvaluation;
	}

	public static OR(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return firstEvaluation || secondEvaluation;
	}

	public static NOT(value: TCondition): TCondition {
		const evaluation = isAFunction(value) ? value() : value;

		return !evaluation;
	}

	public static NAND(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return !(firstEvaluation && secondEvaluation);
	}

	public static NOR(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return !(firstEvaluation || secondEvaluation);
	}

	public static XOR(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return (firstEvaluation || secondEvaluation) && !(firstEvaluation && secondEvaluation);
	}

	public static XNOR(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return firstEvaluation === secondEvaluation;
	}

	public create(func: TCondition) {
		return func;
	}
}
