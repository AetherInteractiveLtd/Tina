import { Players } from "@rbxts/services";
import { User } from "../user";

import { EventEmitter } from "../events";

interface CoreEvents {
	"player:added": (player: never) => void;
}

class TinaCore extends EventEmitter<CoreEvents> {
	constructor() {
		super();
		this.prepareEvents();
	}

	private prepareEvents() {
		Players.PlayerAdded.Connect((plr) => {
			const user = User.get(plr);
			this.emit("player:added", user as never);
		});
	}
}

export default TinaCore;
