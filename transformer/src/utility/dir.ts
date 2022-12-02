import fs from "fs";
import { Project } from "ts-morph";
import { ITransformerConfiguration } from "../other/transformer";

import { constructDeclarationFile } from "./declaration";
import { constructLuauFile } from "./luau";

export const hasDir: (dir: string) => boolean = (dir) => fs.existsSync(dir);
export const createDir: (dir: string) => void = (dir) => fs.mkdirSync(dir);

export async function buildYamlFile(
	project: Project,
	file: string,
	compilationInfo: ITransformerConfiguration["compilation"],
) {
	await constructDeclarationFile(project, file, compilationInfo);
	constructLuauFile(file, compilationInfo);
}
