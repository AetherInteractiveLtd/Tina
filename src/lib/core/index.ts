import Tina from "../..";
import { EventEmitter } from "../events";

interface CoreEvents {
	"player:added": (player: never) => void;
}

class TinaCore extends EventEmitter<CoreEvents> {}

const c = new TinaCore();

c.when("player:added").do((player: Tina.Mirror.User) => {});

export default TinaCore;
