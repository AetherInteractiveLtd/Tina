import { ReplicatedStorage } from "@rbxts/services";
import TestEZ from "@rbxts/testez";

try {
TestEZ.TestBootstrap.run([ReplicatedStorage.Package]); // Run tests
} catch (e) {}
