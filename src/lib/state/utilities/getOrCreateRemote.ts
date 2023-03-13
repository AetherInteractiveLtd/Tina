import { IS_CLIENT } from "../../util/globals";

function findRemoteClient(name: string, parent: Instance): RemoteEvent {
	const remote = parent.WaitForChild(name);
	assert(remote && remote.IsA("RemoteEvent"), `Unable to find {${name}} in parent`);
	return remote;
}

function createRemoteServer(name: string, parent: Instance): RemoteEvent {
	/* Check if it already exists */
	const child = parent.FindFirstChild(name);
	if (child && child.IsA("RemoteEvent")) return child;

	/* Doesn't exist so create new */
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
