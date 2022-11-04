type TConditionCallback = () => boolean;

export class Conditions {
	public static eval(condition: TConditionCallback): boolean {
		return condition();
	}

	public static and(first: TConditionCallback, second: TConditionCallback): TConditionCallback {
		const firstEvaluation = first(),
			secondEvaluation = second();

		return () => firstEvaluation && secondEvaluation;
	}

	public static or(first: TConditionCallback, second: TConditionCallback): TConditionCallback {
		const firstEvaluation = first(),
			secondEvaluation = second();

		return () => firstEvaluation || secondEvaluation;
	}

	public static nand(first: TConditionCallback, second: TConditionCallback): TConditionCallback {
		const firstEvaluation = first(),
			secondEvaluation = second();

		return () => !(firstEvaluation && secondEvaluation);
	}

	public static nor(first: TConditionCallback, second: TConditionCallback): TConditionCallback {
		const firstEvaluation = first(),
			secondEvaluation = second();

		return () => !(firstEvaluation || secondEvaluation);
	}

	public static xor(first: TConditionCallback, second: TConditionCallback): TConditionCallback {
		const firstEvaluation = first(),
			secondEvaluation = second();

		return () => (firstEvaluation || secondEvaluation) && !(firstEvaluation && secondEvaluation);
	}

	public static xnor(first: TConditionCallback, second: TConditionCallback): TConditionCallback {
		const firstEvaluation = first(),
			secondEvaluation = second();

		return () => firstEvaluation === secondEvaluation;
	}
}
