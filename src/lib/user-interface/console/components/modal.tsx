import Roact, { Children, Portal } from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { Players, RunService } from "@rbxts/services";

/**
 * There isn't a reliable way to get Hoarcekat's preview window from a Roact component, so
 * instead we will get it from the PluginGuiService since the structure is always the same (for this version).
 * @returns Preview frame for Hoarcekat
 */
function findHoarcekatFrame(): Frame | undefined {
	const frame = game
		.FindFirstChild("PluginGuiService")
		?.FindFirstChild("Hoarcekat")
		?.FindFirstChild("Hoarcekat")
		?.FindFirstChild("Preview")
		?.FindFirstChild("Preview")
		?.FindFirstChild("Preview") as Frame;

	if (!frame) warn("Unable to find Hoarcekat preview window");
	return frame;
}

// Store these values for later rather than evaluating with every new modal
const isGameRunning = RunService.IsRunning();
const hoarcekatFrame = isGameRunning ? findHoarcekatFrame() : undefined;

/**
 * Modal which can be used with .story scripts. Generally a modal will be added directly to the PlayerGui, but
 * since .story scripts are ran inside studio PlayerGui won't exists. Instead, we'll parent the modal directly
 * to Hoarcekat's preview window, simulating a modal without running the game.
 *
 * This is not perfect as the AbsolutePosition of the preview window is about (154, 5) rather than (0, 0), so
 * the position may be skewed when positioning components absolutely. But it's better than the component erroring.
 */
const HoarcekatModal = withHooks((props) => {
	const parent = hoarcekatFrame;
	if (!parent) return <frame />;

	return (
		<Portal target={parent}>
			<frame Size={UDim2.fromScale(1, 1)} Transparency={1} ZIndex={10000}>
				{props[Children]}
			</frame>
		</Portal>
	);
});

/**
 * Modal which parents itself to the PlayerGui and renders children in a separate ScreenGui
 */
const GameRunningModal = withHooks((props) => {
	const playerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui")!;
	return (
		<Portal target={playerGui}>
			<screengui DisplayOrder={10000}>{props[Children]}</screengui>
		</Portal>
	);
});

const Modal = withHooks((props) => {
	return isGameRunning ? (
		<GameRunningModal>{props[Children]}</GameRunningModal>
	) : (
		<HoarcekatModal>{props[Children]}</HoarcekatModal>
	);
});

export default Modal;
