export declare type Condition<T extends Array<unknown> = Array<unknown>> =
	| ConditionCallback<T>
	| boolean;
export declare type ConditionCallback<T extends Array<unknown> = Array<unknown>> = (
	...args: [...T]
) => boolean; // Being able to take arguments opens the possibility for events chaining to pass before-data to the condition itself.
