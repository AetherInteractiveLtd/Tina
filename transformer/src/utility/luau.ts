import fs from "fs";
import path from "path";

import { yamlToJsonString } from "./jsonFormat";

import manifest from "../manifest.json";

function recursiveConstructLuaSyntax(jsonObj: string | number | boolean | [] | { [x: string]: any }) {
	const typeOf = typeof jsonObj;

	if (typeOf === "string") {
		return `"${(jsonObj as string).replaceAll(/"/g, '\\"')}"`;
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

export function constructLuauFile(file: string, { to }: { to: string }) {
	const ext = path.extname(file);
	const name = path.basename(file, ext);

	const jsonObject = yamlToJsonString(file, false);
	const generatedLuauObject = recursiveConstructLuaSyntax(jsonObject as { [x: string]: any });

	const luauString = `-- compiled by yaml-to-dts
-- version ${manifest.version}

return {
	["${name.split(".")[0]}"] = ${generatedLuauObject}
}`;

	fs.writeFileSync(`${to}/${name}.lua`, luauString);
}
