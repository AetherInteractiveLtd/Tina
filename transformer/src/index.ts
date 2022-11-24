import ts from "typescript";

import { ITransformerConfiguration, Transform } from "./other/transformer";
import { Logger } from "./other/logger";

import { transformYaml } from "./transformer/transformYaml";

export default function transform(program: ts.Program, userConfiguration: ITransformerConfiguration) {
	const logger = new Logger(true);

	return (context: ts.TransformationContext): ((file: ts.SourceFile) => ts.Node) => {
		const transformer = new Transform(program, context, logger, userConfiguration);
		transformYaml(transformer);

		return (file: ts.SourceFile) => file;
	};
}
