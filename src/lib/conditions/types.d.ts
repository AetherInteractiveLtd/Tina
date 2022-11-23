export declare type Condition = ConditionCallback | boolean;
export declare type ConditionCallback = (...args: unknown[]) => boolean; // Being able to take arguments opens the possibility for events chaining to pass before-data to the condition itself.
