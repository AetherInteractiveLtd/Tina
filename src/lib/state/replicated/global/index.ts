import { RunService } from "@rbxts/services";
import { t } from "@rbxts/t";

import { EventEmitter } from "../../../events";
import { Internals } from "../../../net/internal";
import { InferredSetter } from "../../../state/types";
import { FunctionUtil } from "../../../util/functions";
import { StateEventEmitter } from "../../types";
import { GlobalStateImplementation } from "./types";

export class GlobalState<T>
	extends EventEmitter<StateEventEmitter<T>>
	implements GlobalStateImplementation<T>
{
	private value: T;

	constructor(public readonly id: number, initialValue?: InferredSetter<T>) {
		super();

		{
			this.value = FunctionUtil.isFunction(initialValue) ? initialValue() : initialValue;

			if (!RunService.IsServer()) {
				Internals.when("state:replicated").do(({ id: stateName, value }) => {
					if (stateName === id) {
						this.value = value as T;

						return void this.emit("_default", this.value);
					}
				});
			} else {
				this.when().do(value => {
					Internals.updateAll("state:replicated", { stateName: id, value });

					return value;
				});
			}
		}
	}

	public set(setter: InferredSetter<T>): void {
		if (!RunService.IsServer()) {
			throw "[GlobalState:Client]: State can only be set from the server.";
		}

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
