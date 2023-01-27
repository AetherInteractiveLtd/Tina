import { CrossBoundaryState } from "./cross-boundary-state";

export class PlayerState<T> extends CrossBoundaryState {
	constructor(initialValue: T, remote: RemoteEvent) {
		super();
	}
}
