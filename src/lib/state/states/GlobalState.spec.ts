/// <reference types="@rbxts/testez/globals" />

import { NetworkEvent } from "../network/NetworkEvent";
import { NetworkSimulationEvent } from "../network/NetworkSimulationEvent";
import { NetworkBoundary } from "../types";
import { GlobalState } from "./GlobalState";

export = () => {
	describe("", () => {
		let event: NetworkEvent;
		beforeEach(() => {
			event = new NetworkSimulationEvent();
		});

		function makeGlobalState<T>(value: T, boundary: NetworkBoundary): GlobalState<T> {
			return new GlobalState("who cares", value, event, boundary);
		}

		it("Should initialise with a value", () => {
			const serverState = makeGlobalState("Gregor", NetworkBoundary.Server);
			const clientState = makeGlobalState("Gregor", NetworkBoundary.Client);

			expect(serverState.getValue()).to.equal("Gregor");
			expect(clientState.getValue()).to.equal("Gregor");
		});

		it("Should be able to update the value on the server", () => {
			const serverState = makeGlobalState("itrtg", NetworkBoundary.Server);
			serverState.set("ITRTG");

			expect(serverState.getValue()).to.equal("ITRTG");
		});

		it("Should replicate the value to the client", () => {
			const serverState = makeGlobalState("Planet Eater", NetworkBoundary.Server);
			const clientState = makeGlobalState("Planet Eater", NetworkBoundary.Client);
			serverState.set("Dead");

			expect(clientState.getValue()).to.equal("Dead");
		});

		it("Should update subscribers on value change", () => {
			const serverState = makeGlobalState(66, NetworkBoundary.Server);
			const clientState = makeGlobalState(66, NetworkBoundary.Client);

			let serverValue: number | undefined;
			serverState.when(v => {
				serverValue = v;
			});

			let clientValue: number | undefined;
			clientState.when(v => {
				clientValue = v;
			});

			serverState.set(78);

			expect(serverValue).to.equal(78);
			expect(clientValue).to.equal(78);
		});
	});
};
