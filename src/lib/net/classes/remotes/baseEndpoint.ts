/**
 * TODO: Add server/client differentation, yeah I know this should have made from the very first start, but lol,
 * that will take a bit of my brain, but i already got something planned out for this.
 */

import { BaseEndpointObjectDeclaration } from "./types";

import { ConditionCallback } from "../../../conditions/types";

declare enum EAction {
	COND = "condition",
	DO = "do",
}

declare type FuncStep = [Callback, EAction.DO];
declare type CondStep = [ConditionCallback, EAction.COND];

export abstract class BaseEndpoint<T extends unknown[]> implements BaseEndpointObjectDeclaration<T> {
	protected listeners: Array<FuncStep | CondStep> = new Array();

	constructor(protected enviroment: string) {}

	public do<X>(func: (...args: [...T]) => X): BaseEndpointObjectDeclaration<[X]> {
		this.listeners.push([func, EAction.DO]);

		return this as unknown as BaseEndpointObjectDeclaration<[X]>;
	}

	public condition<X extends ConditionCallback>(condition: X): BaseEndpointObjectDeclaration<T> {
		this.listeners.push([condition, EAction.COND]);

		return this as unknown as BaseEndpointObjectDeclaration<T>;
	}

	/**
	 * TODO: when() should denote the creation of a brother node of listeners which will run asynchronously when required.
	 *
	 * Maybe here the differentation between contexts can be done?
	 *
	 * @returns same object, for chaing.
	 */
	public when(): BaseEndpointObjectDeclaration<T> {
		return this as unknown as BaseEndpointObjectDeclaration<T>;
	}

	/** @hidden */
	public _call<X extends unknown[]>(iteration = 0, conditionPassed?: boolean, ...args: X): X | void {
		if (iteration >= this.listeners.size()) return;

		const [handlerOrCondition, action] = this.listeners[iteration];

		if (action === EAction.COND) {
			this._call(iteration + 1, handlerOrCondition(), ...args);
		} else if (action === EAction.DO) {
			if (conditionPassed) {
				this._call(iteration + 1, conditionPassed, [...handlerOrCondition()]);
			}
		}
	}
}
