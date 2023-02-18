import { BaseEndpoints, EndpointsDeclaration } from "../../types";
import { RouterDeclaration } from "./types";

export class Router<T extends EndpointsDeclaration<BaseEndpoints>> implements RouterDeclaration<T> {
	constructor(public readonly endpoints: T) {}

	public dir<X extends keyof T>(path: X): T[X] {
		return this.endpoints[path];
	}
}
