import { RouterDeclaration } from "../classes/types";
import { InternalRouter } from "./types";

export namespace TinaNet {
	let internalRouter: RouterDeclaration<InternalRouter>;

	export function setInternalRouter(router: typeof internalRouter): void {
		internalRouter = router;
	}

	export function getInternalRouter(): typeof internalRouter {
		return internalRouter;
	}

	export function getRoute<T extends keyof InternalRouter, U extends InternalRouter[T]>(route: T | string): U {
		return internalRouter?.get(route as T) as U;
	}
}
