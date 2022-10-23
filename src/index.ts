import { Manifest } from "./lib/types/manifest";
import { NetworkConfig } from "./lib/types/network";

export enum Protocol {
	/** Create/Load Online User Data */
	CLOUD = "CLOUD",
	LCTRL = "LCTRL",
	NET = "NET",
}

interface DefaultUserData {

}

namespace Tina {
	export function registerGame(name: string, manifest: Manifest) {
		return new TinaGame();
	}

	export class TinaGame {
		core() {

		}
	}

	export namespace Mirror {
		export class User {
			constructor(id: number) {
			}

			static fromPlayer(plr: Player) {
				return new User(plr.UserId);
			}

			load() {

			}

			unload() {

			}
		}
	}

	export namespace Net {
		class Endpoint {

		}

		export class NetworkProtocol {

		}

		export function protocol(protocol: Protocol, tree?: unknown): NetworkProtocol {
			return new NetworkProtocol();
		}

		export function registerNetwork(tree: { [key: string]: NetworkProtocol }) {

		}

		export function endpoint<T>() {

		}
	}
}

export default Tina;