import { IS_CLIENT } from "../../utilities/globals";
import { StateConfig } from "../schema/state-config";

function findRemoteClient(name: string, parent: Instance): RemoteEvent {
	const remote = parent.WaitForChild(name);
	assert(remote && remote.IsA("RemoteEvent"), `Unable to find {${name}} in parent`);
	return remote;
}

function createRemoteServer(name: string, parent: Instance): RemoteEvent {
	const remote = new Instance("RemoteEvent");
	remote.Name = name;
	remote.Parent = parent;
	return remote;
}

export function getOrCreateRemote(name: string, parent: Instance): RemoteEvent {
	if (IS_CLIENT) {
		return findRemoteClient(name, parent);
	}
	return createRemoteServer(name, parent);
}

export function isStateConfig(value: unknown): value is StateConfig<unknown> {
	return value instanceof StateConfig;
}
