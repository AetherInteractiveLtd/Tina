import type TestEZ from "@rbxts/testez";

const { TestBootstrap } = require(game.GetService("ReplicatedStorage").include.node_modules["@rbxts"].testez
	.src) as TestEZ;
TestBootstrap.run([game.GetService("ServerScriptService").Package]); // Run tests
