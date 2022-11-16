/**
 * TODO: Add server/client differentation, yeah I know this should have made from the very first start, but lol,
 * that will take a bit of my brain, but i already got something planned out for this.
 */

import { BaseEvent } from "../types";

export declare enum EAction {
	COND = "condition",
	DO = "do",
}

function isAFunction(func: (() => boolean) | boolean): func is Callback {
	return typeOf(func) === "function";
}

export class RemoteClass<T extends unknown[]> implements BaseEvent<T> {
	protected listeners: Array<[Callback | boolean, EAction]> = new Array();

	public do<X>(func: (...args: [...T]) => X): BaseEvent<[X]> {
		this.listeners.push([func, EAction.DO]);

		return this as unknown as BaseEvent<[X]>;
	}

	public condition<X extends () => boolean | boolean>(condition: X): BaseEvent<T> {
		this.listeners.push([condition, EAction.COND]);

		return this as unknown as BaseEvent<T>;
	}

	/**
	 * TODO: when() should denote the creation of a brother node of listeners which will run asynchronously when required.
	 *
	 * Maybe here the differentation between contexts can be done?
	 *
	 * @returns same object, for chaing.
	 */
	public when(): BaseEvent<T> {
		return this as unknown as BaseEvent<T>;
	}

	/** @hidden */
	public _call<X extends unknown[]>(iteration = 0, conditionPassed?: boolean, ...args: X): X | void {
		if (iteration >= this.listeners.size()) return;

		const [handlerOrCondition, action] = this.listeners[iteration];

		if (action === EAction.COND) {
			this._call(
				iteration + 1,
				isAFunction(handlerOrCondition) ? handlerOrCondition() : handlerOrCondition,
				...args,
			);
		} else if (action === EAction.DO) {
			if (conditionPassed) {
				this._call(
					iteration + 1,
					conditionPassed,
					isAFunction(handlerOrCondition) && [...handlerOrCondition()],
				);
			}
		}
	}
}
