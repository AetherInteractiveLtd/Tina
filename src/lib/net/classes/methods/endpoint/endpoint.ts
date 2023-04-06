import { Identifiers } from "../../../util/identifiers";
import { AbstractEndpointImplementation } from "./types";

export abstract class AbstractEndpoint implements AbstractEndpointImplementation {
	protected readonly id: string;

	constructor() {
		this.id = Identifiers.create();
	}

	public getIdentifier(): string | undefined {
		return Identifiers.decompress(this.id!);
	}
}
