import { RunService, ReplicatedStorage } from "@rbxts/services";

type TCompressedIdentifier = string;
type TFullIdentifier = string;

const identifierToCompressed: Map<TFullIdentifier, TCompressedIdentifier> = new Map();
const compressedToIdentifier: Map<TCompressedIdentifier, TFullIdentifier> = new Map();

let serialNums = 0;
let IdentifierFolder = undefined;
if (RunService.IsServer()) {
	IdentifierFolder = new Instance("Folder");
	IdentifierFolder.Parent = ReplicatedStorage;
} else {
	IdentifierFolder = ReplicatedStorage.WaitForChild("IdentifierFolder");

	IdentifierFolder.GetChildren().forEach((child) => {
		const value: StringValue = child as StringValue;
		identifierToCompressed.set(value.Name, value.Value);
		compressedToIdentifier.set(value.Value, value.Name);
	});

	IdentifierFolder.ChildAdded.Connect((child) => {
		const value: StringValue = child as StringValue;
		identifierToCompressed.set(value.Name, value.Value);
		compressedToIdentifier.set(value.Value, value.Name);
	});
	IdentifierFolder.ChildRemoved.Connect((child) => {
		const value: StringValue = child as StringValue;
		identifierToCompressed.delete(value.Name);
		compressedToIdentifier.delete(value.Value);
	});
}

export namespace Identifier {
	export function createIdentifier(identifierName: string) {
		if (RunService.IsServer()) {
			assert(serialNums > 65536, "too many identifiers");
			serialNums += 1;

			const StringValue = new Instance("StringValue");
			StringValue.Name = identifierName;
			StringValue.Value = string.pack("H", serialNums);
		}
	}
}
