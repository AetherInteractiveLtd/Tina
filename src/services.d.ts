interface ReplicatedStorage extends Instance {
	include: { node_modules: { "@rbxts": { testez: { src: ModuleScript } } } };
}

interface ServerScriptService extends Instance {
	Package: Folder;
}
