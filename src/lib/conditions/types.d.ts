export declare type Condition<T> =
	| ConditionCallback<T extends Array<unknown> ? T : [arg: T]>
	| boolean;

export declare type ConditionCallback<T extends Array<unknown> = Array<unknown>> = (
	...args: T
) => boolean;
