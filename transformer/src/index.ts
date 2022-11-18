import ts from "typescript";

import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

import colors from "colors";
import { Project } from "ts-morph";

import manifest from "./manifest.json";

/* Constants definitions */
const rootFolder = path.join(__dirname, "..", "..", "..");
const folderToLookup = path.join(rootFolder, "src", "config");
const configFolder = path.join(rootFolder, "src", "shared", "config");

const targetExtensions = [".yml", ".yaml"];

const hasDir: (dir: string) => boolean = (dir) => fs.existsSync(dir);
const createDir: (dir: string) => void = (dir) => fs.mkdirSync(dir);

/* Project declaration */
const project = new Project({ compilerOptions: { declaration: true, emitDeclarationOnly: true } });

/**
 * recursiveConstructLuaSyntax helps to build a string dictionary out from a JSON/JS object.
 *
 * @param jsonObj as {[x: string]: any}, it should be the object to transform, preferibly being of a JSON format.
 * @returns the final Luau table key-value dictionary.
 */
function recursiveConstructLuaSyntax(jsonObj: string | number | boolean | [] | { [x: string]: any }) {
	const typeOf = typeof jsonObj;

	if (typeOf === "string") {
		return (jsonObj as string).replaceAll(/"/g, '\\"');
	} else if (typeOf === "number" || typeOf === "boolean") {
		return jsonObj;
	} else if (Array.isArray(jsonObj)) {
		if (jsonObj.length) {
			(jsonObj as []).map((value, index) => (jsonObj[index] = recursiveConstructLuaSyntax(value)));

			return `{${(jsonObj as []).join(", ")}}`;
		}
	}

	/* For dictionaries */
	let dictString = `{`;

	for (const key of Object.keys(jsonObj)) {
		dictString += `["${key}"] = ${recursiveConstructLuaSyntax((jsonObj as { [x: string]: any })[key])},`;
	}

	dictString += "}";

	return dictString;
}

/**
 * warn is a function that let us write out data for debugging purposes, it does it with a yellow text to easily identify it.
 *
 * @param message as string, it should denote the message to be warned out.
 */
function warn(message: any) {
	process.stdout.write(`[tina-yml-transformer]: ${colors.yellow(message as string)})\n`);
}

/**
 * genJsonStringFromYaml returns a json format stringified.
 *
 * @param file as string, should denote the file to where the yaml will be read from. Should be .yaml or .yml extension.
 * @returns stringified JSON format from the yaml read-on
 */
function genJsonStringFromYaml(file: string, stringify?: boolean) {
	const yamlFile = fs.readFileSync(file, { encoding: "utf-8" });
	return stringify ? JSON.stringify(yaml.load(yamlFile), undefined, 2) : yaml.load(yamlFile);
}

/**
 * genLuauFile generates a new Lua file that can be imported later on with their respective declaration file (.d.ts).
 *
 * @param file as a string, it should denote the file path from where to replace the file.
 * @param outDir as a string, it should denote the out directory path.
 */
function genLuauFile(file: string, outDir?: string) {
	const ext = path.extname(file);
	const name = path.basename(file, ext);

	const jsonObject = genJsonStringFromYaml(file, false);
	const generatedLuauObject = recursiveConstructLuaSyntax(jsonObject as { [x: string]: any });

	const luauString = `-- compiled by yaml-to-dts
-- version ${manifest.version}

return {
	${name} = ${generatedLuauObject}
}`;

	fs.writeFileSync(outDir?.replace(".yml", ".lua") as string, luauString);
}

/**
 * generateDeclarationFile is the main function that helps us build declaration files from
 *
 * @param file as string, should denote the file name, such as test.yml or test.yaml.
 */
async function genDeclarationFile(file: string, outDir?: string) {
	const ext = path.extname(file);
	const name = path.basename(file, ext);

	const stringifiedJson = genJsonStringFromYaml(file, true);
	const defaultExportedJson = `export const ${name} = ${stringifiedJson};`;

	project.createSourceFile(file.replace(".yml", ".ts"), defaultExportedJson, { overwrite: true });
	await project.emit();

	fs.renameSync(`${folderToLookup}/${name}.d.ts`, outDir?.replace(".yml", ".d.ts") as string);
}

/**
 * directoryVisitor is the main core function that converts Luau files and their respective .d.ts files from a .yaml (configuration) file.
 *
 * @param directory as string, should denote the directory where it should be looking to.
 * @param directoryTo as string, should denote the direction where it will compile to, used to compare whether it has the folders/directories as in source.
 */
function directoryVisitor(directory: string, directoryTo: string = configFolder) {
	if (!fs.existsSync(directoryTo)) fs.mkdirSync(directoryTo);

	for (const child of fs.readdirSync(directory)) {
		const realPath = path.join(folderToLookup, child);

		const stat = fs.statSync(realPath);
		const isDirectory = stat.isDirectory() ?? false;
		const directoryToChild = `${directoryTo}/${child}`;

		if (isDirectory) {
			directoryVisitor(realPath, directoryToChild);
		} else {
			const ext = path.extname(child);

			if (targetExtensions.some((extName) => extName === ext)) {
				genDeclarationFile(realPath, directoryToChild);
				genLuauFile(realPath, directoryToChild);
			}
		}
	}
}

/**
 * transform is the main transformer function, configuration can be specified.
 *
 * @param program as ts.Program, it is unused.
 * @param options as ts.CompilerOptions, not really used.
 * @returns callback for the sourcefile and context manager.
 */
export default function transform(program: ts.Program, options: ts.CompilerOptions) {
	if (!hasDir(configFolder)) createDir(configFolder);

	directoryVisitor(folderToLookup, configFolder);
}
