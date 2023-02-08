import { Condition } from "../conditions/types";
import { EAction } from ".";

export declare type CondFunc = [Condition, EAction.COND];
export declare type StepFunc = [Callback, EAction.DO];

export declare type EventNode = {
	value: CondFunc | StepFunc;
	_next: EventNode;
};
