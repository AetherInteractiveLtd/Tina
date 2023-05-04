/**
 * General interface that all states share for their replication/subscriptions.
 */
export declare interface StateEventEmitter<T> {
	_default: [T];
}

export declare interface PlayerStateEventEmitter<T> {
	_default: [Player, T];
}

/**
 * Valid types for changing/mutating state (callback or direct set).
 */
export declare type PartialStateSetter<T extends object> =
	| Partial<T>
	| ((oldValuue?: T) => Partial<T>);
export declare type StateSetter<T> = T | ((oldValue?: T) => T);

/**
 * Infers the type of setter depending on T, either if it's an object or any other type.
 */
export declare type InferredSetter<T> = T extends object ? PartialStateSetter<T> : StateSetter<T>;
