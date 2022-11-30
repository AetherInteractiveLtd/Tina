export declare type Condition<T extends unknown[] = unknown[]> = ConditionCallback<T> | boolean;
export declare type ConditionCallback<T extends unknown[] = unknown[]> = (...args: [...T]) => boolean; // Being able to take arguments opens the possibility for events chaining to pass before-data to the condition itself.
