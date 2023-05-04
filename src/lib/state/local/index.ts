import { t } from "@rbxts/t";

import { EventEmitter } from "../../events";
import { FunctionUtil } from "../../util/functions";
import { InferredSetter, StateEventEmitter } from "../types";
import { LocalStateImplementation } from "./types";

export class LocalState<T>
	extends EventEmitter<StateEventEmitter<T>>
	implements LocalStateImplementation<T>
{
	private value: T;

	constructor(initialValue?: InferredSetter<T>) {
		super();

		{
			this.value = FunctionUtil.isFunction(initialValue) ? initialValue() : initialValue;
		}
	}

	public set(setter: InferredSetter<T>): void {
		if (FunctionUtil.isFunction(setter)) {
			this.value = setter(this.value);
		} else {
			if (t.table(setter)) {
				this.value = { ...this.value, ...setter };
			} else {
				this.value = setter as T;
			}
		}

		return void this.emit("_default", this.value);
	}

	public get(): T {
		return this.value;
	}
}
