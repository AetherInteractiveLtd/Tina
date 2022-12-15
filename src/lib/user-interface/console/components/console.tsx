import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

import Header from "./header";

const Console = withHooks(() => {
	return (
		<frame Size={new UDim2(1, 0, 1, 0)} Transparency={1}>
			<Header />
		</frame>
	);
});

export default Console;
