import Identifiers from "../../../utilities/identifiers";
import { AbstractEndpointImplementation } from "./types";

export abstract class AbstractEndpoint implements AbstractEndpointImplementation {
	protected readonly id: string;

	constructor() {
		this.id = Identifiers.create();
	}

	public getIdentifier(): string {
		return Identifiers.fromCompressed(this.id);
	}
}
