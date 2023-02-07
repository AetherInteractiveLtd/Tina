/// <reference types="@rbxts/testez/globals" />

import { createReplicatedState, States } from "./createState";
import { NetworkEvent } from "./network/NetworkEvent";
import { NetworkSimulationEvent } from "./network/NetworkSimulationEvent";
import { GlobalState } from "./states/GlobalState";
import { PlayerState } from "./states/PlayerState";
import { NetworkBoundary } from "./types";

export = () => {
	describe("createState", () => {
		let remote: NetworkEvent;
		beforeEach(() => {
			remote = new NetworkSimulationEvent();
		});

		it("Should convert schema into GlobalState", () => {
			const result = createReplicatedState(
				{ health: States.GlobalState(100) },
				{ remote, boundary: NetworkBoundary.Server },
			);

			expect(result.health instanceof GlobalState).to.equal(true);
		});

		it("Should convert schema into PlayerState", () => {
			const result = createReplicatedState(
				{ health: States.PlayerState(100) },
				{ remote, boundary: NetworkBoundary.Server },
			);

			expect(result.health instanceof PlayerState).to.equal(true);
		});

		it("Should support nested schema", () => {
			const result = createReplicatedState(
				{ bonus: { duration: States.GlobalState(3600) } },
				{ remote, boundary: NetworkBoundary.Server },
			);

			expect(result.bonus.duration instanceof GlobalState).to.equal(true);
		});

		it("Should error if invalid schema is used", () => {
			expect(() => {
				createReplicatedState({ test: 100 }, { remote, boundary: NetworkBoundary.Server });
			}).to.throw();
		});

		it("Setting a GlobalState should only update its own state", () => {
			const schema = {
				value1: States.GlobalState("value1"),
				value2: States.GlobalState("value2"),
			};

			const serverState = createReplicatedState(schema, { remote, boundary: NetworkBoundary.Server });
			const clientState = createReplicatedState(schema, { remote, boundary: NetworkBoundary.Client });

			serverState.value1.set("updated value1");

			expect(serverState.value1.getValue()).to.equal("updated value1");
			expect(serverState.value2.getValue()).to.equal("value2");
			expect(clientState.value1.getValue()).to.equal("updated value1");
			expect(clientState.value2.getValue()).to.equal("value2");
		});

		it("Setting a PlayerState should only update its own state", () => {
			const player = {} as Player;
			const schema = {
				value1: States.PlayerState("value1"),
				value2: States.PlayerState("value2"),
			};

			const serverState = createReplicatedState(schema, { remote, boundary: NetworkBoundary.Server });
			const clientState = createReplicatedState(schema, { remote, boundary: NetworkBoundary.Client });
			serverState.value1.set(player, "updated value1");

			expect(serverState.value1.getValue(player)).to.equal("updated value1");
			expect(serverState.value2.getValue(player)).to.equal("value2");
			expect(clientState.value1.getValue(player)).to.equal("updated value1");
			expect(clientState.value2.getValue(player)).to.equal("value2");
		});
	});
};
