import { GETClientObjectDeclaration, GETServerObjectDeclaration } from "./getTypes";

export class GetEndpointServer<T extends Callback> implements GETServerObjectDeclaration<T> {
	reply<X extends ReturnType<T>>(func: (user: never, ...args: Parameters<T>) => X): void {}
}

export class GetEndpointClient<T extends unknown[]> implements GETClientObjectDeclaration<T> {
	do<X extends T>(func: (...args: T) => X): GETClientObjectDeclaration<X> {
		return this as unknown as GETClientObjectDeclaration<X>;
	}
}
