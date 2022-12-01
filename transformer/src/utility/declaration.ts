import fs from "fs";
import path from "path";

import { Project } from "ts-morph";

import { yamlToJsonString } from "./jsonFormat";

export async function constructDeclarationFile(
	project: Project,
	file: string,
	{ to, from }: { to: string; from: string },
): Promise<void> {
	const ext = path.extname(file);
	const name = path.basename(file, ext);

	const stringifiedJson = yamlToJsonString(file, true);
	const defaultExportedJson = `export const ${name.split(".")[0]} = ${stringifiedJson};`;

	project.createSourceFile(file.replace(".yml", ".ts"), defaultExportedJson, { overwrite: true });
	await project.emit();

	fs.renameSync(`${from}/${name}.d.ts`, `${to}/${name}.d.ts`);
}
