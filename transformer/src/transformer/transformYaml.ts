import path from "path";

import { Transform } from "../other/transformer";

export function transformYaml(transformer: Transform): void {
	if (process.argv.includes("--verbose")) {
		transformer.logger.writeLine("verbose mode is on.");
	}

	{
		/**
		 * Build of the tina.project.yml file.
		 */
		transformer.transformYamlFile(
			`${path.resolve(transformer.srcDir, "..")}/tina.project.yml`,
			path.resolve(transformer.srcDir, ".."),
			transformer.config.compilation.to,
		);
	}

	transformer.logger.writeLine("starting yaml files compilation...");
	transformer.transformYamls();
	transformer.logger.writeLine("compilation completed successfully.");
}
