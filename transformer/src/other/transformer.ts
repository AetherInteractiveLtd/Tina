import ts from "typescript";

import { Project } from "ts-morph";

import fs from "fs";
import path from "path";

import { Logger } from "./logger";
import { buildYamlFile, createDir, hasDir } from "../utility/dir";

export interface ITransformerConfiguration {
	compilation: {
		from: string;
		to: string;
	};
}

export class Transform {
	private readonly extensions = [".yml", ".yaml"];

	private readonly options = this.program.getCompilerOptions();
	private readonly project = new Project({ compilerOptions: { declaration: true, emitDeclarationOnly: true } });

	public readonly rootFolder = path.resolve(__dirname, "..", "..");
	public readonly srcDir = this.options.rootDir ?? this.program.getCurrentDirectory();

	public constructor(
		public readonly program: ts.Program,
		public readonly context: ts.TransformationContext,
		public readonly logger: Logger,
		public readonly config: ITransformerConfiguration,
	) {
		if (this.config.compilation.to === "") {
			const toDir = `${this.srcDir}/config/out`;

			if (!hasDir(toDir)) {
				try {
					createDir(toDir);
				} catch (e) {
					logger.error(e);
				}

				this.config.compilation.to = toDir;
			}
		}

		this.config.compilation.to = path.resolve(this.rootFolder, this.srcDir, this.config.compilation.to);

		if (this.config.compilation.from === "") {
			const fromDir = `${this.srcDir}/config/yaml`;

			if (!hasDir(fromDir)) {
				try {
					createDir(fromDir);
				} catch (e) {
					logger.error(e);
				}

				this.config.compilation.from = fromDir;
			}
		}

		this.config.compilation.from = path.resolve(this.rootFolder, this.srcDir, this.config.compilation.from);
	}

	public transformYamls(
		directoryFrom = this.config.compilation.from,
		directoryTo = this.config.compilation.to,
	): void {
		if (!hasDir(directoryTo)) createDir(directoryTo);

		for (const child of fs.readdirSync(directoryFrom)) {
			const realPath = path.join(directoryFrom, child);

			const stat = fs.statSync(realPath);
			const isDirectory = stat.isDirectory() ?? false;
			const directoryToChild = `${directoryTo}/${child}`;

			if (isDirectory) {
				this.transformYamls(realPath, directoryToChild);
			} else {
				const ext = path.extname(child);

				if (this.extensions.some((extName) => extName === ext)) {
					buildYamlFile(this.project, realPath, { from: directoryFrom, to: directoryTo }).catch((e) =>
						this.logger.error(e),
					);
				}
			}
		}
	}

	public transformYamlFile(path: string, from: string, to: string) {
		buildYamlFile(this.project, path, { from: from, to: to }).catch((e) => this.logger.error(e));
	}
}
