import { EventListener } from "../../events";
import { FunctionUtil } from "../../util/functions";
import { StateSetter } from "../types";
import { LocalStateImplementation } from "./types";

export class LocalState<T = unknown> implements LocalStateImplementation<T> {
	private readonly subscription = new EventListener<[T]>();

	private value: T;

	constructor(initialValue: StateSetter<T>) {
		this.value = FunctionUtil.isFunction(initialValue) ? initialValue() : initialValue;
	}

	public subscribe(): EventListener<[T]> {
		return this.subscription;
	}

	public set(setter: StateSetter<T>): void {
		if (FunctionUtil.isFunction(setter)) {
			this.value = setter(this.value);
		} else {
			this.value = setter;
		}

		return void this.subscription.call(this.value);
	}

	public get(): T {
		return this.value;
	}
}
