import Roact from "@rbxts/roact";
import { Div } from "@rbxts/rowind-mini";

export = function (parent: Instance) {
	const UI = (
		<Div className="bg-gray-800 w-100% h-100%">
			<Div className="bg-gray-700 w-100% h-12% flex-left"></Div>
		</Div>
	);

	const MountedUI = Roact.mount(UI, parent);

	return function () {
		Roact.unmount(MountedUI);
	};
};
