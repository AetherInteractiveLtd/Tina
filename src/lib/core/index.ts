import Tina, { User } from "../..";
import { EventEmitter } from "../events";

interface CoreEvents {
	"player:added": (player: never) => void;
}

class TinaCore extends EventEmitter<CoreEvents> {}

const c = new TinaCore();

c.when("player:added").do((player: User) => {});

export default TinaCore;
