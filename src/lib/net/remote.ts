import { RunService } from "@rbxts/services";
import { ClientNet } from "./client";
import { Identifiers } from "./identifiers";
import { ServerNet } from "./server";

const isServer = RunService.IsServer();

export class remote {
	private identifier = "";
	constructor(name: string) {
		if (isServer) {
			this.identifier = Identifiers.createIdentifier(name);
		} else {
			this.identifier = Identifiers.waitForIdentifier(name);
		}
	}

	fire(...args: unknown[]) {
		if (isServer) {
			ServerNet.call(this.identifier, ...args);
		} else {
			ClientNet.call(this.identifier, ...args);
		}
	}

	listen(callback: (...args: unknown[]) => void) {
		if (isServer) {
			ServerNet.listen(this.identifier, callback);
		} else {
			ClientNet.listen(this.identifier, callback);
		}
	}

	waitFor(): unknown[] {
		if (isServer) {
			return ServerNet.waitFor(this.identifier);
		} else {
			return ClientNet.waitFor(this.identifier);
		}
	}
}
