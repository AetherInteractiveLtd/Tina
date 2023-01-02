import Tina from "../..";
import { EventEmitter } from "../events";
import { AbstractUser } from "../user/default";

interface CoreEvents {
	"player:added": (player: never) => void;
}

class TinaCore extends EventEmitter<CoreEvents> { }

const c = new TinaCore();

c.when("player:added").do((player: AbstractUser) => { });

export default TinaCore;
