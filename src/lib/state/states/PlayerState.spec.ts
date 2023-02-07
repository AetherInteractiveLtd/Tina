/// <reference types="@rbxts/testez/globals" />

import { NetworkEvent } from "../network/NetworkEvent";
import { NetworkSimulationEvent } from "../network/NetworkSimulationEvent";
import { NetworkBoundary } from "../types";
import { PlayerState } from "./PlayerState";

const TestPlayer = {} as Player;

export = () => {
	describe("PlayerState", () => {
		let event: NetworkEvent;
		beforeEach(() => {
			event = new NetworkSimulationEvent();
		});

		function makePlayerState<T>(value: T, boundary: NetworkBoundary): PlayerState<T> {
			return new PlayerState("who cares", value, event, boundary);
		}

		it("Should initialise PlayerValue", () => {
			expect(() => {
				makePlayerState(0, NetworkBoundary.Server);
			}).never.to.throw();
		});

		it("Should create a value for each player that joins on the server", () => {
			const state = makePlayerState(0, NetworkBoundary.Server);

			expect(state.getValue(TestPlayer)).to.equal(0);
		});

		it("Should only be able to update the value from the server", () => {
			const clientState = makePlayerState(0, NetworkBoundary.Client);

			expect(() => {
				clientState.set(TestPlayer, 1080);
			}).to.throw();
		});

		it("Should replicate the value to the client", () => {
			const serverState = makePlayerState(0, NetworkBoundary.Server);
			const clientState = makePlayerState(0, NetworkBoundary.Client);

			serverState.set(TestPlayer, 1080);

			expect(clientState.getValue(TestPlayer)).to.equal(1080);
		});

		it("Should update subscribers on value change", () => {
			const serverState = makePlayerState(0, NetworkBoundary.Server);

			let value = 0;
<<<<<<< HEAD
<<<<<<< HEAD
			serverState.when(TestPlayer, currentValue => {
=======
			serverState.subscribe(TestPlayer, currentValue => {
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
=======
			serverState.when(TestPlayer, currentValue => {
>>>>>>> 2da8b3a (Rename .subscribe to .when on State)
				value = currentValue;
			});

			serverState.set(TestPlayer, 80808989);
			expect(value).to.equal(80808989);
		});
	});
};
