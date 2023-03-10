import { Network } from "..";
import { Router } from "../classes/router";
import { RouterDeclaration } from "../classes/router/types";
import { Exposed, ExposedEndpoints, InternalEndpoints, Internals } from "./types";

export namespace TinaNet {
	let exposedRouter: RouterDeclaration<ExposedEndpoints>;
	let internalRouter: RouterDeclaration<InternalEndpoints>;

	export function setRouter<T extends "internal" | "exposed">(
		routerType: T,
		routerDesc: T extends "internal" ? InternalEndpoints : ExposedEndpoints,
	): void {
		if (routerType === "internal") {
			internalRouter = new Router(routerDesc as never) as never;
		} else {
			exposedRouter = new Router(routerDesc as never) as never;
		}
	}

	export function getRouter<T extends "internal" | "exposed">(
		routerType: T,
	): T extends "internal" ? typeof internalRouter : typeof exposedRouter {
		return (routerType === "internal" ? internalRouter : exposedRouter) as never;
	}

	export function getExposed<T extends keyof Exposed, U extends ExposedEndpoints[T]>(
		route: T,
	): U {
		return exposedRouter.dir(route as T) as never;
	}

	export function getInternal<T extends keyof Internals, U extends InternalEndpoints[T]>(
		route: T,
	): U {
		return internalRouter.dir(route as T) as never;
	}

	/**
	 * @hidden
	 */
	export function setupInternals(): void {
		TinaNet.setRouter("exposed", {
			"user:added": Network.Method.UPDATE<never>(),
			"user:removing": Network.Method.UPDATE<never>(),
		});

		TinaNet.setRouter("internal", {
			"user:get": Network.Method.GET<undefined, never>(),
		});
	}
}
