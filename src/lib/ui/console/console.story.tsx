import Roact from "@rbxts/roact";

export = function (parent: Instance) {
	const UI = (
		<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={new Color3(0.23, 0.22, 0.22)} BorderSizePixel={0}></frame>
	);

	const MountedUI = Roact.mount(UI, parent);

	return function () {
		Roact.unmount(MountedUI);
	};
};
