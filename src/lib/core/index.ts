import { EventEmitter } from "../events";
import { DefaultUserDeclaration } from "../user/default/types";

interface CoreEvents {
	"player:added": (player: never) => void;
}

class TinaCore extends EventEmitter<CoreEvents> {}

const c = new TinaCore();

c.when("player:added").do((_player: DefaultUserDeclaration) => {});

export default TinaCore;
