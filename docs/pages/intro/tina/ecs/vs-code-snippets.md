# VS Code Snippets

VS Code snippets are a great way to speed up your development workflow.

## ECS Snippets

Below are useful VS Code snippets for Tina ECS.

### System

=== "Snippet"

    ```
	"Tina System": {
		"prefix": [
			"tinasystem",
		],
		"body": [
			"import { Query, System, World } from \"@rbxts/tina\";",
			"",
			"export class ${0:SystemName} extends System {",
			"\tconstructor() {",
			"\t\tsuper();",
			"\t}",
			"",
			"\tpublic configureQueries(world: World): void {}",
			"",
			"\tpublic onUpdate(world: World): void {}",
			"}"
		]
	}
    ```

=== "Code Result"

    ```ts
    import { Query, System, World } from "@rbxts/tina";

    export class SystemName extends System {
        constructor() {
            super();
        }

        public configureQueries(world: World): void {}

        public onUpdate(world: World): void {}
    }
    ```