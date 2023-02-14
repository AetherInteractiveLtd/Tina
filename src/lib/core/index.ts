import Tina from "../..";
import { EventEmitter } from "../events";
import { DefaultUserDeclaration } from "../user/default/types";

interface CoreEvents {
	"player:added": (player: never) => void;
}

class TinaCore extends EventEmitter<CoreEvents> { }

const c = new TinaCore();

c.when("player:added").do((player: DefaultUserDeclaration) => { });

export default TinaCore;
