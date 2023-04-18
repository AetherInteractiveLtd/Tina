import { RunService } from "@rbxts/services";

import { EventListener } from "../../../events";
import { Internals } from "../../../net/internal";
import { FunctionUtil } from "../../../util/functions";
import { StateSetter } from "../../types";
import { GlobalStateImplementation } from "./types";

export class GlobalState<T = unknown> implements GlobalStateImplementation<T> {
	private readonly isServer = RunService.IsServer();

	private readonly subscription = new EventListener<[T]>();
	private readonly replicator = new EventListener<[T]>();

	private value: T;

	constructor(public readonly name: string, initialValue: StateSetter<T>) {
		this.value = FunctionUtil.isFunction(initialValue) ? initialValue() : initialValue;

		if (!this.isServer) {
			Internals.when("state:replicated").do(({ stateName, value }) => {
				if (stateName !== name) return;
				this.value = value as T;

				void this.subscription.call(value);
			});
		} else {
			this.replicator.do((value: T) => {
				return void Internals.updateAll("state:replicated", { stateName: name, value });
			});
		}
	}

	public subscribe(): EventListener<[T]> {
		return this.subscription;
	}

	public set(setter: StateSetter<T>): void {
		if (!this.isServer) {
			throw `[GlobalState:Client]: State can only be set from the server.`;
		}

		if (FunctionUtil.isFunction(setter)) {
			this.value = setter(this.value);
		} else {
			this.value = setter;
		}

		void this.subscription.call(this.value);
		return void this.replicator.call(this.value);
	}

	public get(): T {
		return this.value;
	}
}
