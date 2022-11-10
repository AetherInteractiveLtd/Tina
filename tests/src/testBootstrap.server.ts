import type TestEZ from "@rbxts/testez";

const { TestBootstrap } = require(game.GetService("ReplicatedStorage").rbxts_include.node_modules.testez.src) as TestEZ;
TestBootstrap.run([game.GetService("ServerScriptService").tests]); // Run tests
