import { ReplicatedStorage } from "@rbxts/services";
import TestEZ from "@rbxts/testez";

<<<<<<< HEAD
TestEZ.TestBootstrap.run([ReplicatedStorage.Package]); // Run tests
=======
const { TestBootstrap } = require(game.GetService("ReplicatedStorage").include.node_modules["@rbxts"].testez
	.src) as TestEZ;
TestBootstrap.run([game.GetService("ReplicatedStorage").Package]); // Run tests
>>>>>>> 4b317f2 (moved Package to ReplicatedStorage so it can be accessed on client and server)
