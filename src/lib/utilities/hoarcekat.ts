import { RunService } from "@rbxts/services";

/**
 * There isn't a reliable way to get Hoarcekat's preview window from a Roact component, so
 * instead we will get it from the PluginGuiService since the structure is always the same (for this version).
 * @returns Preview frame for Hoarcekat
 */
function findHoarcekatFrame(): Frame | undefined {
	return game
		.FindFirstChild("PluginGuiService")
		?.FindFirstChild("Hoarcekat")
		?.FindFirstChild("Hoarcekat")
		?.FindFirstChild("Preview")
		?.FindFirstChild("Preview")
		?.FindFirstChild("Preview") as Frame;
}

// Store these values for later rather than evaluating with every new modal
export const hoarcekatFrame = RunService.IsRunning() ? undefined : findHoarcekatFrame();

/**
 * Gets the AbsolutePosition of a frame. If the Hoarcekat preview window has been found then the position
 * will be offset such that the top left of the preview frame is at (0, 0).
 * @param guiObject GuiObject
 * @returns The position of the frame relative to the Hoarcekat preview frame
 */
export function getAbsolutePosition(guiObject: GuiObject): Vector2 {
	const hoarcekatOffset = hoarcekatFrame ? hoarcekatFrame.AbsolutePosition : Vector2.zero;
	return guiObject.AbsolutePosition.sub(hoarcekatOffset);
}
