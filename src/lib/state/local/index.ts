import { EventListener } from "../../events";
import { FunctionUtil } from "../../util/functions";
import { PartialStateSetter, StateSetter } from "../types";
import { LocalStateImplementation } from "./types";

export class LocalState<T extends object = object> implements LocalStateImplementation<T> {
	private readonly subscription = new EventListener<[T]>();

	private value: T;

	constructor(initialValue: StateSetter<T>) {
		this.value = FunctionUtil.isFunction(initialValue) ? initialValue() : initialValue;
	}

	public subscribe(): EventListener<[T]> {
		return this.subscription;
	}

	public set(setter: PartialStateSetter<T>): void {
		let value: Partial<T>;
		if (FunctionUtil.isFunction(setter)) {
			value = setter(this.value);
		} else {
			value = setter;
		}

		this.value = { ...this.value, ...value };

		return void this.subscription.call(this.value);
	}

	public get(): T {
		return this.value;
	}
}
