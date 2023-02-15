import Roact from "@rbxts/roact";

import { Console } from "./Console";

export function renderTinaInternalUI(parent: Instance): () => void {
	const tree = Roact.mount(<Console />, parent);

	return () => {
		Roact.unmount(tree);
	};
}
