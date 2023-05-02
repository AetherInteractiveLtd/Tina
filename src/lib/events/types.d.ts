import { Condition } from "../conditions/types";
import { EAction } from ".";

export declare type ArrayOrNever<T> = T extends Array<unknown> ? T : never;

export declare type CondFunc = [Condition, EAction.COND];
export declare type StepFunc = [Callback, EAction.DO];

export declare type EventNode =
	| {
			value: CondFunc | StepFunc;
			next: EventNode;
	  }
	| undefined;

export interface Default {
	_default: Array<unknown>;
}
