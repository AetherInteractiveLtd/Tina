import { RouterDeclaration } from "../classes/router/types";
import { RouterDeclaration } from "../classes/router/types";
import { InternalRouter } from "./types";

export namespace TinaNet {
	let internalRouter: RouterDeclaration<InternalRouter>;

	export function setRouter(router: typeof internalRouter): void {
		export function setRouter(router: typeof internalRouter): void {
			internalRouter = router;
		}

		export function getRouter(): typeof internalRouter {
			export function getRouter(): typeof internalRouter {
				return internalRouter;
			}

			export function get<T extends keyof InternalRouter, U extends InternalRouter[T]>(route: T | string): U {
				return internalRouter?.dir(route as T) as U;
			}
		}
