type TCondition = (() => boolean) | boolean;

function isAFunction(func: TCondition): func is Callback {
	return typeOf(func) === "function";
}

export class X {
	public static eval(condition: TCondition): boolean {
		return isAFunction(condition) ? condition() : condition;
	}

	public static and(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return firstEvaluation && secondEvaluation;
	}

	public static or(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return firstEvaluation || secondEvaluation;
	}

	public static not(value: TCondition): TCondition {
		const evaluation = isAFunction(value) ? value() : value;

		return !evaluation;
	}

	public static nand(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return !(firstEvaluation && secondEvaluation);
	}

	public static nor(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return !(firstEvaluation || secondEvaluation);
	}

	public static xor(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return (firstEvaluation || secondEvaluation) && !(firstEvaluation && secondEvaluation);
	}

	public static xnor(first: TCondition, second: TCondition): TCondition {
		const firstEvaluation = isAFunction(first) ? first() : first;
		const secondEvaluation = isAFunction(second) ? second() : second;

		return firstEvaluation === secondEvaluation;
	}
}
