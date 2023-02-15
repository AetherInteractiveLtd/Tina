import { Logger } from "../logger";
import { renderTinaInternalUI } from ".";
import { ConsoleConfig } from "./Console";

export = function (parent: Instance): () => void {
	const unmount = renderTinaInternalUI(parent);

	ConsoleConfig.addReservedColor("CORE", Color3.fromRGB(255, 204, 51));

	const startupLog = Logger.scope("CORE").scope("startup");
	startupLog.info("Starting up 'My Cafe'");
	startupLog.debug("128 Packages initialized.");

	Logger.scope("TINA").info("Using @rbxts/tina@1.0.2");
	Logger.scope("TINA").info("Game Started.");
	Logger.scope("TINA").scope("NET").info("Networking successfully initialized.");
	Logger.scope("TINA").debug("12 Processes had successful first execution.");
	Logger.scope("TINA").error("2 Processes failed first execution.");

	return () => unmount();
};
