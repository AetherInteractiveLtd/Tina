import fs from "fs";
import * as yaml from "js-yaml";

export function yamlToJsonString(file: string, stringify?: boolean) {
	const yamlFile = fs.readFileSync(file, { encoding: "utf-8" });
	return stringify ? JSON.stringify(yaml.load(yamlFile), undefined, 2) : yaml.load(yamlFile);
}
