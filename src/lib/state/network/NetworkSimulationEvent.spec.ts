/// <reference types="@rbxts/testez/globals" />

import { NetworkSimulationEvent } from "./NetworkSimulationEvent";

export = () => {
	describe("NetworkSimulationEvent", () => {
		it("Should fire client listeners", () => {
			const event = new NetworkSimulationEvent();

			let clientCount = 0;
			event.onClientEvent(() => clientCount++);
			event.fireClient(undefined!);

			expect(clientCount).to.equal(1);
		});

		it("Should fire server listeners", () => {
			const event = new NetworkSimulationEvent();

			let serverCount = 0;
			event.onServerEvent(() => serverCount++);
			event.fireServer(undefined!);

			expect(serverCount).to.equal(1);
		});

		it("Should mimic server/client boundary", () => {
			const event = new NetworkSimulationEvent();

			let serverCount = 0;
			let clientCount = 0;
			event.onClientEvent(() => clientCount++);
			event.onServerEvent(() => serverCount++);

			event.fireClient(undefined!);
			event.fireServer();
			event.fireServer();

			expect(clientCount).to.equal(1);
			expect(serverCount).to.equal(2);
		});

		it("Should pass arguments through to subscribers", () => {
			const event = new NetworkSimulationEvent();
			const receivedValues: Array<defined> = [];

			event.onClientEvent((...args) => {
				for (const element of args as Array<defined>) {
					receivedValues.push(element);
				}
			});

			event.fireClient(undefined!, 777, false);

			expect(receivedValues[0]).to.equal(777);
			expect(receivedValues[1]).to.equal(false);
		});
	});
};
